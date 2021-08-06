import { html, saveAs } from "../../dependencies.js";

import TopPanel from "../top-panel.js";
import EditorPanelLayout from "./editor-panel-layout.js";
import EditorPanelNode from "./editor-panel-node.js";
import EditorPanelLinks from "./editor-panel-links.js";
import GraphView from "./graph-view.js";

import {
  loadGraph,
  addNewNode,
  deleteNode,
  addNewLink,
  deleteLink,
  revertLink,
} from "../../graph-data.js";

/**
 * @typedef {object} Editor
 * -- props
 * @property route {String}
 * -- state
 * @property graph {GraphData=}
 * @property isLoading {Boolean}
 * @property layoutOptions {GraphLayoutOptions}
 * @property selectedNode {GraphNode=}
 * @property graphStructureUpdatesCount {Number}
 * --methods
 * @property renderEditor {Function}
 * @property exportToSvg {Function}
 *
 * @typedef {Editor & VueComponent} EditorVue
 */

export default {
  data() {
    return {
      // graph: undefined, /* Graph state variable is not known to Vue intentionally in order to prevent Vue of creating observables for the whole graph tree. This impacts performance a lot. */
      isLoading: true,
      /** @type {GraphLayoutOptions} */
      layoutOptions: {
        layoutType: "auto",
        linkDistance: 80,
        minSeparation: 160,
      },
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
    const { route } = this;
    let graph;
    if (route.startsWith("example/")) {
      const id = route.substr(8);
      const dataUrl = `graph-samples/${id}.json`;
      graph = await loadGraph(dataUrl);
    }
    this.graph = graph;
    this.isLoading = false;
  },

  /**
   * @this {EditorVue}
   * @returns {any} html
   */
  render() {
    const { isLoading } = this;

    return html`
      <div class="editor-main">
        <${TopPanel} isEditor onExportClick=${() => this.exportToSvg()} />
        ${isLoading
          ? html`
              <div class="m-5">
                <p>Loading...</p>
              </div>
            `
          : this.renderEditor()}
      </div>
    `;
  },

  methods: {
    /**
     * @this {EditorVue}
     */
    exportToSvg() {
      const svgEl = document.getElementById("svg-main");
      if (!svgEl) {
        return;
      }
      const svgBody = svgEl.outerHTML;
      const blob = new Blob([svgBody], { type: "text/plain;charset=utf-8" });
      saveAs(blob, "graph.svg");
    },

    /**
     * @this {EditorVue}
     */
    renderEditor() {
      const { graph, layoutOptions, selectedNode } = this;
      if (!graph) return null;
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
            /** @type {GraphNode} */ node,
            /** @type {MouseEvent} */ event
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
