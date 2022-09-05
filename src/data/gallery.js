import examplesCatalog from "../../graph-samples/_catalog.js";
import { loadGraphFromJSON, serializeToJSON } from "./graph-serialization.js";
import { kebabify } from "../helpers/misc.js";
import { getGraphSvgImage } from "./graph-helpers.js";
import { getRandomName } from "../helpers/get-random-name.js";

const LOCAL_STORAGE_PREFIX = "graph-data-";

/**
 * Gets graph Url Hash route
 * @param {string} id
 * @returns {string}
 */
export function getGalleryGraphRoute(id) {
  return `gallery/${id}`;
}

/**
 * Loads gallery data
 * @returns {Promise<GalleryItem[]>}
 */
export async function loadGallery() {
  /** @type {GalleryItem[]} */
  const gallery = [];

  // Examples
  gallery.push(
    ...examplesCatalog.map((x) => ({
      isExample: true,
      title: x.title,
      id: kebabify(x.title),
      route: `#example/${x.data.replace(".json", "")}`,
      preview: `./graph-samples/${x.preview}`,
    }))
  );

  // Local stored gallery
  for (const [key, value] of Object.entries(window.localStorage)) {
    if (key.startsWith(LOCAL_STORAGE_PREFIX)) {
      try {
        /** @type {GallerySerializedItem} */
        const data = JSON.parse(value);
        const { title, preview, creationDate, updateDate } = data;
        const id = key.substring(LOCAL_STORAGE_PREFIX.length);
        gallery.push({
          isExample: false,
          title,
          creationDate: new Date(creationDate),
          updateDate: new Date(updateDate),
          id,
          route: `#${getGalleryGraphRoute(id)}`,
          preview: preview || "./src/images/no-image.svg",
        });
      } catch (ex) {
        // suppress and ignore
      }
    }
  }

  // Sort by update time if available
  gallery.sort((a, b) => {
    if (a.updateDate && b.updateDate) {
      return b.updateDate.getTime() - a.updateDate.getTime();
    }
    return 0;
  });

  return gallery;
}

/**
 * Loads graph from gallery by route
 * @param {string} route
 * @returns {Promise<GraphLoadedFromGallery>}
 */
export async function loadGraphByRoute(route) {
  if (route.startsWith("example/")) {
    const id = route.substring(8);
    const matchingExample = examplesCatalog.find((x) => x.id === id);
    if (!matchingExample) {
      throw new Error("Graph was not found");
    }
    const dataUrl = `graph-samples/${matchingExample.data}`;
    try {
      const response = await fetch(dataUrl);
      /** @type {GraphSerializedData} */
      const data = await response.json();
      const graph = await loadGraphFromJSON(data);
      return {
        graph,
        isReadonly: true,
        id,
        title: matchingExample.title,
      };
    } catch (ex) {
      // TODO: Do something
    }
  }
  if (route.startsWith("gallery/")) {
    const id = route.substring(8);
    try {
      const dataStr = window.localStorage.getItem(LOCAL_STORAGE_PREFIX + id) || "";

      /** @type {GallerySerializedItem} */
      const galleryItem = JSON.parse(dataStr);
      const graph = await loadGraphFromJSON(JSON.parse(galleryItem.jsonDataSerialized));
      return {
        graph,
        isReadonly: false,
        id,
        title: galleryItem.title,
      };
    } catch (ex) {
      // TODO: Do something
    }
  }

  throw new Error("Graph was not found");
}

/**
 * Saves graph to local storage
 * @param {GraphData} graph
 * @param {string} title
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function saveToLocalStorage(graph, title, id) {
  const json = serializeToJSON(graph);
  const preview = `data:image/svg+xml;utf8,${encodeURIComponent(getGraphSvgImage(true))}`;

  /** @type {GallerySerializedItem} */
  const galleryEntry = {
    title,
    jsonDataSerialized: JSON.stringify(json),
    preview,
    creationDate: new Date().toUTCString(),
    updateDate: new Date().toUTCString(),
  };

  const existingGraphDataStr = window.localStorage.getItem(LOCAL_STORAGE_PREFIX + id);
  if (existingGraphDataStr) {
    // Graph already was saved - we need to use the same creation date
    /** @type {GallerySerializedItem} */
    const existingData = JSON.parse(existingGraphDataStr);
    galleryEntry.creationDate = existingData.creationDate;
  }

  window.localStorage.setItem(LOCAL_STORAGE_PREFIX + id, JSON.stringify(galleryEntry));
}

/**
 * Remove graph from local storage
 * @param {String} id
 */
export async function removeFromLocalStorage(id) {
  try {
    window.localStorage.removeItem(LOCAL_STORAGE_PREFIX + id);
  } catch (ex) {
    // TODO: show notification maybe
  }
}

/**
 * Imports graph to the library
 * Returns the route identifier
 * @param {string} json
 * @return {Promise<string>}
 */
export async function importGraphToLibraryFromJSON(json) {
  /** @type {GraphSerializedData} */
  const serializedGraphData = JSON.parse(json);
  const graph = await loadGraphFromJSON(serializedGraphData);
  const newTitle = getRandomName();
  const newId = kebabify(newTitle);
  await saveToLocalStorage(graph, newTitle, newId);
  return newId;
}
