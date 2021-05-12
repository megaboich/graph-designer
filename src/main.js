import LeftPanelApp from "./left-panel.js";
import { GraphColaLayout } from "./graph-cola-layout.js";
import { loadGraph } from "./graph-data.js";
import { renderGraph } from "./graph-render.js";

async function initGraph() {
  const graph = await loadGraph("graph-samples/sucrose-breakdown.json");
  const tick = renderGraph(graph);

  const layout = new GraphColaLayout(tick);
  layout.init({
    width: 1000,
    height: 1000,
    nodes: graph.nodes,
    links: graph.links,
    groups: graph.groups,
    enable: true,
    forceLinkLength: 100,
  });
}

const app = Vue.createApp({
  render: () => Vue.h(LeftPanelApp),
});
app.mount("#left-panel");

initGraph();
