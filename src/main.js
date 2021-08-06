import GraphEditor from "./components/editor/editor-main.js";
import Gallery from "./components/gallery.js";
import About from "./components/about.js";

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
    const { route } = this;
    if (!route) {
      return html`
        <${Gallery} />
      `;
    }
    if (route === "about") {
      return html`
        <${About} />
      `;
    }
    return html`
      <${GraphEditor} route=${route} />
    `;
  },
};

async function initApp() {
  const app = createApp(rootComponent);
  app.mount(document.body);
}

initApp();
