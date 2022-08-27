import { html } from "../../dependencies.js";

/**
 * @typedef {object} Dropdown
 * -- props
 * @property {string} label
 * @property {Array<DropdownItem | false>} items
 * @property {boolean} isRight
 * -- state
 * @property {string} instanceId
 * @property {boolean} isOpen
 * -- methods
 * @property {(show?: boolean)=>void} toggleMenu
 * @property {()=>void} handleGlobalClick
 *
 * @typedef {Dropdown & VueComponent} DropdownVue
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
     * @param {boolean=} show
     * @this {DropdownVue}
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
     * @this {DropdownVue}
     */
    handleGlobalClick() {
      this.toggleMenu(false);
    },
  },

  /**
   * @this {DropdownVue}
   */
  beforeMount() {
    this.instanceId = `drop${instanceCounter}`;
    ++instanceCounter;
  },

  /**
   * @this {DropdownVue}
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
