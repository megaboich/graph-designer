import { html } from "../dependencies.js";

import GraphOptions from "./graph-options.js";
import Graph from "./graph.js";

export default {
  name: "App",
  data() {
    return {
      layoutOptions: {
        linkDistance: 80,
        layoutType: "flow-y",
        minSeparation: 70,
      },
    };
  },
  props: {
    graph: Object,
  },
  render() {
    return html`
      <div id="top-panel">
        <p>Graph Designer</p>
        <p>${this.layoutOptions.layoutType}</p>
        <p>${this.layoutOptions.minSeparation}</p>
        <p>${this.layoutOptions.linkDistance}</p>
        <a href="https://github.com/megaboich/graph-layout-designer">
          Source on GitHub
        </a>
      </div>
      <div id="left-panel">
        <${GraphOptions} layoutOptions=${this.layoutOptions} />
      </div>
      <${Graph} graph=${this.graph} layoutOptions=${this.layoutOptions} />
    `;
  },
};
