import { getRandomName } from "./helpers/get-random-name.js";
import { getRandomInt } from "./helpers/misc.js";

export async function loadGraph(dataUrl) {
  const response = await fetch(dataUrl);
  const data = await response.json();
  const nodeLookup = {};
  const graph = {};

  graph.nodes = data.nodes.map((x, i) => {
    const node = {
      ...x,
      id: x.id || x.label,
      index: i,
      width: 50,
      height: 50,
    };
    nodeLookup[node.id] = node;
    return node;
  });

  graph.links = data.links.map((x) => {
    const link = {
      source: nodeLookup[x.source].index,
      target: nodeLookup[x.target].index,
    };
    return link;
  });

  graph.groups = data.groups.map((x) => {
    const group = {
      leaves: x.members.map((id) => nodeLookup[id].index),
      style: x.style,
      padding: x.padding,
    };
    return group;
  });
  graph.constraints = [];
  return graph;
}

function getNewNodeId(graph) {
  const formatId = (x) => `n${x}`;
  const idLookup = graph.nodes.reduce((acc, node) => {
    acc[node.id] = true;
    return acc;
  }, {});
  let inc = graph.nodes.length;
  while (idLookup[formatId(inc)]) {
    ++inc;
  }
  return formatId(inc);
}

export function addNewNode(graph, linkToId) {
  const node = {
    index: graph.nodes.length,
    id: getNewNodeId(graph),
    label: getRandomName(),
    width: 50,
    height: 50,
  };

  graph.nodes.push(node);

  if (linkToId) {
    const source = graph.nodes.find((x) => x.id === linkToId);
    node.x = source.x + getRandomInt(-50, 50);
    node.y = source.y + getRandomInt(-50, 50);
    if (source) {
      graph.links.push({
        source,
        target: node,
      });
    }
  }
}

export function deleteNode(graph, nodeId) {
  // First remove all the links
  for (let i = 0; i < graph.links.length; ++i) {
    const link = graph.links[i];
    if (link.source.id === nodeId || link.target.id === nodeId) {
      graph.links.splice(i, 1);
      i--;
    }
  }
  // And remove the node
  for (let i = 0; i < graph.nodes.length; ++i) {
    if (graph.nodes[i].id === nodeId) {
      graph.nodes.splice(i, 1);
      i--;
    }
  }
}

export function addNewLink(graph, sourceId, targetId) {
  // Check if this links exists already
  const existing = graph.links.find(
    (l) => l.source.id === sourceId && l.target.id === targetId
  );
  if (existing) {
    return false;
  }

  const source = graph.nodes.find((x) => x.id === sourceId);
  const target = graph.nodes.find((x) => x.id === targetId);
  graph.links.push({
    source,
    target,
  });
  return true;
}

export function deleteLink(graph, linkToDelete) {
  for (let i = 0; i < graph.links.length; ++i) {
    const link = graph.links[i];
    if (
      link.source.id === linkToDelete.source.id &&
      link.target.id === linkToDelete.target.id
    ) {
      graph.links.splice(i, 1);
      i--;
    }
  }
}

export function revertLink(graph, link) {
  const oldSource = link.source;
  link.source = link.target;
  link.target = oldSource;
}
