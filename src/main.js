import App from "./components/app.js";
import { loadGraph } from "./graph-data.js";
import { createApp, html } from "./dependencies.js";

async function initApp() {
  const graph = await loadGraph("graph-samples/ursa-major.json");

  const app = createApp({
    render: () => html`
      <${App} graph=${graph} />
    `,
  });
  app.mount(document.body);
}

initApp();
