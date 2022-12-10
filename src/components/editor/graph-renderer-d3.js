import { cola, d3 } from "../../dependencies.js";

/**
 * @callback GraphNodeClick
 * @param {MouseEvent} event
 * @param {GraphNode} node
 * @returns {void}
 
 * @callback GraphBgClick
 * @param {{x:number, y:number, event:MouseEvent}} flags
 * @returns {void}
 * 
 * @callback GraphNodeMove
 * @param {GraphNode} node
 * @returns {void}
 */

const NODE_FONT_SIZE = 14;
const NODE_PADDING_TOP = 5;
const NODE_PADDING_LEFT = 10;

export class GraphRendererD3 {
  /**
   * @param {Object} param0
   * @param {GraphData} param0.graph
   * @param {GraphNodeMove} param0.onNodeMove
   * @param {GraphNodeClick} param0.onNodeClick
   * @param {GraphBgClick} param0.onBgClick
   */
  constructor({ graph, onNodeMove, onNodeClick, onBgClick }) {
    this.graph = graph;
    this.onNodeMove = onNodeMove;
    this.onNodeClick = onNodeClick;
    this.onBgClick = onBgClick;
    this.transform = graph.transform || { x: 0, y: 0, k: 1 };
    this.selectedNodeId = null;
    this.nodeSizeWasChangedDuringRender = false;

    this.renderContainer();
    this.renderElements();
  }

  renderContainer() {
    const outer = d3
      .select("#main")
      .append("svg")
      .attr("id", "svg-main")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("pointer-events", "all");
    this.outer = outer;

    /**
     * Inlining CSS styles to make svg element self-sufficient for export purposes
     */
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

    const initialTransform = d3.zoomIdentity.translate(this.transform.x, this.transform.y).scale(this.transform.k);

    /** @type {any} */
    const zoom = d3.zoom().on("zoom", zoomHandler);

    outer.call(zoom);
    outer.call(zoom.transform, initialTransform);

    this.groupsLayer = this.vis.append("g").attr("data-groups-layer", true).attr("pointer-events", "none");
    this.nodesLayer = this.vis.append("g").attr("data-nodes-layer", true);
    this.linksLayer = this.vis.append("g").attr("data-links-layer", true);

    /** @type {any} */
    this.dragNode = d3
      .drag()
      .on("start", (ev, d) => {
        // console.log("start");
        cola.Layout.dragStart(d);
      })
      .on("drag", (ev, d) => {
        // console.log("drag", { x: ev.x, y: ev.y });
        cola.Layout.drag(d, ev);
        this.onNodeMove(d);
      })
      .on("end", (ev, d) => {
        // console.log("end");
        cola.Layout.dragEnd(d);
        this.onNodeMove(d);
      });
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

  renderElements() {
    const { vis, groupsLayer, nodesLayer, linksLayer } = this;
    if (!vis || !groupsLayer || !nodesLayer || !linksLayer) {
      return;
    }
    const _this = this;

    this.group = groupsLayer
      .selectAll(".group")
      /** Bind groups */
      .data(this.graph.groups)
      .enter()
      .append("rect")
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("class", "group")
      .attr("style", (d) => d.style);

    this.link = linksLayer
      .selectAll(".link")
      /** Bind links */
      .data(this.graph.links)
      .join(
        (enter) => enter.append("line").attr("class", "link"),
        (update) => update,
        (exit) => exit.remove()
      );

    /**
     * @this {SVGElement}
     * @param {GraphNode} d
     */
    function renderNodeElements(d) {
      const words = d.label.split("\n");
      const el = d3.select(this);

      el.append("rect").attr("class", "node-bg").attr("width", "100%").attr("height", "100%");

      if (d.imageUrl) {
        el.append("image")
          .attr("href", d.imageUrl)
          .attr("width", d.imageWidth || 1)
          .attr("height", d.imageHeight || 1);
      }

      const text = el
        .append("text")
        .attr("class", "label")
        .attr("y", "0")
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "middle");

      for (let i = 0; i < words.length; i++) {
        const tspan = text.append("tspan").text(words[i]);
        tspan
          .attr("x", "50%")
          .attr(
            "dy",
            i === 0 ? NODE_FONT_SIZE + (d.imageUrl ? d.imageHeight || 1 + NODE_PADDING_TOP / 2 : 0) : NODE_FONT_SIZE
          );
      }

      // Calculating node width and height
      const gTextNode = text.node();
      if (gTextNode) {
        const bbText = gTextNode.getBBox();
        const nw = Math.max(bbText.width, d.imageUrl ? d.imageWidth || 1 : 0) + NODE_PADDING_LEFT * 2;
        const nh = bbText.height + NODE_PADDING_TOP * 2 + (d.imageUrl ? d.imageHeight || 1 : 0);
        if (nw !== d.width || nh !== d.height) {
          d.width = nw;
          d.height = nh;
          _this.nodeSizeWasChangedDuringRender = true;
        }
      }

      if (d.imageUrl) {
        el.select("image")
          .attr("x", ((d.width || 0) - (d.imageWidth || 0)) / 2)
          .attr("y", NODE_PADDING_TOP);
      }
    }

    /**
     * @this {SVGElement}
     * @param {GraphNode} d
     */
    function rerenderNodeElements(d) {
      if (d.needsToRerender) {
        d3.select(this).selectAll("*").remove();
        renderNodeElements.bind(this)(d);
        d.needsToRerender = false;
      }
    }

    this.node = nodesLayer
      .selectAll(".node")
      /** Bind nodes */
      .data(this.graph.nodes, (d) => d.id)
      .join(
        (enter) =>
          enter
            .append("svg")
            .attr("width", (d) => d.width || 30)
            .attr("height", (d) => d.height || 30)
            .on("mousedown", this.onNodeClick)
            .attr("class", "node")
            .call(this.dragNode)
            .each(renderNodeElements),
        (update) => update.each(rerenderNodeElements),
        (exit) => exit.remove()
      );
  }

  /**
   * @param {string} selectedNodeId
   */
  setSelectedNodeId(selectedNodeId) {
    this.selectedNodeId = selectedNodeId;
  }

  /**
   * Updates some elements with most recent simple data changes - like coordinates of nodes and links or selection status
   * @returns
   */
  updateElements() {
    const { node, link, group } = this;
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

    node
      .attr("data-selected", (d) => (d.id === this.selectedNodeId ? true : null))
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
