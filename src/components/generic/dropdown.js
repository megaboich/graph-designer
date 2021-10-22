import { html } from "../../dependencies.js";

/**
 * @typedef {object} DropdownItem
 * @property label {String=}
 * @property icon {String=}
 * @property separator {Boolean=}
 * @property onclick {Function=}
 *
 * @typedef {object} Select
 * -- props
 * @property label {String}
 * @property items {Array<DropdownItem>}
 * @property isRight {Boolean}
 * -- state
 * @property instanceId {String}
 * @property isOpen {Boolean}
 * -- methods
 * @property toggleMenu {(show?: boolean)=>void}
 * @property handleGlobalClick {()=>void}
 *
 * @typedef {Select & VueComponent} SelectVue
 */

let instanceCounter = 0;

export default {
  name: "Dropdown",
  props: {
    label: String,
    items: Array,
    isRight: Boolean,
  },
  data() {
    return { isOpen: false };
  },
  methods: {
    /**
     * @param {Boolean=} show
     * @this {SelectVue}
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
     * @this {SelectVue}
     */
    handleGlobalClick() {
      this.toggleMenu(false);
    },
  },

  /**
   * @this {SelectVue}
   */
  beforeMount() {
    this.instanceId = `drop${instanceCounter}`;
    ++instanceCounter;
  },

  /**
   * @this {SelectVue}
   */
  render() {
    return html`
      <div
        class=${`dropdown ${this.isOpen ? "is-active" : ""} ${
          this.isRight ? "is-right" : ""
        }`}
      >
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
            ${this.items.map((item) =>
              item.separator
                ? html`
                    <hr class="dropdown-divider" />
                  `
                : html`
                    <a
                      href="javascript:void(0)"
                      class="dropdown-item"
                      onclick=${() => item.onclick && item.onclick()}
                    >
                      ${item.label}
                    </a>
                  `
            )}
          </div>
        </div>
      </div>
    `;
  },
};
