import { html } from "../dependencies.js";

import GraphOptions from "./graph-options.js";
import NodeOptions from "./node-options.js";
import Graph from "./graph.js";
import {
  addNewNode,
  deleteNode,
  addNewLink,
  deleteLink,
  revertLink,
} from "../graph-data.js";

export default {
  name: "App",
  data() {
    return {
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
    graph: Object,
  },
  render() {
    return html`
      <div id="top-panel">
        <p>Power graph designer</p>
        <a href="https://github.com/megaboich/graph-layout-designer">
          <span class="icon">
            <i class="fab fa-github-square"></i>
          </span>
          <span>GitHub</span>
        </a>
      </div>
      <div id="left-panel">
        <${GraphOptions} layoutOptions=${this.layoutOptions} />
        ${this.selectedNode &&
        html`
          <${NodeOptions}
            graph=${this.graph}
            node=${this.selectedNode}
            onChange=${() => {
              this.graphStructureUpdatesCount++;
            }}
            onNavigate=${({ node }) => {
              if (node) {
                this.selectedNode = node;
              }
            }}
            onDeleteLink=${(link) => {
              deleteLink(this.graph, link);
              this.graphStructureUpdatesCount++;
            }}
            onRevertLink=${(link) => {
              revertLink(this.graph, link);
              this.graphStructureUpdatesCount++;
            }}
          />
        `}
        <div class="buttons">
          <button
            class="button is-primary"
            onclick=${() => {
              addNewNode(this.graph, this.selectedNode && this.selectedNode.id);
              this.graphStructureUpdatesCount++;
            }}
          >
            Add node
          </button>
          ${this.selectedNode &&
          html`
            <button
              class="button is-danger"
              onclick=${() => {
                deleteNode(this.graph, this.selectedNode.id);
                this.selectedNode = undefined;
                this.graphStructureUpdatesCount++;
              }}
            >
              <span>Delete node</span>
            </button>
          `}
        </div>
      </div>
      <${Graph}
        graph=${this.graph}
        graphStructureUpdatesCount=${this.graphStructureUpdatesCount}
        layoutOptions=${this.layoutOptions}
        selectedNode=${this.selectedNode}
        onSelectNode=${(node, flags) => {
          if (
            this.selectedNode &&
            node &&
            flags.shift &&
            this.selectedNode.id !== node.id
          ) {
            if (addNewLink(this.graph, this.selectedNode.id, node.id)) {
              this.graphStructureUpdatesCount++;
            }
          }

          console.log("Selected node", node, this.graph);
          this.selectedNode = node;
        }}
      />
    `;
  },
};
