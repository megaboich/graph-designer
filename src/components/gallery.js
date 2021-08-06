import { html } from "../dependencies.js";
import TopPanel from "./top-panel.js";

/**
 * @typedef {object} Gallery
 */

const examples = [
  {
    name: "Simple",
    id: "simple",
    image: "graph-samples/simple.svg",
  },
  {
    name: "Ursa Major",
    id: "ursa-major",
    image: "graph-samples/ursa-major.svg",
  },
  {
    name: "Sucrose breakdown",
    id: "sucrose-breakdown",
    image: "graph-samples/sucrose-breakdown.svg",
  },
];

export default {
  /**
   * @this {Gallery}
   */
  render() {
    return html`
      <div class="gallery">
        <${TopPanel} />
        <div id="main" class="section">
          <div class="tile is-ancestor">
            ${examples.map((x) => {
              return html`
                <div class="tile is-parent">
                  <article class="tile is-child box">
                    <p class="title">
                      <a href=${`#example/${x.id}`}>${x.name}</a>
                    </p>

                    <figure class="image is-4by3">
                      <a href=${`#example/${x.id}`}>
                        <img src=${x.image} />
                      </a>
                    </figure>
                  </article>
                </div>
              `;
            })}
          </div>
        </div>
      </div>
    `;
  },
};
