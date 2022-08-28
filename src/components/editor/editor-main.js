import { html } from "../../dependencies.js";

import { EditorPanelProperties } from "./editor-panel-properties.js";
import { EditorPanelNode } from "./editor-panel-node.js";
import { EditorPanelLinks } from "./editor-panel-links.js";
import { GraphView } from "./graph-view.js";
import { EditorTopMenu } from "./editor-top-menu.js";

import { addNewNode, deleteNode, addNewLink, deleteLink, revertLink } from "../../data/graph-manipulation.js";

import { loadGraphByRoute } from "../../data/gallery.js";

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
    route: /** @type {string} */ (/** @type {any} */ (String)),
  },

  data() {
    return {
      isLoading: true,
      /** @type {GraphLayoutOptions=} */
      layoutOptions: undefined,
      /** @type {GraphNode=} */
      selectedNode: undefined,
      graphStructureUpdatesCount: 0,
      isExportModalOpened: false,
      graphTitle: "",
      isReadonly: false,
      graphId: "",
    };
  },

  /**
   * @this {EditorVue}
   */
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
    const { layoutOptions, selectedNode, isLoading } = this;
    if (!graphData || isLoading)
      return html`
        <div id="left-panel">Loading</div>
      `;

    return html`
      <div class="editor-main">
        <${EditorTopMenu}
          graph=${graphData}
          graphId=${this.graphId}
          graphTitle=${this.graphTitle}
          isReadonly=${this.isReadonly}
        />

        <div id="left-panel">
          <${EditorPanelProperties}
            layoutOptions=${layoutOptions}
            graphTitle=${this.graphTitle}
            onChange=${(/** @type {any} */ data) => {
              if (data.graphTitle) {
                this.graphTitle = data.graphTitle;
              }
            }}
          />

          <div class="buttons">
            <button
              class="button is-primary"
              onclick=${() => {
                if (!graphData) return;
                addNewNode(graphData, selectedNode && selectedNode.id);
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
                  if (!graphData) return;
                  deleteNode(graphData, selectedNode && selectedNode.id);
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
              graph=${graphData}
              node=${selectedNode}
              onChange=${() => {
                this.graphStructureUpdatesCount++;
              }}
            />
          `}
          ${selectedNode &&
          html`
            <${EditorPanelLinks}
              graph=${graphData}
              node=${selectedNode}
              onNavigate=${(/** @type {GraphNode} */ node) => {
                if (node) {
                  this.selectedNode = node;
                }
              }}
              onDeleteLink=${(/** @type {GraphLink} */ link) => {
                if (!graphData) return;
                deleteLink(graphData, link);
                this.graphStructureUpdatesCount++;
              }}
              onRevertLink=${(/** @type {GraphLink} */ link) => {
                if (!graphData) return;
                revertLink(graphData, link);
                this.graphStructureUpdatesCount++;
              }}
            />
          `}
        </div>
        <${GraphView}
          graph=${graphData}
          graphTitle=${this.graphTitle}
          graphStructureUpdatesCount=${this.graphStructureUpdatesCount}
          layoutOptions=${layoutOptions}
          selectedNode=${selectedNode}
          onNodeClick=${(/** @type {MouseEvent} */ event, /** @type {GraphNode} */ node) => {
            if (graphData && selectedNode && node && event.shiftKey && selectedNode.id !== node.id) {
              if (addNewLink(graphData, selectedNode.id, node.id)) {
                this.graphStructureUpdatesCount++;
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
              this.graphStructureUpdatesCount++;
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
      const { graph, isReadonly, id, title } = await loadGraphByRoute(this.route);
      graphData = graph;
      this.layoutOptions = graphData.layout;
      this.isLoading = false;
      this.graphId = id;
      this.graphTitle = title;
      this.isReadonly = isReadonly;
    },
  },
};

export default component;
export { component as EditorMain };
