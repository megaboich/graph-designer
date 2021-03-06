import { html } from "../dependencies.js";
import TopPanel from "./top-panel.js";

/**
 * @typedef {object} About
 */

export default {
  /**
   * @this {About}
   */
  render() {
    return html`
      <div class="gallery">
        <${TopPanel} />
        <div id="main" class="section content">
          <h2>About</h2>
          <p>Graph designer is a free website to help with designing graphs.</p>

          <h2>Terms of Service</h2>
          <h3>Disclaimer</h3>
          <p>
            THE SITE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE
            THAT YOUR USE OF THE SITE AND OUR SERVICES WILL BE AT YOUR SOLE
            RISK.
          </p>
          <p>Bla bla bla, bla bla... bla.</p>
        </div>
      </div>
    `;
  },
};
