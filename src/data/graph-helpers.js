/**
 *
 * @param {string} imgUrl
 * @returns
 */
export async function getImageBase64ByUrl(imgUrl) {
  if (!imgUrl) {
    return "";
  }
  return new Promise((resolve) => {
    const imgElt = document.createElement("img");
    imgElt.addEventListener("load", () => {
      try {
        const canvasElt = document.createElement("canvas");
        canvasElt.width = 64;
        canvasElt.height = 64;
        const ctx = canvasElt.getContext("2d");
        if (!ctx) {
          resolve("");
          return;
        }
        ctx.drawImage(imgElt, 0, 0, 64, 64);
        const dataURL = canvasElt.toDataURL("image/jpeg", 0.75);
        resolve(dataURL);
      } catch (ex) {
        resolve("");
      }
    });
    imgElt.addEventListener("error", () => {
      resolve("");
    });
    imgElt.setAttribute("crossOrigin", "Anonymous");
    imgElt.setAttribute("src", imgUrl);
  });
}

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

  /** @type {Object<string, boolean>} */
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

/**
 * Gets graph image as SVG
 * @param  {boolean} isPreview
 * @returns string
 */
export function getGraphSvgImage(isPreview = false) {
  const svgEl = document.getElementById("svg-main");
  if (!svgEl) {
    return "";
  }
  let svgBody = svgEl.outerHTML;

  if (isPreview) {
    svgBody = svgBody.replace("svg", 'svg viewBox="50,50,1024,768"');
  }
  return svgBody;
}
