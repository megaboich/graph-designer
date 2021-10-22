import { html, saveAs } from "../../dependencies.js";

import TopPanel from "../top-panel.js";
import EditorPanelLayout from "./editor-panel-layout.js";
import EditorPanelNode from "./editor-panel-node.js";
import EditorPanelLinks from "./editor-panel-links.js";
import GraphView from "./graph-view.js";

import {
  addNewNode,
  deleteNode,
  addNewLink,
  deleteLink,
  revertLink,
} from "../../data/graph-manipulation.js";
import { serializeToJSON } from "../../data/graph-serialization.js";
import {
  loadGraphByRoute,
  saveToLocalStorage,
  removeFromLocalStorage,
  getGalleryGraphRoute,
} from "../../data/gallery.js";
import { getRandomName } from "../../helpers/get-random-name.js";

/**
 * @typedef {object} Editor
 * -- props
 * @property route {String}
 * -- state
 * @property graph {GraphData=}
 * @property isLoading {Boolean}
 * @property layoutOptions {GraphLayoutOptions=}
 * @property selectedNode {GraphNode=}
 * @property graphStructureUpdatesCount {Number}
 * --methods
 * @property renderEditor {Function}
 * @property exportGraph {(exportType: string)=>void}
 * @property saveAsGraph {Function}
 * @property deleteGraph {Function}
 * @property loadData {Function}
 *
 * @typedef {Editor & VueComponent} EditorVue
 */

export default {
  data() {
    return {
      // graph: undefined, /* Graph state variable is not known to Vue intentionally in order to prevent Vue of creating observables for the whole graph tree. This impacts performance a lot. */
      isLoading: true,
      /** @type {GraphLayoutOptions=} */
      layoutOptions: undefined,
      /** @type {GraphNode=} */
      selectedNode: undefined,
      graphStructureUpdatesCount: 0,
    };
  },

  props: {
    route: String,
  },

  /**
   * @this {EditorVue}
   */
  async mounted() {
    this.loadData();
    this.$watch("route", () => {
      this.loadData();
    });
  },

  /**
   * @this {EditorVue}
   * @returns {any} html
   */
  render() {
    return html`
      <div class="editor-main">
        <${TopPanel}
          isEditor
          isReadonly=${this.graph?.isReadonly}
          onExportClick=${this.exportGraph}
          onSaveAsClick=${this.saveAsGraph}
          onDeleteClick=${this.deleteGraph}
        />
        ${this.renderEditor()}
      </div>
    `;
  },

  methods: {
    /**
     * @this {EditorVue}
     */
    async loadData() {
      this.isLoading = true;
      this.graph = await loadGraphByRoute(this.route);
      this.layoutOptions = this.graph.layout;
      this.isLoading = false;
    },

    /**
     * @param {String} exportType
     * @this {EditorVue}
     */
    exportGraph(exportType) {
      switch (exportType) {
        case "svg":
          {
            const svgEl = document.getElementById("svg-main");
            if (!svgEl) {
              return;
            }
            const svgBody = svgEl.outerHTML;
            const blob = new Blob([svgBody], {
              type: "text/plain;charset=utf-8",
            });
            saveAs(blob, "graph.svg");
          }
          break;
        case "json": {
          if (this.graph) {
            const json = serializeToJSON(this.graph);
            const blob = new Blob([JSON.stringify(json)], {
              type: "text/json;charset=utf-8",
            });
            saveAs(blob, "graph.json");
          }
          break;
        }
        default:
          throw new Error(`Export ${exportType} is not implemented yet`);
      }
    },

    /**
    @this {EditorVue}
    */
    async saveAsGraph() {
      if (this.graph) {
        const newId = await saveToLocalStorage(this.graph, getRandomName());
        window.location.hash = getGalleryGraphRoute(newId);
      }
    },

    /**
    @this {EditorVue}
    */
    async deleteGraph() {
      if (this.graph) {
        await removeFromLocalStorage(this.graph.id);
        window.location.hash = "#";
      }
    },

    /**
     * @this {EditorVue}
     */
    renderEditor() {
      const { graph, layoutOptions, selectedNode, isLoading } = this;
      if (!graph || isLoading)
        return html`
          <div id="left-panel">Loading</div>
        `;

      return html`
        <div id="left-panel">
          <${EditorPanelLayout} layoutOptions=${layoutOptions} />

          <div class="buttons">
            <button
              class="button is-primary"
              onclick=${() => {
                addNewNode(graph, selectedNode && selectedNode.id);
                this.graphStructureUpdatesCount++;
              }}
            >
              Add node
            </button>
            ${selectedNode &&
            html`
              <button
                class="button is-danger"
                onclick=${() => {
                  deleteNode(graph, selectedNode && selectedNode.id);
                  this.selectedNode = undefined;
                  this.graphStructureUpdatesCount++;
                }}
              >
                <span>Delete node</span>
              </button>
            `}
          </div>

          ${selectedNode &&
          html`
            <${EditorPanelNode}
              graph=${graph}
              node=${selectedNode}
              onChange=${() => {
                this.graphStructureUpdatesCount++;
              }}
            />
          `}
          ${selectedNode &&
          html`
            <${EditorPanelLinks}
              graph=${graph}
              node=${selectedNode}
              onNavigate=${(/** @type GraphNode */ node) => {
                if (node) {
                  this.selectedNode = node;
                }
              }}
              onDeleteLink=${(/** @type GraphLink */ link) => {
                deleteLink(graph, link);
                this.graphStructureUpdatesCount++;
              }}
              onRevertLink=${(/** @type GraphLink */ link) => {
                revertLink(graph, link);
                this.graphStructureUpdatesCount++;
              }}
            />
          `}
        </div>
        <${GraphView}
          graph=${graph}
          graphStructureUpdatesCount=${this.graphStructureUpdatesCount}
          layoutOptions=${layoutOptions}
          selectedNode=${selectedNode}
          onNodeClick=${(
            /** @type {MouseEvent} */ event,
            /** @type {GraphNode} */ node
          ) => {
            if (
              selectedNode &&
              node &&
              event.shiftKey &&
              selectedNode.id !== node.id
            ) {
              if (addNewLink(graph, selectedNode.id, node.id)) {
                this.graphStructureUpdatesCount++;
              }
            }

            // eslint-disable-next-line no-console
            console.log("Selected node", node, graph);
            this.selectedNode = node;
          }}
          onBgClick=${(
            /** @type {{x: number, y: number, event: MouseEvent}} */ params
          ) => {
            if (params.event.shiftKey) {
              addNewNode(graph, selectedNode && selectedNode.id, {
                x: params.x,
                y: params.y,
              });
              this.graphStructureUpdatesCount++;
            } else {
              this.selectedNode = undefined;
            }
          }}
        />
      `;
    },
  },
};
