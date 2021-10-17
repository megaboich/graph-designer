import { html } from "../dependencies.js";
import TopPanel from "./top-panel.js";

import { loadGallery } from "../data/gallery.js";
import { chunks } from "../helpers/misc.js";

/**
 * @typedef {object} Gallery
 * -- props
 * ...
 * -- state
 * @property entries {Array<GalleryEntry>}
 * @property isLoading {Boolean}
 * --methods
 * ...
 *
 * @typedef {Gallery & VueComponent} GalleryVue
 */

export default {
  data() {
    return {
      /** @type {Array<GalleryEntry>} */
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
        <${TopPanel} />
        <div id="main" class="section">
          <div class="tile is-ancestor is-vertical">
            ${chunkedEntities.map((chunk) => {
              return html`
                <div class="tile">
                  ${chunk.map((x) => {
                    return html`
                      <div class="tile is-4 is-parent">
                        <a class="tile is-child box" href=${x.route}>
                          <p class="title">${x.name}</p>

                          ${x.isExample &&
                          html`
                            <span class="tag is-info mb-2">Example</span>
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
