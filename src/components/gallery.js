import { html } from "../dependencies.js";

/**
 * @typedef {object} Gallery
 */

export default {
  /**
   * @this {Gallery}
   */
  render() {
    return html`
      <div class="section">
        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <div class="tile is-child box notification is-info">
              <p class="title">Graph designer</p>
            </div>
          </div>
        </div>
        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <article class="tile is-child box">
              <p class="title">Simple</p>
              <p class="subtitle"><a href="#simple">Simple</a></p>
              <figure class="image is-4by3">
                <img src="https://bulma.io/images/placeholders/640x480.png" />
              </figure>
            </article>
          </div>
          <div class="tile is-parent">
            <article class="tile is-child box">
              <p class="title">Ursa Major</p>
              <p class="subtitle"><a href="#ursa-major">Ursa Major</a></p>
              <figure class="image is-4by3">
                <img src="https://bulma.io/images/placeholders/640x480.png" />
              </figure>
            </article>
          </div>
          <div class="tile is-parent">
            <article class="tile is-child box">
              <p class="title">Sucrose breakdown</p>
              <p class="subtitle">
                <a href="#sucrose-breakdown">Sucrose breakdown</a>
              </p>
              <figure class="image is-4by3">
                <img src="https://bulma.io/images/placeholders/640x480.png" />
              </figure>
            </article>
          </div>
        </div>
      </div>
    `;
  },
};
