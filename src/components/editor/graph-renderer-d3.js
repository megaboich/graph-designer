import { cola, d3 } from "../../dependencies.js";

/**
 * @callback GraphNodeClick
 * @param {MouseEvent} event
 * @param {GraphNode} node
 * @returns {void}
 
 * @callback GraphBgClick
 * @param {{x:number, y:number, event:MouseEvent}} flags
 * @returns {void}
 */

const NODE_FONT_SIZE = 14;
const NODE_PADDING_TOP = 5;
const NODE_PADDING_LEFT = 10;

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
    this.transform = graph.transform || { x: 0, y: 0, k: 1 };
    this.needsNodeSizeAdjustment = false;

    this.setupContainer();
    this.setupElements();
  }

  setupContainer() {
    const outer = d3
      .select("#main")
      .append("svg")
      .attr("id", "svg-main")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("pointer-events", "all");
    this.outer = outer;

    outer.append("style").text(`
      .background {
        fill: white;
      }

      .node > .node-bg {
        stroke: black;
        stroke-width: 1px;
        cursor: move;
        fill: beige;
      }

      .node[data-selected] > .node-bg {
        stroke: red;
      }

      .node[data-fixed] > .node-bg {
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
        font-size: ${NODE_FONT_SIZE}px;
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
      this.graph.transform = t;
      this.applyTransform(t);
    };

    const initialTransform = d3.zoomIdentity
      .translate(this.transform.x, this.transform.y)
      .scale(this.transform.k);

    const zoom = d3.zoom().on("zoom", zoomHandler);

    // Disable types check for next line because TypeScript wants to check generics, but it's impossible to define them with JSDoc for now.
    // @ts-ignore
    outer.call(zoom);
    // @ts-ignore
    outer.call(zoom.transform, initialTransform);
  }

  /**
   * Applies transformation to container SVG element
   * @param {GraphTransform} t
   */
  applyTransform(t) {
    this.transform = t;
    const dx = t.x.toFixed(1);
    const dy = t.y.toFixed(1);
    const dz = t.k.toFixed(3);
    const svgTrans = `translate(${dx},${dy}) scale(${dz})`;
    if (this.vis) {
      this.vis.attr("transform", svgTrans);
    }
  }

  setupElements() {
    const { vis } = this;
    if (!vis) {
      return;
    }
    const groupsLayer = vis.append("g");
    groupsLayer.attr("data-groups-layer", true);
    groupsLayer.attr("pointer-events", "none");

    const nodesLayer = vis.append("g");
    nodesLayer.attr("data-nodes-layer", true);
    this.nodesLayer = nodesLayer;
    const linksLayer = vis.append("g");
    linksLayer.attr("data-links-layer", true);

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

    this.node = nodesLayer
      .selectAll(".node")
      .data(this.graph.nodes)
      .enter()
      .append("svg")
      .attr("width", (d) => d.width || 30)
      .attr("height", (d) => d.height || 30)
      .on("mousedown", this.onNodeClick)
      .attr("class", "node")
      // @ts-ignore
      .call(dragNode); // Disable types check for next line because TypeScript wants to check generics, but it's impossible to define them with JSDoc for now.

    this.needsNodeSizeAdjustment = true;

    /**
     * @this {SVGElement}
     * @param {GraphNode} d
     */
    function construstNodeChildElements(d) {
      const words = d.label.split("\n");
      const el = d3.select(this);

      el.append("rect")
        .attr("class", "node-bg")
        .attr("width", "100%")
        .attr("height", "100%");

      if (d.imageUrl) {
        const image = el
          .append("image")
          .attr("href", d.imageUrl)
          .attr(
            "style",
            `transform: translate(calc(50% - ${
              (d.imageWidth || 1) / 2
            }.001px), ${NODE_PADDING_TOP}px);`
          )
          .attr("width", d.imageWidth || 1)
          .attr("height", d.imageHeight || 1)
          .on("load", () => {
            // This adds additional repaint/reflow on image load just to fix Chrome weird behavior of not applying calc at the first rendering of the node
            image.attr(
              "style",
              `transform: translate(calc(50% - ${
                (d.imageWidth || 1) / 2
              }px), ${NODE_PADDING_TOP}px);`
            );
          });
      }

      const text = el
        .append("text")
        .attr("class", "label")
        .attr("x", "50%")
        .attr("y", "0")
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "middle");

      for (let i = 0; i < words.length; i++) {
        const tspan = text.append("tspan").text(words[i]);
        tspan
          .attr("x", "50%")
          .attr(
            "dy",
            i === 0
              ? NODE_FONT_SIZE +
                  (d.imageUrl ? d.imageHeight || 1 + NODE_PADDING_TOP / 2 : 0)
              : NODE_FONT_SIZE
          );
      }
    }

    this.node.each(construstNodeChildElements);
  }

  destroyElements() {
    if (this.vis) {
      this.vis.selectAll("*").remove();
    }
  }

  update() {
    const { node, link, group, onUpdate } = this;
    if (!node || !link || !group) {
      return;
    }

    link.each((d) => {
      d.route = cola.makeEdgeBetween(d.source.bounds, d.target.bounds, -2);
    });

    link
      .attr("x1", (d) => d.route.sourceIntersection.x.toFixed(1))
      .attr("y1", (d) => d.route.sourceIntersection.y.toFixed(1))
      .attr("x2", (d) => d.route.arrowStart.x.toFixed(1))
      .attr("y2", (d) => d.route.arrowStart.y.toFixed(1));

    /**
     * @param d {GraphNode}
     * @this {SVGGraphicsElement}
     */
    function adjustNodeSize(d) {
      const bb = this.getBBox();
      const nw =
        Math.max(bb.width, d.imageUrl ? d.imageWidth || 1 : 0) +
        NODE_PADDING_LEFT * 2;
      const nh =
        bb.height +
        NODE_PADDING_TOP * 2 +
        (d.imageUrl ? d.imageHeight || 1 : 0);
      if (nw !== d.width || nh !== d.height) {
        d.width = nw;
        d.height = nh;
        onUpdate(true);
      }
    }

    if (this.needsNodeSizeAdjustment) {
      node.select(".label").each(adjustNodeSize);
      this.needsNodeSizeAdjustment = false;
    }

    node
      .attr("data-selected", (d) =>
        d.id === this.graph.selectedNodeId ? true : null
      )
      .attr("data-fixed", (d) => (d.fixed ? true : null))
      .attr("x", (d) => d.bounds.x.toFixed(1))
      .attr("y", (d) => d.bounds.y.toFixed(1))
      .attr("width", (d) => d.bounds.width().toFixed(1))
      .attr("height", (d) => d.bounds.height().toFixed(1));

    group
      .attr("x", (d) => d.bounds.x.toFixed(1))
      .attr("y", (d) => d.bounds.y.toFixed(1))
      .attr("width", (d) => d.bounds.width().toFixed(1))
      .attr("height", (d) => d.bounds.height().toFixed(1));
  }
}
