/**
 * @typedef {object} Modal
 * -- props
 * @property {string} title
 * @property {() => void} onclose
 *
 * @typedef {Modal & VueComponent} ModalVue
 */

export default {
  name: "Modal",
  props: {
    title: String,
    onclose: Function,
  },

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
