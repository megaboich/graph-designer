import { html } from "./dependencies.js";

export default {
  name: "App",
  data() {
    return {
      count: 40,
    };
  },
  render() {
    return html`
      <label>
        Link distance:
        <input
          type="number"
          min="10"
          value=${this.count}
          oninput=${(e) => {
            this.count = e.target.value;
          }}
        />
      </label>
    `;
  },
};
