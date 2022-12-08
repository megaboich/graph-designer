import { html, saveAs } from "../../dependencies.js";

import { TopPanel } from "../top-panel.js";
import { Modal } from "../generic/modal.js";
import { serializeToJSON } from "../../data/graph-serialization.js";

import { getRandomName } from "../../helpers/get-random-name.js";
import { getGraphSvgImage } from "../../data/graph-helpers.js";
import { saveToLocalStorage, removeFromLocalStorage, getGalleryGraphRoute } from "../../data/gallery.js";
import { kebabify } from "../../helpers/misc.js";
import { vueProp } from "../../helpers/vue-prop.js";

/**
 * @typedef {typeof component.props} Props
 * @typedef {ReturnType<typeof component.data>} State
 * @typedef {typeof component.methods} Methods
 * @typedef {Props & State & Methods & VueComponent} ThisVueComponent
 */

const component = {
  props: {
    /** @type {GraphData} */
    graph: vueProp(Object),

    graphId: vueProp(String),
    graphTitle: vueProp(String),
    isReadonly: vueProp(Boolean),
  },

  data() {
    return {
      isExportModalOpened: false,
    };
  },

  /**
   * @this {ThisVueComponent}
   */
  render() {
    return html`
      <div id="top-panel">
        <${TopPanel}
          topRightMenuItems=${[
            !this.isReadonly && {
              label: `Save graph "${this.graphTitle}"`,
              onclick: this.saveGraph,
            },
            {
              label: "Save as a copy",
              onclick: this.saveAsGraph,
            },
            {
              label: "Export",
              onclick: () => {
                this.isExportModalOpened = true;
              },
            },
            !this.isReadonly && {
              separator: true,
            },
            !this.isReadonly && {
              label: `Delete graph "${this.graphTitle}"`,
              onclick: this.deleteGraph,
            },
          ]}
        />

        ${this.isExportModalOpened &&
        html`
          <${Modal}
            title="Export"
            onclose=${() => {
              this.isExportModalOpened = false;
            }}
          >
            <table class="table">
              <tbody>
                <tr>
                  <td>
                    <button
                      class="button is-info"
                      onclick=${() => {
                        this.exportGraph("svg");
                        this.isExportModalOpened = false;
                      }}
                    >
                      Export to SVG
                    </button>
                  </td>
                  <td>
                    <p>Creates a SVG image.</p>
                  </td>
                </tr>
                <tr>
                  <td class="pt-5">
                    <button
                      class="button is-info"
                      onclick=${() => {
                        this.exportGraph("json");
                        this.isExportModalOpened = false;
                      }}
                    >
                      Export to JSON
                    </button>
                  </td>
                  <td class="pt-5">
                    <p>Saves the graph data in custom JSON format. Can be imported back.</p>
                  </td>
                </tr>
                <tr>
                  <td class="pt-5">
                    <button
                      class="button is-info"
                      onclick=${() => {
                        //
                      }}
                    >
                      Export to Base64
                    </button>
                  </td>
                  <td class="pt-5">
                    <p>
                      Saves the graph data in custom Base64 encoded format. Can be used to share in text form like
                      messengers, urls or internet forums.
                    </p>
                    <p>(Not implemented yet)</p>
                  </td>
                </tr>
              </tbody>
            </table>
          <//>
        `}
      </div>
    `;
  },

  methods: {
    /**
     * @this {ThisVueComponent}
     * @param {String} exportType
     */
    exportGraph(exportType) {
      switch (exportType) {
        case "svg":
          {
            const svgBody = getGraphSvgImage();
            const blob = new Blob([svgBody], {
              type: "text/plain;charset=utf-8",
            });
            saveAs(blob, "graph.svg");
          }
          break;
        case "json": {
          const json = serializeToJSON(this.graph);
          const blob = new Blob([JSON.stringify(json)], {
            type: "text/json;charset=utf-8",
          });
          saveAs(blob, "graph.json");
          break;
        }
        default:
          throw new Error(`Export ${exportType} is not implemented yet`);
      }
    },

    /**
     * @this {ThisVueComponent}
     */
    async saveAsGraph() {
      const newTitle = getRandomName();
      const newId = kebabify(newTitle);
      await saveToLocalStorage(this.graph, newTitle, newId);
      window.location.hash = getGalleryGraphRoute(newId);
    },

    /**
     * @this {ThisVueComponent}
     */
    async saveGraph() {
      await saveToLocalStorage(this.graph, this.graphTitle, this.graphId);
    },

    /**
     * @this {ThisVueComponent}
     */
    async deleteGraph() {
      await removeFromLocalStorage(this.graphId);
      window.location.hash = "#";
    },
  },
};

export { component as EditorTopMenu };
