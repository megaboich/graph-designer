import { vueProp } from "../../helpers/vue-prop.js";

/**
 * @typedef {typeof component.props} Props
 * @typedef {ReturnType<typeof component.data>} State
 * @typedef {typeof component.methods} Methods
 * @typedef {Props & State & Methods & VueComponent} ThisVueComponent
 */

const component = {
  name: "Modal",
  props: {
    title: vueProp(String),
    onclose: vueProp(Function),
  },

  data() {
    return {};
  },

  methods: {},

  /**
   * This component is using Vuew templating instead of HTM because of problems handling slots
   * https://github.com/developit/htm/issues/217
   */
  template: `
      <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">{{ title }}</p>
            <button class="delete" aria-label="close" @click="onclose()" />
          </header>
          <section class="modal-card-body">
            <slot>Content</slot>
          </section>
        </div>
      </div>
  `,
};

export { component as Modal };
