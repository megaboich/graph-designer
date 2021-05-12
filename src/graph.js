var outer = d3
    .select('#svg-main')
    .attr('pointer-events', 'all');

outer
    .append('rect')
    .attr('class', 'background')
    .attr('width', '100%')
    .attr('height', '100%')
    .call(d3.behavior.zoom().on('zoom', redraw));

var d3cola = cola.d3adaptor(d3)
    .linkDistance(40)
    .avoidOverlaps(true)
    .size([1000, 1000]);

var vis = outer.append('g').attr('transform', 'translate(0,0) scale(1)');

function redraw() {
    vis.attr(
        'transform',
        'translate(' + d3.event.translate + ')' + ' scale(' + d3.event.scale + ')'
    );
}

var groupsLayer = vis.append('g');
groupsLayer.attr('pointer-events', 'none');

var nodesLayer = vis.append('g');
var linksLayer = vis.append('g');

export async function loadGraph(dataUrl) {
    const response = await fetch(dataUrl);
    const data = await response.json();
    const nodeLookup = {};
    const graph = {};

    graph.nodes = data.nodes.map((x, i) => {
        const node = {
            ...x,
            index: i,
            width: 200,
            height: 200,
        };
        nodeLookup[x.id] = node;
        return node;
    });

    graph.links = data.links.map((x, i) => {
        const link = {
            source: nodeLookup[x.source].index,
            target: nodeLookup[x.target].index,
        };
        return link;
    });

    graph.groups = data.groups.map((x, i) => {
        const group = {
            leaves: x.members.map(id => nodeLookup[id].index),
            style: x.style,
            padding: x.padding
        };
        return group;
    });
    graph.constraints = [];

    d3cola
        .nodes(graph.nodes)
        .links(graph.links)
        .groups(graph.groups)
        .constraints(graph.constraints)
        .start();

    // define arrow markers for graph links
    outer
        .append('svg:defs')
        .append('svg:marker')
        .attr('id', 'end-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 5)
        .attr('markerWidth', 3)
        .attr('markerHeight', 3)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5L2,0')
        .attr('stroke-width', '0px')
        .attr('fill', '#000');

    var group = groupsLayer
        .selectAll('.group')
        .data(graph.groups)
        .enter()
        .append('rect')
        .attr('rx', 8)
        .attr('ry', 8)
        .attr('class', 'group')
        .attr('style', function (d) {
            return d.style;
        });

    var link = linksLayer
        .selectAll('.link')
        .data(graph.links)
        .enter()
        .append('line')
        .attr('class', 'link');

    var margin = 6,
        pad = 12;
    var node = nodesLayer
        .selectAll('.node')
        .data(graph.nodes)
        .enter()
        .append('rect')
        .attr('class', 'node')
        .attr('width', function (d) {
            return d.width + 2 * pad + 2 * margin;
        })
        .attr('height', function (d) {
            return d.height + 2 * pad + 2 * margin;
        })
        .attr('rx', function (d) {
            return d.rx;
        })
        .attr('ry', function (d) {
            return d.rx;
        })
        .call(d3cola.drag);

    var label = nodesLayer
        .selectAll('.label')
        .data(graph.nodes)
        .enter()
        .append('text')
        .attr('class', 'label')
        .call(d3cola.drag);

    var insertLinebreaks = function (d) {
        var el = d3.select(this);
        var words = d.label.split(' ');
        el.text('');

        for (var i = 0; i < words.length; i++) {
            var tspan = el.append('tspan').text(words[i]);
            tspan.attr('x', 0).attr('dy', '15').attr('font-size', '12');
        }
    };

    label.each(insertLinebreaks);

    d3cola.on('tick', function () {
        node.each(function (d) {
            d.innerBounds = d.bounds.inflate(-margin);
        });
        link.each(function (d) {
            d.route = cola.makeEdgeBetween(d.source.innerBounds, d.target.innerBounds, 5);
        });

        link
            .attr('x1', function (d) {
                return d.route.sourceIntersection.x;
            })
            .attr('y1', function (d) {
                return d.route.sourceIntersection.y;
            })
            .attr('x2', function (d) {
                return d.route.arrowStart.x;
            })
            .attr('y2', function (d) {
                return d.route.arrowStart.y;
            });

        label.each(function (d) {
            var b = this.getBBox();
            d.width = b.width + 2 * margin + 8;
            d.height = b.height + 2 * margin + 8;
        });

        node
            .attr('x', function (d) {
                return d.innerBounds.x;
            })
            .attr('y', function (d) {
                return d.innerBounds.y;
            })
            .attr('width', function (d) {
                return d.innerBounds.width();
            })
            .attr('height', function (d) {
                return d.innerBounds.height();
            });

        group
            .attr('x', function (d) {
                return d.bounds.x;
            })
            .attr('y', function (d) {
                return d.bounds.y;
            })
            .attr('width', function (d) {
                return d.bounds.width();
            })
            .attr('height', function (d) {
                return d.bounds.height();
            });

        label.attr('transform', function (d) {
            return 'translate(' + d.x + margin + ',' + (d.y + margin - d.height / 2) + ')';
        });
    });
}