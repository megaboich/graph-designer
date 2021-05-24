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

export function addNewNode(graph, linkToId) {
  const node = {
    id: `node${graph.nodes.length}`,
    label: getRandomName(),
    index: graph.nodes.length,
    width: 50,
    height: 50,
  };

  graph.nodes.push(node);

  if (linkToId) {
    const target = graph.nodes.find((x) => x.id === linkToId);
    node.x = target.x + getRandomInt(-50, 50);
    node.y = target.y + getRandomInt(-50, 50);
    if (target) {
      graph.links.push({
        source: node,
        target,
      });
    }
  }
}
