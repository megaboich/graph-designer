import GraphEditor from "./components/graph-editor.js";
import Gallery from "./components/gallery.js";

import { createApp, html } from "./dependencies.js";

/**
 * @typedef {object} MainComponent
 * -- state
 * @property route {String}
 * -- methods
 * @property handleWindowHashChange {()=>void}
 */

const rootComponent = {
  data() {
    return {
      route: "",
    };
  },

  methods: {
    /**
     * @this {MainComponent}
     */
    handleWindowHashChange() {
      this.route = window.location.hash ? window.location.hash.substr(1) : "";
    },
  },

  /**
   * @this {MainComponent}
   */
  async mounted() {
    window.addEventListener("hashchange", this.handleWindowHashChange);
    this.handleWindowHashChange();
  },

  /**
   * @this {MainComponent}
   */
  render() {
    if (!this.route) {
      return html`
        <${Gallery} />
      `;
    }
    return html`
      <${GraphEditor} route=${this.route} />
    `;
  },
};

async function initApp() {
  const app = createApp(rootComponent);
  app.mount(document.body);
}

initApp();
