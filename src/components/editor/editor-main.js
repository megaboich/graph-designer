import { html } from "../../dependencies.js";

import { EditorPanelProperties } from "./editor-panel-properties.js";
import { EditorPanelNode } from "./editor-panel-node.js";
import { EditorPanelLinks } from "./editor-panel-links.js";
import { GraphView } from "./graph-view.js";
import { EditorTopMenu } from "./editor-top-menu.js";

import { addNewNode, deleteNode, addNewLink, deleteLink, revertLink } from "../../data/graph-manipulation.js";

import { loadGraphByRoute } from "../../data/gallery.js";
import { vueProp } from "../../helpers/vue-prop.js";

/**
 * @typedef {typeof component.props} Props
 * @typedef {ReturnType<typeof component.data>} State
 * @typedef {typeof component.methods} Methods
 * @typedef {Props & State & Methods & VueComponent} ThisVueComponent
 */

/**
 * Current graph data is intentionally not part of Vue component state because it is huge object model
 * and Vue creates observable wrappers recursively which is a performance kill
 * @type {GraphData | undefined}
 */
let graphData;

const component = {
  props: {
    route: vueProp(String),
  },

  data() {
    return {
      isLoading: true,
      /** @type {GraphOptions=} */
      graphOptions: undefined,
      /** @type {GraphNode=} */
      selectedNode: undefined,
      graphLayoutTrigger: 0,
      isExportModalOpened: false,
      isReadonly: false,
      graphId: "",
    };
  },

  async created() {
    /**
     * Because `graphData` is not a part of Vue component
     * it is just a variable which is shared between component lifecycles
     * So better to clean it when component creates and destroys
     * Also this design works only if there is only a single instance of this component on the page
     */
    graphData = undefined;
  },

  async unmounted() {
    graphData = undefined;
  },

  /**
   * @this {ThisVueComponent}
   */
  async mounted() {
    this.loadData();
    this.$watch("route", () => {
      this.loadData();
    });
  },

  /**
   * @this {ThisVueComponent}
   */
  render() {
    const { isLoading, graphOptions, selectedNode, graphId, isReadonly } = this;
    if (isLoading || !graphData || !graphOptions)
      return html`
        <div id="left-panel">Loading</div>
      `;

    return html`
      <div class="editor-main">
        <${EditorTopMenu}
          graph=${graphData}
          graphId=${graphId}
          graphTitle=${graphOptions.title}
          isReadonly=${isReadonly}
        />

        <div id="left-panel">
          <${EditorPanelProperties}
            graphOptions=${graphOptions}
            onChange=${(/** @type {Partial<GraphOptions>} */ change) => {
              this.graphOptions = {
                ...graphOptions,
                ...change,
              };
            }}
          />

          <div class="buttons">
            <button
              class="button is-primary"
              onclick=${() => {
                if (!graphData) return;
                addNewNode(graphData, selectedNode && selectedNode.id);
                this.graphLayoutTrigger++;
              }}
            >
              Add node
            </button>
            ${selectedNode &&
            html`
              <button
                class="button is-danger"
                onclick=${() => {
                  if (!graphData) return;
                  deleteNode(graphData, selectedNode && selectedNode.id);
                  this.selectedNode = undefined;
                  this.graphLayoutTrigger++;
                }}
              >
                <span>Delete node</span>
              </button>
            `}
          </div>

          ${selectedNode &&
          html`
            <${EditorPanelNode}
              graph=${graphData}
              node=${selectedNode}
              onChange=${() => {
                selectedNode.needsToRerender = true;
                this.graphLayoutTrigger++;
              }}
            />
          `}
          ${selectedNode &&
          html`
            <${EditorPanelLinks}
              graph=${graphData}
              node=${selectedNode}
              onNavigate=${(/** @type {GraphNode} */ node) => {
                this.selectedNode = node;
              }}
              onDeleteLink=${(/** @type {GraphLink} */ link) => {
                if (!graphData) return;
                deleteLink(graphData, link);
                this.graphLayoutTrigger++;
              }}
              onRevertLink=${(/** @type {GraphLink} */ link) => {
                if (!graphData) return;
                revertLink(graphData, link);
                this.graphLayoutTrigger++;
              }}
            />
          `}
        </div>
        <${GraphView}
          graph=${graphData}
          graphLayoutTrigger=${this.graphLayoutTrigger}
          graphOptions=${graphOptions}
          selectedNode=${selectedNode}
          onNodeClick=${(/** @type {MouseEvent} */ event, /** @type {GraphNode} */ node) => {
            if (graphData && selectedNode && node && event.shiftKey && selectedNode.id !== node.id) {
              if (addNewLink(graphData, selectedNode.id, node.id)) {
                this.graphLayoutTrigger++;
              }
            }

            // eslint-disable-next-line no-console
            console.log("Selected node", node, graphData);
            this.selectedNode = node;
          }}
          onBgClick=${(/** @type {{x: number, y: number, event: MouseEvent}} */ params) => {
            if (graphData && params.event.shiftKey) {
              addNewNode(graphData, selectedNode && selectedNode.id, {
                x: params.x,
                y: params.y,
              });
              this.graphLayoutTrigger++;
            } else {
              this.selectedNode = undefined;
            }
          }}
        />
      </div>
    `;
  },

  methods: {
    /**
     * @this {ThisVueComponent}
     */
    async loadData() {
      this.isLoading = true;
      const { graph, isReadonly, id } = await loadGraphByRoute(this.route);
      graphData = graph;
      this.graphOptions = graph.options;
      this.isLoading = false;
      this.graphId = id;
      this.isReadonly = isReadonly;
    },
  },
};

export { component as EditorMain };
