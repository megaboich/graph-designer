import { html } from "../dependencies.js";

import SectionGraph from "./panel-section-graph.js";
import SectionNode from "./panel-section-node.js";
import SectionLinks from "./panel-section-links.js";
import Graph from "./graph-view.js";
import Dropdown from "./dropdown.js";

import {
  loadGraph,
  addNewNode,
  deleteNode,
  addNewLink,
  deleteLink,
  revertLink,
} from "../graph-data.js";

/**
 * @typedef {object} GraphEditor
 * -- props
 * @property route {String}
 * -- state
 * @property graph {GraphData=}
 * @property isLoading {Boolean}
 * @property layoutOptions {GraphLayoutOptions}
 * @property selectedNode {GraphNode=}
 * @property graphStructureUpdatesCount {Number}
 *
 * @typedef {GraphEditor & VueComponent} GraphEditorVue
 */

export default {
  data() {
    return {
      // Graph state variable is not known to Vue intentionally in order to prevent Vue of creating observables for the whole graph tree. This impacts performance a lot.
      isLoading: true,
      /** @type {GraphLayoutOptions} */
      layoutOptions: {
        layoutType: "auto",
        linkDistance: 80,
        minSeparation: 160,
      },
      selectedNode: undefined,
      graphStructureUpdatesCount: 0,
    };
  },

  props: {
    route: String,
  },

  /**
   * @this {GraphEditorVue}
   */
  async mounted() {
    const graph = await loadGraph(`graph-samples/${this.route}.json`);
    this.graph = graph;
    this.isLoading = false;
  },

  /**
   * @this {GraphEditor}
   * @returns {any} html
   */
  render() {
    const { isLoading, graph, layoutOptions, selectedNode } = this;
    if (isLoading || !graph) {
      return html`
        <div class="notification m-5">
          <p>Loading...</p>
        </div>
      `;
    }

    return html`
      <div class="graph-editor">
        <div id="top-panel">
          <p>Graph designer</p>
          <a href="#">
            <span class="icon">
              <i class="far fa-images"></i>
            </span>
            <span>Gallery</span>
          </a>
          <a href="https://github.com/megaboich/graph-layout-designer">
            <span class="icon">
              <i class="fab fa-github-square"></i>
            </span>
            <span>GitHub</span>
          </a>
          <${Dropdown}
            label="Menu"
            items=${[
              { label: "Export", onclick: () => alert("hahaha") },
              { label: "Import", onclick: () => alert("hohoho") },
            ]}
          />
        </div>
        <div id="left-panel">
          <${SectionGraph} layoutOptions=${layoutOptions} />

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
            <${SectionNode}
              graph=${graph}
              node=${selectedNode}
              onChange=${() => {
                this.graphStructureUpdatesCount++;
              }}
            />
          `}
          ${selectedNode &&
          html`
            <${SectionLinks}
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
        <${Graph}
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
      </div>
    `;
  },
};
