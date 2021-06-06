// @ts-nocheck
import { html } from "../dependencies.js";

export default {
  props: {
    node: Object,
    graph: Object,
    onChange: Function,
  },
  render() {
    return html`
      <nav class="panel">
        <p class="panel-heading is-small">Node: ${this.node.label}</p>
        <div class="panel-block">
          <div class="flex-column">
            <div class="field is-horizontal">
              <div class="field-label is-small is-wide-2">
                <label class="label">Label</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      value=${this.node.label}
                      onchange=${(e) => {
                        this.node.label = e.target.value;
                        this.onChange();
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-small is-wide-2">
                <label for="is-node-fixed" class="label">Fixed</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <label class="checkbox">
                      <input
                        id="is-node-fixed"
                        type="checkbox"
                        checked=${this.node.fixed}
                        onchange=${(e) => {
                          this.node.fixed = e.target.checked;
                          this.onChange();
                        }}
                      />
                    </label>
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
