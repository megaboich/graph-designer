import { html } from "../../dependencies.js";
import { Select } from "../generic/select.js";
import { vueProp } from "../../helpers/vue-prop.js";

/**
 * @typedef {typeof component.props} Props
 * @typedef {ReturnType<typeof component.data>} State
 * @typedef {typeof component.methods} Methods
 * @typedef {Props & State & Methods & VueComponent} ThisVueComponent
 */

const component = {
  props: {
    /** @type {GraphOptions} */
    graphOptions: vueProp(Object),

    /** @type {(optionsChange: Partial<GraphOptions>)=>{}} */
    onChange: vueProp(Function),
  },

  data() {
    return {};
  },

  methods: {},

  /**
   * @this {ThisVueComponent}
   */
  render() {
    const { graphOptions } = this;

    return html`
      <nav class="panel">
        <p class="panel-heading is-small">Properties</p>
        <div class="panel-block">
          <div class="flex-column">
            <div class="field is-horizontal">
              <div class="field-label is-small is-wide-2">
                <label class="label">Graph title</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input
                      class="input"
                      type="input"
                      min="10"
                      value=${graphOptions.title}
                      onchange=${(/** @type {HTMLInputEvent} */ e) => {
                        this.onChange({ title: e.target.value });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-small is-wide-2">
                <label class="label">Layout type</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <div class="select">
                      <${Select}
                        value=${graphOptions.layoutType}
                        options=${[
                          { value: "auto", text: "Auto" },
                          { value: "disabled", text: "Disabled" },
                          { value: "flow-x", text: "Flow left to right" },
                          { value: "flow-y", text: "Flow top to bottom" },
                        ]}
                        onchange=${(/** @type {string} */ val) => {
                          this.onChange({ layoutType: val });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ${(graphOptions.layoutType === "flow-x" || graphOptions.layoutType === "flow-y") &&
            html`
              <div class="field is-horizontal">
                <div class="field-label is-small is-wide-2">
                  <label class="label" title="Number specifying a minimum spacing required across all links">
                    Min separation
                  </label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <div class="control">
                      <input
                        class="input"
                        type="number"
                        min="10"
                        value=${graphOptions.minSeparation}
                        oninput=${(/** @type {HTMLInputEvent} */ e) => {
                          this.onChange({ minSeparation: parseInt(e.target.value, 10) });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            `}
            <div class="field is-horizontal">
              <div class="field-label is-small is-wide-2">
                <label class="label">Link distance</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input
                      class="input"
                      type="number"
                      min="10"
                      value=${graphOptions.linkDistance}
                      oninput=${(/** @type {HTMLInputEvent} */ e) => {
                        this.onChange({ linkDistance: parseInt(e.target.value, 10) });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    `;
  },
};

export { component as EditorPanelProperties };
