import { html } from "../dependencies.js";
import Dropdown from "./generic/dropdown.js";

/**
 * @typedef {object} TopPanel
 * -- props
 * @property isEditor {boolean}
 * @property onExportClick {()=>void}
 
 * -- state
 *
 * @typedef {TopPanel & VueComponent} TopPanelVue
 */

export default {
  props: {
    isEditor: Boolean,
    onExportClick: Function,
  },

  /**
   * @this {TopPanelVue}
   */
  render() {
    const { isEditor } = this;

    return html`
      <nav
        id="top-panel"
        class="navbar"
        role="navigation"
        aria-label="main navigation"
      >
        <div class="navbar-brand">
          <div class="navbar-item is-size-5">
            <span class="icon">
              <i class="fas fa-sitemap"></i>
            </span>
            <span class="ml-2">Graph Designer</span>
          </div>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
          <div class="navbar-start">
            <a class="navbar-item" href="#">
              <span class="icon">
                <i class="far fa-images"></i>
              </span>
              <span>Gallery</span>
            </a>
            <a class="navbar-item" href="#about">
              <span class="icon">
                <i class="far fa-question-circle"></i>
              </span>
              <span>About</span>
            </a>
            <a
              target="_blank"
              class="navbar-item"
              href="https://github.com/megaboich/graph-layout-designer"
            >
              <span class="icon">
                <i class="fab fa-github-square"></i>
              </span>
              <span>GitHub</span>
            </a>
          </div>

          ${isEditor &&
          html`
            <div class="navbar-end">
              <div class="navbar-item">
                <${Dropdown}
                  label="Menu"
                  items=${[
                    {
                      label: "Export",
                      onclick: () => this.onExportClick(),
                    },
                    {
                      label: "Import",
                      onclick: () => alert("Not implemented yet"),
                    },
                  ]}
                />
              </div>
            </div>
          `}
        </div>
      </nav>
    `;
  },
};
