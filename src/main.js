import LeftPanelApp from "./left-panel.js";
import { loadGraph } from "./graph-data.js";
import { GraphRendererD3 } from "./graph-renderer-d3.js";
import { Vue, cola } from "./dependencies.js";

async function initGraph() {
  const graph = await loadGraph("graph-samples/simple.json");

  let needsUpdate = false;

  const layout = new cola.Layout()
    .nodes(graph.nodes)
    .links(graph.links)
    .groups(graph.groups)
    .convergenceThreshold(0.05)
    .size([1000, 1000])
    .jaccardLinkLengths(30)
    .linkDistance(() => 100)
    .avoidOverlaps(true)
    .on(cola.EventType.start, () => {
      needsUpdate = true;
    })
    .on(cola.EventType.end, () => {
      needsUpdate = false;
    });

  layout.kick = () => {};

  const render = new GraphRendererD3({
    graph,
    onUpdate: () => {
      needsUpdate = true;
      layout.resume();
    },
  });

  layout.start();
  layout.tick();
  render.update();

  const app = Vue.createApp({
    render: () => Vue.h(LeftPanelApp),
  });
  app.mount("#left-panel");

  setInterval(() => {
    if (needsUpdate) {
      layout.tick();
      render.update();
    }
  }, 20);
}

initGraph();
