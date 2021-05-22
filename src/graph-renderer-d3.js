import { cola, d3 } from "./dependencies.js";

const margin = 6;
const pad = 12;

export class GraphRendererD3 {
  constructor({ graph, onUpdate }) {
    this.graph = graph;
    this.onUpdate = onUpdate;
    this.setup();
  }

  setup() {
    const outer = d3.select("#svg-main").attr("pointer-events", "all");
    this.outer = outer;

    outer
      .append("rect")
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

    const vis = outer.append("g");

    outer.call(
      d3.zoom().on("zoom", (event) => vis.attr("transform", event.transform))
    );

    const groupsLayer = vis.append("g");
    groupsLayer.attr("pointer-events", "none");

    const nodesLayer = vis.append("g");
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

    this.node = nodesLayer
      .selectAll(".node")
      .data(this.graph.nodes)
      .enter()
      .append("rect")
      .attr("class", "node")
      .attr("width", (d) => d.width + 2 * pad + 2 * margin)
      .attr("height", (d) => d.height + 2 * pad + 2 * margin)
      .attr("rx", (d) => d.rx)
      .attr("ry", (d) => d.rx)
      .call(dragNode);

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
      .attr("class", "label")
      .each(insertLinebreaks)
      .call(dragNode);
  }

  update() {
    this.node.each((d) => {
      d.innerBounds = d.bounds.inflate(-margin);
    });

    this.link.each((d) => {
      d.route = cola.makeEdgeBetween(
        d.source.innerBounds,
        d.target.innerBounds,
        5
      );
    });

    this.link
      .attr("x1", (d) => d.route.sourceIntersection.x)
      .attr("y1", (d) => d.route.sourceIntersection.y)
      .attr("x2", (d) => d.route.arrowStart.x)
      .attr("y2", (d) => d.route.arrowStart.y);

    this.label.each(function eachLabel(d) {
      if (d.hardWidth && d.hardHeight) {
        d.width = d.hardWidth;
        d.height = d.hardHeight;
      } else {
        const b = this.getBBox();
        d.width = b.width + 2 * margin + 8;
        d.height = b.height + 2 * margin + 8;
      }
    });

    this.node
      .attr("x", (d) => d.innerBounds.x)
      .attr("y", (d) => d.innerBounds.y)
      .attr("width", (d) => d.innerBounds.width())
      .attr("height", (d) => d.innerBounds.height());

    this.group
      .attr("x", (d) => d.bounds.x)
      .attr("y", (d) => d.bounds.y)
      .attr("width", (d) => d.bounds.width())
      .attr("height", (d) => d.bounds.height());

    this.label.attr(
      "transform",
      (d) => `translate(${d.x}${margin},${d.y + margin - d.height / 2})`
    );
  }
}
