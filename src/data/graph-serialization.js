import { getRandomName } from "../helpers/get-random-name.js";
import { assignNodeImageAndDimensions } from "./graph-helpers.js";

/**
 * Load graph data from serialized data
 * @param {GraphSerializedData} data
 * @returns Promise<GraphData>
 */
export async function loadGraphFromJSON(data) {
  /** @type {Object<string,GraphNode>} */
  const nodeLookup = {};
  /** @type {GraphData} */
  const graph = {};

  /** @type {Array<Promise<void>>} */
  const promises = [];
  graph.nodes = data.nodes.map((sn, i) => {
    /** @type {GraphNode} */
    const node = {
      id: sn.id || sn.label,
      label: sn.label,
      index: i,
      x: sn.x,
      y: sn.y,
      width: sn.width || 50,
      height: sn.height || 50,
    };

    if (sn.image) {
      promises.push(assignNodeImageAndDimensions(node, sn.image, sn.imageZoom));
    }
    nodeLookup[node.id] = node;
    return node;
  });

  graph.links = data.links.map((x) => {
    const link = {
      source: nodeLookup[x.source],
      target: nodeLookup[x.target],
    };
    return link;
  });

  graph.groups = (data.groups || []).map((x) => {
    const group = {
      leaves: x.members.map((id) => nodeLookup[id].index),
      style: x.style,
      padding: x.padding,
    };
    return group;
  });
  graph.constraints = [];

  graph.transform = data.transform || { x: 0, y: 0, k: 1 };

  graph.options = data.options || {
    title: getRandomName(),
    layoutType: "auto",
    linkDistance: 80,
    minSeparation: 160,
  };

  if (promises.length) {
    await Promise.all(promises);
  }
  return graph;
}

/**
 * Reverts the link in the graph
 * @param {GraphData} graph
 * @return {GraphSerializedData}
 */
export function serializeToJSON(graph) {
  /**
   * Graph object has multiple references to same objects like links to nodes or groups to nodes
   * Also webCola adds some crazy circular fields to objects
   * */

  /** @type {GraphSerializedData} */
  const graphJSON = {
    nodes: graph.nodes.map((n) => ({
      id: n.id,
      label: n.label,
      x: n.x,
      y: n.y,
      image: n.imageUrl,
      imageZoom: n.imageZoom,
    })),
    links: graph.links.map((li) => ({
      source: li.source.id,
      target: li.target.id,
    })),
    groups: graph.groups.map((g) => ({
      style: g.style,
      padding: g.padding,
      members: g.leaves.map((/** @type {GraphNode | number} */ node) => {
        if (node && typeof node === "object") {
          return node.id;
        }
        throw new Error("Node is expected to be an object");
      }),
    })),
    transform: graph.transform,
    options: graph.options,
  };

  return graphJSON;
}
