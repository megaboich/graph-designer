import { html } from "../dependencies.js";
import { Dropdown } from "./generic/dropdown.js";
import { vueProp } from "../helpers/vue-prop.js";

/**
 * @typedef {typeof component.props} Props
 * @typedef {ReturnType<typeof component.data>} State
 * @typedef {typeof component.methods} Methods
 * @typedef {Props & State & Methods & VueComponent} ThisVueComponent
 */

const component = {
  props: {
    /** @type {DropdownItem[]=} */
    topRightMenuItems: vueProp(Array),
  },

  data() {
    return {
      isExportModalOpened: false,
    };
  },

  methods: {},

  /**
   * @this {ThisVueComponent}
   */
  render() {
    const { topRightMenuItems } = this;

    return html`
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <div class="navbar-item is-size-5">
            <span class="icon">
              <i class="fas fa-sitemap"></i>
            </span>
            <span class="ml-2">Graph Designer</span>
          </div>
        </div>

        <div id="navbarMain" class="navbar-menu">
          <div class="navbar-start">
            <a class="navbar-item" href="#">
              <span class="icon">
                <i class="far fa-images"></i>
              </span>
              <span>Gallery</span>
            </a>
            <a class="navbar-item" href="#about">
              <span class="icon">
                <i class="far fa-question-circle"></i>
              </span>
              <span>About</span>
            </a>
            <a target="_blank" class="navbar-item" href="https://github.com/megaboich/graph-layout-designer">
              <span class="icon">
                <i class="fab fa-github-square"></i>
              </span>
              <span>GitHub</span>
            </a>
          </div>

          ${topRightMenuItems &&
          html`
            <div class="navbar-end">
              <div class="navbar-item">
                <${Dropdown} isRight label="Menu" items=${topRightMenuItems} />
              </div>
            </div>
          `}
        </div>
      </nav>
    `;
  },
};

export default component;
export { component as TopPanel };
