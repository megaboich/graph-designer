import { cola, d3 } from "../dependencies.js";

const margin = 6;
const pad = 12;

/**
 * @callback GraphNodeClick
 * @param {GraphNode} node
 * @param {MouseEvent} event
 * @returns {void}
 */

/**
 * @callback GraphBgClick
 * @param {{x:number, y:number, event:MouseEvent}} flags
 * @returns {void}
 */

export class GraphRendererD3 {
  /**
   * @param {Object} param0
   * @param {GraphData} param0.graph
   * @param {Function} param0.onUpdate
   * @param {GraphNodeClick} param0.onNodeClick
   * @param {GraphBgClick} param0.onBgClick
   */
  constructor({ graph, onUpdate, onNodeClick, onBgClick }) {
    this.graph = graph;
    this.onUpdate = onUpdate;
    this.onNodeClick = onNodeClick;
    this.onBgClick = onBgClick;
    this.transform = { x: 0, y: 0, k: 1 };

    this.setupContainer();
    this.setupElements();
  }

  setupContainer() {
    const outer = d3
      .select("#graph-main")
      .append("svg")
      .attr("id", "svg-main")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("pointer-events", "all");
    this.outer = outer;

    outer.append("style").text(`
      .background {
        fill: white;
      }

      .node {
        stroke: black;
        stroke-width: 1px;
        cursor: move;
        fill: beige;
      }

      .node[data-selected] {
        stroke: red;
      }

      .node[data-fixed] {
        fill: pink;
      }
      
      .link {
        fill: none;
        stroke: #000;
        stroke-width: 3px;
        opacity: 0.7;
        marker-end: url(#end-arrow);
      }
      
      .label {
        fill: black;
        font-family: Verdana;
        font-size: 25px;
        font-weight: 100;
        text-anchor: middle;
        cursor: move;
      }
    `);

    outer
      .append("rect")
      .on("mousedown", (/** @type {MouseEvent} */ e) => {
        this.onBgClick({
          event: e,
          x: (e.offsetX - this.transform.x) / this.transform.k,
          y: (e.offsetY - this.transform.y) / this.transform.k,
        });
      })
      .attr("class", "background")
      .attr("width", "100%")
      .attr("height", "100%");

    // define arrow markers for graph links
    outer
      .append("svg:defs")
      .append("svg:marker")
      .attr("id", "end-arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 5)
      .attr("markerWidth", 3)
      .attr("markerHeight", 3)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5L2,0")
      .attr("stroke-width", "0px")
      .attr("fill", "#000");

    this.vis = outer.append("g").attr("id", "vis");

    const zoomHandler = (/** @type {any} */ event) => {
      const t = event.transform;
      this.transform = t;
      const dx = t.x.toFixed(1);
      const dy = t.y.toFixed(1);
      const dz = t.k.toFixed(3);
      const svgTrans = `translate(${dx},${dy}) scale(${dz})`;
      if (this.vis) {
        this.vis.attr("transform", svgTrans);
      }
    };

    // @ts-ignore
    outer.call(d3.zoom().on("zoom", zoomHandler));
  }

  setupElements() {
    const { vis } = this;
    if (!vis) {
      return;
    }
    const groupsLayer = vis.append("g");
    groupsLayer.attr("pointer-events", "none");

    const nodesLayer = vis.append("g");
    this.nodesLayer = nodesLayer;
    const linksLayer = vis.append("g");

    this.group = groupsLayer
      .selectAll(".group")
      .data(this.graph.groups)
      .enter()
      .append("rect")
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("class", "group")
      .attr("style", (d) => d.style);

    this.link = linksLayer
      .selectAll(".link")
      .data(this.graph.links)
      .enter()
      .append("line")
      .attr("class", "link");

    const dragNode = d3
      .drag()
      .on("start", (ev, d) => {
        // console.log("start");
        cola.Layout.dragStart(d);
      })
      .on("drag", (ev, d) => {
        // console.log("drag", { x: ev.x, y: ev.y });
        cola.Layout.drag(d, ev);
        this.onUpdate();
      })
      .on("end", (ev, d) => {
        // console.log("end");
        cola.Layout.dragEnd(d);
        this.onUpdate();
      });

    const onNodeClick = (
      /** @type MouseEvent */ e,
      /** @type GraphNode */ d
    ) => {
      // console.log("MOUSE", e);
      this.onNodeClick(d, e);
    };

    this.node = nodesLayer
      .selectAll(".node")
      .data(this.graph.nodes)
      .enter()
      .append("rect")
      .on("mousedown", onNodeClick)
      .attr("class", "node")
      .attr("width", (d) => (d.width ? d.width + 2 * pad + 2 * margin : null))
      .attr("height", (d) =>
        d.height ? d.height + 2 * pad + 2 * margin : null
      )
      .attr("rx", (d) => d.rx || null)
      .attr("ry", (d) => d.rx || null)
      // @ts-ignore
      .call(dragNode);

    /**
     * @this {SVGElement}
     * @param {GraphNode} d
     */
    function insertLinebreaks(d) {
      const el = d3.select(this);
      const words = d.label.split(" ");
      el.text("");

      for (let i = 0; i < words.length; i++) {
        const tspan = el.append("tspan").text(words[i]);
        tspan.attr("x", 0).attr("dy", "15").attr("font-size", "12");
      }
    }

    this.label = nodesLayer
      .selectAll(".label")
      .data(this.graph.nodes)
      .enter()
      .append("text")
      .on("mousedown", onNodeClick)
      .attr("class", "label")
      .each(insertLinebreaks)
      // @ts-ignore
      .call(dragNode);
  }

  destroyElements() {
    if (this.vis) {
      this.vis.selectAll("*").remove();
    }
  }

  update() {
    const { node, link, label, group } = this;
    if (!node || !link || !label || !group) {
      return;
    }

    node.each((d) => {
      d.innerBounds = d.bounds.inflate(-margin);
    });

    link.each((d) => {
      d.route = cola.makeEdgeBetween(
        d.source.innerBounds,
        d.target.innerBounds,
        5
      );
    });

    link
      .attr("x1", (d) => d.route.sourceIntersection.x.toFixed(1))
      .attr("y1", (d) => d.route.sourceIntersection.y.toFixed(1))
      .attr("x2", (d) => d.route.arrowStart.x.toFixed(1))
      .attr("y2", (d) => d.route.arrowStart.y.toFixed(1));

    label.each(function eachLabel(d) {
      if (d.hardWidth && d.hardHeight) {
        d.width = d.hardWidth;
        d.height = d.hardHeight;
      } else {
        const b = this.getBBox();
        d.width = b.width + 2 * margin + 8;
        d.height = b.height + 2 * margin + 8;
      }
    });

    node
      .attr("data-selected", (d) =>
        d.id === this.graph.selectedNodeId ? true : null
      )
      .attr("data-fixed", (d) => (d.fixed ? true : null))
      .attr("x", (d) => d.innerBounds.x.toFixed(1))
      .attr("y", (d) => d.innerBounds.y.toFixed(1))
      .attr("width", (d) => d.innerBounds.width().toFixed(1))
      .attr("height", (d) => d.innerBounds.height().toFixed(1));

    group
      .attr("x", (d) => d.bounds.x.toFixed(1))
      .attr("y", (d) => d.bounds.y.toFixed(1))
      .attr("width", (d) => d.bounds.width())
      .attr("height", (d) => d.bounds.height());

    label.attr("transform", (d) => {
      const { x, y, height } = d;
      if (
        typeof x === "undefined" ||
        typeof y === "undefined" ||
        typeof height === "undefined"
      ) {
        return null;
      }
      const ty = y + margin - height / 2;
      return `translate(${x.toFixed(1)},${ty.toFixed(1)})`;
    });
  }
}
