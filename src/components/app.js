import { html } from "../dependencies.js";

import GraphOptions from "./graph-options.js";
import NodeOptions from "./node-options.js";
import Graph from "./graph.js";
import { addNewNode } from "../graph-data.js";

export default {
  name: "App",
  data() {
    return {
      layoutOptions: {
        linkDistance: 80,
        layoutType: "flow-y",
        minSeparation: 70,
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
          Source on GitHub
        </a>
      </div>
      <div id="left-panel">
        <${GraphOptions} layoutOptions=${this.layoutOptions} />
        ${this.selectedNode &&
        html`
          <${NodeOptions}
            node=${this.selectedNode}
            onChange=${() => {
              this.graphStructureUpdatesCount++;
            }}
          />
          <button
            class="button is-primary"
            onclick=${() => {
              addNewNode(this.graph, this.selectedNode.id);
              this.graphStructureUpdatesCount++;
            }}
          >
            Add node
          </button>
        `}
      </div>
      <${Graph}
        graph=${this.graph}
        graphStructureUpdatesCount=${this.graphStructureUpdatesCount}
        layoutOptions=${this.layoutOptions}
        onSelectNode=${(node) => {
          this.selectedNode = node;
          console.log("Selected node", node);
        }}
      />
    `;
  },
};
