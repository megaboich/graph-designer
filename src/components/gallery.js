import { html } from "../dependencies.js";
import TopPanel from "./top-panel.js";

import { loadGallery } from "../data/gallery.js";
import { chunks } from "../helpers/misc.js";

/**
 * @typedef {object} Gallery
 * -- props
 * ...
 * -- state
 * @property {GalleryItem[]} entries
 * @property {Boolean} isLoading
 * --methods
 * ...
 *
 * @typedef {Gallery & VueComponent} GalleryVue
 */

export default {
  data() {
    return {
      /** @type {GalleryItem[]} */
      entries: [],
      isLoading: true,
    };
  },

  /**
   * @this {GalleryVue}
   */
  async mounted() {
    this.entries = await loadGallery();
    this.isLoading = false;
  },

  /**
   * @this {GalleryVue}
   */
  render() {
    const chunkedEntities = chunks(this.entries, 3);
    return html`
      <div class="gallery">
        <div id="top-panel">
          <${TopPanel}
            topRightMenuItems=${[
              {
                label: "Import",
                // eslint-disable-next-line no-alert
                onclick: () => alert("Not yet implemented!"),
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
