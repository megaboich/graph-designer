import { html } from "../dependencies.js";

import Select from "./select.js";

export default {
  name: "GraphOptions",
  props: {
    layoutOptions: Object,
  },
  render() {
    return html`
      <nav class="panel">
        <p class="panel-heading is-small">Properties</p>
        <div class="panel-block">
          <div class="flex-column">
            <div class="field is-horizontal">
              <div class="field-label is-small is-wide-2">
                <label class="label">Layout type</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <div class="select">
                      <${Select}
                        value=${this.layoutOptions.layoutType}
                        options=${[
                          { value: "auto", text: "Auto" },
                          { value: "disabled", text: "Disabled" },
                          { value: "flow-x", text: "Flow left to right" },
                          { value: "flow-y", text: "Flow top to bottom" },
                        ]}
                        onchange=${(val) => {
                          this.layoutOptions.layoutType = val;
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ${(this.layoutOptions.layoutType === "flow-x" ||
              this.layoutOptions.layoutType === "flow-y") &&
            html`
              <div class="field is-horizontal">
                <div class="field-label is-small is-wide-2">
                  <label
                    class="label"
                    title="Number specifying a minimum spacing required across all links"
                  >
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
                        value=${this.layoutOptions.minSeparation}
                        oninput=${(e) => {
                          this.layoutOptions.minSeparation = parseInt(
                            e.target.value,
                            10
                          );
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
                      value=${this.layoutOptions.linkDistance}
                      oninput=${(e) => {
                        this.layoutOptions.linkDistance = parseInt(
                          e.target.value,
                          10
                        );
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
