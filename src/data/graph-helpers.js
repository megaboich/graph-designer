/**
 * Loads image dimenstions from url and assigns it to node
 * @param {GraphNode} node
 * @param {String | undefined} url
 * @param {Function} onLoaded Callback when image is loaded succesfully
 */
export function assignNodeImageAndDimensions(node, url, onLoaded) {
  if (!url) {
    return;
  }
  const img = new Image();
  img.onload = () => {
    node.imageOriginalWidth = img.naturalWidth;
    node.imageOriginalHeight = img.naturalHeight;
    node.imageWidth = img.naturalWidth;
    node.imageHeight = img.naturalHeight;
    node.imageZoom = 100;
    node.imageUrl = img.src;
    onLoaded();
  };
  img.src = url;
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
