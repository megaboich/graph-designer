import { html } from "../../dependencies.js";
import Select from "../generic/select.js";

/**
 * @typedef {object} EditorPanelProperties
 * -- props
 * @property {GraphLayoutOptions} layoutOptions
 * @property {string} graphTitle
 * @property {(data: {graphTitle: string})=>{}} onChange
 */

export default {
  props: {
    layoutOptions: Object,
    graphTitle: String,
    onChange: Function,
  },

  /**
   * @this {EditorPanelProperties}
   */
  render() {
    const { layoutOptions } = this;

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
                      value=${this.graphTitle}
                      onchange=${(/** @type {HTMLInputEvent} */ e) => {
                        this.onChange({ graphTitle: e.target.value });
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
                        value=${layoutOptions.layoutType}
                        options=${[
                          { value: "auto", text: "Auto" },
                          { value: "disabled", text: "Disabled" },
                          { value: "flow-x", text: "Flow left to right" },
                          { value: "flow-y", text: "Flow top to bottom" },
                        ]}
                        onchange=${(/** @type {string} */ val) => {
                          layoutOptions.layoutType = val;
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ${(layoutOptions.layoutType === "flow-x" || layoutOptions.layoutType === "flow-y") &&
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
                        value=${layoutOptions.minSeparation}
                        oninput=${(/** @type {HTMLInputEvent} */ e) => {
                          layoutOptions.minSeparation = parseInt(e.target.value, 10);
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
                      value=${layoutOptions.linkDistance}
                      oninput=${(/** @type {HTMLInputEvent} */ e) => {
                        layoutOptions.linkDistance = parseInt(e.target.value, 10);
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
