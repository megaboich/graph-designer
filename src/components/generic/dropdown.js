import { html } from "../../dependencies.js";
import { vueProp } from "../../helpers/vue-prop.js";

/**
 * @typedef {typeof component.props} Props
 * @typedef {ReturnType<typeof component.data>} State
 * @typedef {typeof component.methods} Methods
 * @typedef {Props & State & Methods & VueComponent} ThisVueComponent
 */

let instanceCounter = 0;

const component = {
  name: "Dropdown",
  props: {
    label: vueProp(String),

    /** @type {Array<DropdownItem | false>} */
    items: vueProp(Array),

    isRight: vueProp(Boolean),
  },
  data() {
    return {
      isOpen: false,
      instanceId: "",
    };
  },
  methods: {
    /**
     * @this {ThisVueComponent}
     * @param {boolean=} show
     */
    toggleMenu(show = undefined) {
      const newIsOpen = show !== undefined ? show : !this.isOpen;
      if (newIsOpen) {
        setTimeout(() => {
          document.addEventListener("click", this.handleGlobalClick);
        }, 100);
      } else {
        document.removeEventListener("click", this.handleGlobalClick);
      }
      this.isOpen = newIsOpen;
    },
    /**
     * @this {ThisVueComponent}
     */
    handleGlobalClick() {
      this.toggleMenu(false);
    },
  },

  /**
   * @this {ThisVueComponent}
   */
  beforeMount() {
    this.instanceId = `drop${instanceCounter}`;
    ++instanceCounter;
  },

  /**
   * @this {ThisVueComponent}
   */
  render() {
    return html`
      <div class=${`dropdown ${this.isOpen ? "is-active" : ""} ${this.isRight ? "is-right" : ""}`}>
        <div class="dropdown-trigger">
          <button
            class="button"
            aria-haspopup="true"
            aria-controls=${this.instanceId}
            onclick=${() => this.toggleMenu()}
          >
            <span>${this.label}</span>
            <span class="icon is-small">
              <i class="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </button>
        </div>
        <div class="dropdown-menu" id=${this.instanceId} role="menu">
          <div class="dropdown-content">
            ${this.items.map((item) => {
              if (!item) {
                return undefined;
              }
              return item.separator
                ? html`
                    <hr class="dropdown-divider" />
                  `
                : html`
                    <a href="javascript:void(0)" class="dropdown-item" onclick=${() => item.onclick && item.onclick()}>
                      ${item.label}
                    </a>
                  `;
            })}
          </div>
        </div>
      </div>
    `;
  },
};

export { component as Dropdown };
