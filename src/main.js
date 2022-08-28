import { EditorMain } from "./components/editor/editor-main.js";
import { Gallery } from "./components/gallery.js";
import { About } from "./components/about.js";

import { createApp, html } from "./dependencies.js";

/**
 * @typedef {typeof component.props} Props
 * @typedef {ReturnType<typeof component.data>} State
 * @typedef {typeof component.methods} Methods
 * @typedef {Props & State & Methods & VueComponent} ThisVueComponent
 */

const component = {
  props: {},

  data() {
    return {
      route: "",
    };
  },

  methods: {
    /** @this {ThisVueComponent} */
    handleWindowHashChange() {
      this.route = window.location.hash ? window.location.hash.substring(1) : "";
    },
  },

  /** @this {ThisVueComponent} */
  async mounted() {
    window.addEventListener("hashchange", this.handleWindowHashChange);
    this.handleWindowHashChange();
  },

  /**
   * Very simple routing - good enough for such simple app
   * @this {ThisVueComponent}
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
      <${EditorMain} route=${route} />
    `;
  },
};

async function initApp() {
  const app = createApp(component);
  app.mount(document.body);
}

initApp();
