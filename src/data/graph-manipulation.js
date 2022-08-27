import { getNewNodeId } from "./graph-helpers.js";
import { getRandomName } from "../helpers/get-random-name.js";
import { getRandomInt } from "../helpers/misc.js";

/**
 * Adds new node to graph
 * @param {GraphData} graph
 * @param {string=} linkToId
 * @param {any} attrs
 */
export function addNewNode(graph, linkToId, attrs = {}) {
  /** @type {GraphNode} */
  const node = {
    index: graph.nodes.length,
    id: getNewNodeId(graph),
    label: getRandomName(),
    width: 50,
    height: 50,
    ...attrs,
  };

  graph.nodes.push(node);

  if (linkToId) {
    const source = graph.nodes.find((x) => x.id === linkToId);
    if (source) {
      graph.links.push({
        source,
        target: node,
      });
      if (typeof node.x === "undefined" && typeof node.y === "undefined") {
        if (typeof source.x !== "undefined" && typeof source.y !== "undefined") {
          node.x = source.x + getRandomInt(-50, 50);
          node.y = source.y + getRandomInt(-50, 50);
        }
      }
    }
  }
}

/**
 * Deletes node and connected links from the graph
 * @param {GraphData} graph
 * @param {string=} nodeId
 */
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

/**
 * Adds new link to the graph
 * @param {GraphData} graph
 * @param {string} sourceId
 * @param {string} targetId
 * @returns {boolean} true in case links was added, false if ids were not found or link was existed before
 */
export function addNewLink(graph, sourceId, targetId) {
  // Check if this links exists already
  const existing = graph.links.find((l) => l.source.id === sourceId && l.target.id === targetId);
  if (existing) {
    return false;
  }

  const source = graph.nodes.find((x) => x.id === sourceId);
  const target = graph.nodes.find((x) => x.id === targetId);
  if (source && target) {
    graph.links.push({
      source,
      target,
    });
    return true;
  }

  return false;
}

/**
 * Deletes link from th graph
 * @param {GraphData} graph
 * @param {GraphLink} linkToDelete
 */
export function deleteLink(graph, linkToDelete) {
  for (let i = 0; i < graph.links.length; ++i) {
    const link = graph.links[i];
    if (link.source.id === linkToDelete.source.id && link.target.id === linkToDelete.target.id) {
      graph.links.splice(i, 1);
      i--;
    }
  }
}

/**
 * Reverts the link in the graph
 * @param {GraphData} graph
 * @param {GraphLink} link
 */
export function revertLink(graph, link) {
  const oldSource = link.source;
  link.source = link.target;
  link.target = oldSource;
}
