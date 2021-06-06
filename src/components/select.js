// @ts-nocheck
import { html } from "../dependencies.js";

export default {
  name: "Select",
  props: {
    value: String,
    options: Object,
    onchange: Function,
  },
  render() {
    return html`
      <select
        onchange=${(e) => {
          this.onchange(e.target.value);
        }}
      >
        ${this.options.map(
          (option) => html`
            <option
              selected=${this.value === option.value}
              value="${option.value}"
            >
              ${option.text}
            </option>
          `
        )}
      </select>
    `;
  },
};
