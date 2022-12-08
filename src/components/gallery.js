import { html } from "../dependencies.js";
import { TopPanel } from "./top-panel.js";
import { ImportDialog } from "./dialogs/import-dialog.js";

import { loadGallery } from "../data/gallery.js";
import { chunks } from "../helpers/misc.js";

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
      /** @type {GalleryItem[]} */
      entries: [],
      isLoading: true,
      isImportDialogActive: false,
    };
  },

  methods: {},

  /** @this {ThisVueComponent} */
  async mounted() {
    this.entries = await loadGallery();
    this.isLoading = false;
  },

  /** @this {ThisVueComponent} */
  render() {
    const chunkedEntities = chunks(this.entries, 3);
    return html`
      <div class="gallery">
        <div id="top-panel">
          <${TopPanel}
            topRightMenuItems=${[
              {
                label: "Import",
                onclick: () => {
                  this.isImportDialogActive = true;
                },
              },
              {
                separator: true,
              },
              {
                label: "Create new empty graph",
                onclick: () => {},
              },
            ]}
          />
          <${ImportDialog}
            show=${this.isImportDialogActive}
            onClose=${() => {
              this.isImportDialogActive = false;
            }}
          />
        </div>
        <div id="main" class="section">
          <div class="tile is-ancestor is-vertical flex-grow-0">
            ${chunkedEntities.map((chunk) => {
              return html`
                <div class="tile">
                  ${chunk.map((x) => {
                    return html`
                      <div class="tile is-4 is-parent">
                        <a class="tile is-child box" href=${x.route}>
                          <p class="title">${x.title}</p>

                          ${x.isExample &&
                          html`
                            <span class="tag is-info mb-2">Example</span>
                          `}
                          ${x.updateDate &&
                          html`
                            <span class="tag is-light mb-2">
                              ${x.updateDate.toLocaleDateString()} ${x.updateDate.toLocaleTimeString()}
                            </span>
                          `}

                          <figure class="image is-4by3">
                            <img src=${x.preview} />
                          </figure>
                        </a>
                      </div>
                    `;
                  })}
                </div>
              `;
            })}
          </div>
        </div>
      </div>
    `;
  },
};

export { component as Gallery };
