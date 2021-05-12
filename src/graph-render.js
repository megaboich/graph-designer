import * as cola from "./lib/cola.esm.js";

export function renderGraph(graph) {
  const outer = d3.select("#svg-main").attr("pointer-events", "all");

  outer
    .append("rect")
    .attr("class", "background")
    .attr("width", "100%")
    .attr("height", "100%")
    .call(d3.zoom().on("zoom", redraw));

  const vis = outer.append("g");

  function redraw(event) {
    vis.attr("transform", event.transform);
  }

  const groupsLayer = vis.append("g");
  groupsLayer.attr("pointer-events", "none");

  const nodesLayer = vis.append("g");
  const linksLayer = vis.append("g");

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

  const group = groupsLayer
    .selectAll(".group")
    .data(graph.groups)
    .enter()
    .append("rect")
    .attr("rx", 8)
    .attr("ry", 8)
    .attr("class", "group")
    .attr("style", function (d) {
      return d.style;
    });

  const link = linksLayer
    .selectAll(".link")
    .data(graph.links)
    .enter()
    .append("line")
    .attr("class", "link");

  const dragNode = d3
    .drag()
    .on("start", (ev, d) => {
      cola.Layout.dragStart(d);
    })
    .on("drag", (ev, d) => {
      cola.Layout.drag(d, ev);
    })
    .on("end", (ev, d) => {
      cola.Layout.dragEnd(d);
    });

  const margin = 6;
  const pad = 12;
  const node = nodesLayer
    .selectAll(".node")
    .data(graph.nodes)
    .enter()
    .append("rect")
    .attr("class", "node")
    .attr("width", function (d) {
      return d.width + 2 * pad + 2 * margin;
    })
    .attr("height", function (d) {
      return d.height + 2 * pad + 2 * margin;
    })
    .attr("rx", function (d) {
      return d.rx;
    })
    .attr("ry", function (d) {
      return d.rx;
    })
    .call(dragNode);

  const insertLinebreaks = function (d) {
    var el = d3.select(this);
    var words = d.label.split(" ");
    el.text("");

    for (var i = 0; i < words.length; i++) {
      var tspan = el.append("tspan").text(words[i]);
      tspan.attr("x", 0).attr("dy", "15").attr("font-size", "12");
    }
  };

  const label = nodesLayer
    .selectAll(".label")
    .data(graph.nodes)
    .enter()
    .append("text")
    .attr("class", "label")
    .each(insertLinebreaks)
    .call(dragNode);

  const tick = () => {
    node.each(function (d) {
      d.innerBounds = d.bounds.inflate(-margin);
    });
    link.each(function (d) {
      d.route = cola.makeEdgeBetween(
        d.source.innerBounds,
        d.target.innerBounds,
        5
      );
    });

    link
      .attr("x1", function (d) {
        return d.route.sourceIntersection.x;
      })
      .attr("y1", function (d) {
        return d.route.sourceIntersection.y;
      })
      .attr("x2", function (d) {
        return d.route.arrowStart.x;
      })
      .attr("y2", function (d) {
        return d.route.arrowStart.y;
      });

    label.each(function (d) {
      if (d.hardWidth && d.hardHeight) {
        d.width = d.hardWidth;
        d.height = d.hardHeight;
      } else {
        var b = this.getBBox();
        d.width = b.width + 2 * margin + 8;
        d.height = b.height + 2 * margin + 8;
      }
    });

    node
      .attr("x", function (d) {
        return d.innerBounds.x;
      })
      .attr("y", function (d) {
        return d.innerBounds.y;
      })
      .attr("width", function (d) {
        return d.innerBounds.width();
      })
      .attr("height", function (d) {
        return d.innerBounds.height();
      });

    group
      .attr("x", function (d) {
        return d.bounds.x;
      })
      .attr("y", function (d) {
        return d.bounds.y;
      })
      .attr("width", function (d) {
        return d.bounds.width();
      })
      .attr("height", function (d) {
        return d.bounds.height();
      });

    label.attr("transform", function (d) {
      return (
        "translate(" + d.x + margin + "," + (d.y + margin - d.height / 2) + ")"
      );
    });
  };
  return tick;
}
