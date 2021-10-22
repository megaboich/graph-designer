/**
 * Loads image dimenstions from url and assigns it to node
 * @param {GraphNode} node
 * @param {String | undefined} url
 * @returns {Promise<void>}
 */
export async function assignNodeImageAndDimensions(node, url, zoom = 100) {
  if (!url) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      node.imageOriginalWidth = img.naturalWidth;
      node.imageOriginalHeight = img.naturalHeight;
      node.imageZoom = zoom;
      node.imageWidth = Math.round((img.naturalWidth * zoom) / 100);
      node.imageHeight = Math.round((img.naturalHeight * zoom) / 100);
      node.imageUrl = img.src;
      resolve();
    };
    img.src = url;
  });
}

/**
 * Generates new unique Id to be used later
 * @param {GraphData} graph
 * @returns
 */
export function getNewNodeId(graph) {
  /**
   * Formats number to string Id
   * @param {number} x
   * @returns Formatted string id
   */
  const formatId = (x) => `n${x}`;

  /** @type {{[key: string]: boolean}} */
  const idLookup = {};
  graph.nodes.forEach((node) => {
    idLookup[node.id] = true;
  });

  let inc = graph.nodes.length;
  while (idLookup[formatId(inc)]) {
    ++inc;
  }
  return formatId(inc);
}
