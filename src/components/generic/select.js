import { html } from "../../dependencies.js";

/**
 * @typedef {object} Select
 * -- props
 * @property value {String}
 * @property options {Array<{value: string, text: string}>}
 * @property onchange {(value: string) => void}
 *
 * @typedef {Select & VueComponent} SelectVue
 */

export default {
  name: "Select",
  props: {
    value: String,
    options: Object,
    onchange: Function,
  },
  /**
   * @this {SelectVue}
   */
  render() {
    return html`
      <select
        onchange=${(/** @type HTMLInputEvent */ e) => {
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
