import { html } from "../../dependencies.js";
import { vueProp } from "../../helpers/vue-prop.js";

/**
 * @typedef {typeof component.props} Props
 * @typedef {ReturnType<typeof component.data>} State
 * @typedef {typeof component.methods} Methods
 * @typedef {Props & State & Methods & VueComponent} ThisVueComponent
 */

const component = {
  name: "Select",
  props: {
    value: vueProp(String),

    /** @type {{value: string, text: string}[]} */
    options: vueProp(Array),

    /** @type {(value: string) => void} */
    onchange: vueProp(Function),
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

export { component as Select };
