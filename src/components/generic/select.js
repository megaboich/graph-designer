import { html } from "../../dependencies.js";

/**
 * @typedef {typeof component.props} Props
 * @typedef {ReturnType<typeof component.data>} State
 * @typedef {typeof component.methods} Methods
 * @typedef {Props & State & Methods & VueComponent} ThisVueComponent
 */

const component = {
  name: "Select",
  props: {
    value: /** @type {string} */ (/** @type {any} */ (String)),
    options: /** @type {{value: string, text: string}[]} */ (/** @type {any} */ (Array)),
    onchange: /** @type {(value: string) => void} */ (/** @type {any} */ (Function)),
  },
  data() {
    return {};
  },
  methods: {},
  /**
   * @this {ThisVueComponent}
   */
  render() {
    return html`
      <select
        onchange=${(/** @type {HTMLInputEvent} */ e) => {
          this.onchange(e.target.value);
        }}
      >
        ${this.options.map(
          (option) => html`
            <option selected=${this.value === option.value} value="${option.value}">${option.text}</option>
          `
        )}
      </select>
    `;
  },
};

export default component;
export { component as Select };
