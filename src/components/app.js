import { html } from "../dependencies.js";

import SectionGraph from "./panel-section-graph.js";
import SectionNode from "./panel-section-node.js";
import SectionLinks from "./panel-section-links.js";
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
        <${SectionGraph} layoutOptions=${this.layoutOptions} />
        ${this.selectedNode &&
        html`
          <${SectionNode}
            graph=${this.graph}
            node=${this.selectedNode}
            onChange=${() => {
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
        ${this.selectedNode &&
        html`
          <${SectionLinks}
            graph=${this.graph}
            node=${this.selectedNode}
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
      </div>
      <${Graph}
        graph=${this.graph}
        graphStructureUpdatesCount=${this.graphStructureUpdatesCount}
        layoutOptions=${this.layoutOptions}
        selectedNode=${this.selectedNode}
        onNodeClick=${(node, flags) => {
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
        onBgClick=${(flags) => {
          if (flags.shift) {
            addNewNode(this.graph, this.selectedNode && this.selectedNode.id, {
              x: flags.x,
              y: flags.y,
            });
            this.graphStructureUpdatesCount++;
          } else {
            this.selectedNode = undefined;
          }
        }}
      />
    `;
  },
};
