import examples from "../../graph-samples/_catalog.js";
import { loadGraphFromJSON, serializeToJSON } from "./graph-serialization.js";
import { kebabify } from "../helpers/misc.js";

const LOCAL_STORAGE_PREFIX = "graph-data-";

/**
 * Loads gallery data
 * @returns Promise<Array<GalleryEntry>>
 */
export async function loadGallery() {
  /** @type Array<GalleryEntry> */
  const gallery = [];

  // Examples
  gallery.push(
    ...examples.map((x) => ({
      isExample: true,
      name: x.name,
      id: kebabify(x.name),
      route: `#example/${x.data.replace(".json", "")}`,
      preview: `./graph-samples/${x.preview}`,
    }))
  );

  // Local stored gallery
  for (const [key, value] of Object.entries(window.localStorage)) {
    if (key.startsWith(LOCAL_STORAGE_PREFIX)) {
      try {
        const data = JSON.parse(value);
        const { title } = data;
        gallery.push({
          isExample: false,
          name: title,
          id: kebabify(title),
          route: `#gallery/${kebabify(title)}`,
          preview: "./src/images/no-image.svg",
        });
      } catch (ex) {
        // suppress and ignore
      }
    }
  }

  return gallery;
}

/**
 * Loads graph from gallery by route
 * @param {string} route
 * @returns {Promise<GraphData>}
 */
export async function loadGraphByRoute(route) {
  if (route.startsWith("example/")) {
    const id = route.substr(8);
    const dataUrl = `graph-samples/${id}.json`;
    try {
      const response = await fetch(dataUrl);
      /** @type {GraphSerializedData} */
      const data = await response.json();
      return loadGraphFromJSON(data);
    } catch (ex) {
      // Do something
    }
  }
  if (route.startsWith("gallery/")) {
    const id = route.substr(8);
    try {
      const dataStr =
        window.localStorage.getItem(LOCAL_STORAGE_PREFIX + id) || "";
      const data = JSON.parse(dataStr);
      return loadGraphFromJSON(data.json);
    } catch (ex) {
      // Do something
    }
  }

  throw new Error("Graph was not found");
}

/**
 * Saves graph to local storage
 * @param {GraphData} graph
 * @param {string} title
 */
export async function saveToLocalStorage(graph, title) {
  const json = serializeToJSON(graph);
  window.localStorage.setItem(
    LOCAL_STORAGE_PREFIX + kebabify(title),
    JSON.stringify({
      title,
      json,
    })
  );
}
