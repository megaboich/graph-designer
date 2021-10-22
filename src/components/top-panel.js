import { html } from "../dependencies.js";
import Dropdown from "./generic/dropdown.js";
import Modal from "./generic/modal.js";

/**
 * @typedef {object} TopPanel
 * -- props
 * @property isEditor {boolean}
 * @property isReadonly {boolean}
 * @property onExportClick {(exportType: string)=>void}
 * @property onSaveAsClick {Function}
 * @property onDeleteClick {Function}
 
 * -- state
 * @property isExportModalOpened {boolean}
 * @typedef {TopPanel & VueComponent} TopPanelVue
 */

export default {
  props: {
    isEditor: Boolean,
    isReadonly: Boolean,
    onExportClick: Function,
    onSaveAsClick: Function,
    onDeleteClick: Function,
  },

  data() {
    return {
      isExportModalOpened: false,
    };
  },

  /**
   * @this {TopPanelVue}
   */
  render() {
    const { isEditor, isReadonly } = this;

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

        <div id="navbarMain" class="navbar-menu">
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
                  isRight
                  label="Menu"
                  items=${[
                    {
                      label: "Save as a copy",
                      onclick: () => this.onSaveAsClick(),
                    },
                    {
                      label: "Export",
                      onclick: () => {
                        this.isExportModalOpened = true;
                      },
                    },
                    ...(!isReadonly
                      ? [
                          {
                            separator: true,
                          },
                          {
                            label: "Delete",
                            onclick: () => this.onDeleteClick(),
                          },
                        ]
                      : []),
                  ]}
                />
              </div>
            </div>
          `}
        </div>
      </nav>

      ${this.isExportModalOpened &&
      html`
        <${Modal}
          title="Export"
          onclose=${() => {
            this.isExportModalOpened = false;
          }}
        >
          <table class="table">
            <tbody>
              <tr>
                <td>
                  <button
                    class="button is-info"
                    onclick=${() => {
                      this.onExportClick("svg");
                      this.isExportModalOpened = false;
                    }}
                  >
                    Export to SVG
                  </button>
                </td>
                <td>
                  <p>Creates SVG image attributed with complete metadata.</p>
                  <p>
                    Can be imported back and also used as graphics just like any
                    other svg.
                  </p>
                </td>
              </tr>
              <tr>
                <td class="pt-5">
                  <button
                    class="button is-info"
                    onclick=${() => {
                      this.onExportClick("json");
                      this.isExportModalOpened = false;
                    }}
                  >
                    Export to JSON
                  </button>
                </td>
                <td class="pt-5">
                  <p>
                    Saves the graph data in custom JSON format. Can be imported
                    back.
                  </p>
                  <p>NOT IMPLEMENTED YET.</p>
                </td>
              </tr>
            </tbody>
          </table>
        <//>
      `}
    `;
  },
};
