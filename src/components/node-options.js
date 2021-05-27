import { html } from "../dependencies.js";

export default {
  name: "NodeOptions",
  props: {
    node: Object,
    graph: Object,
    onChange: Function,
    onNavigate: Function,
    onDeleteLink: Function,
    onRevertLink: Function,
  },
  render() {
    const { id } = this.node;
    const links = this.graph.links.filter(
      (l) => l.source.id === id || l.target.id === id
    );
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
                <label class="label">Connections</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    ${links.map(
                      (l) =>
                        html`
                          <div class="level is-slim">
                            <div class="level-left">
                              <div class="level-item">
                                ${l.source.id === id
                                  ? "this"
                                  : html`
                                      <button
                                        class="button is-ghost is-slim padding-0"
                                        onclick=${() => {
                                          this.onNavigate({ node: l.source });
                                        }}
                                      >
                                        ${l.source.label}
                                      </button>
                                    `}
                                ->
                                ${l.target.id === id
                                  ? "this"
                                  : html`
                                      <button
                                        class="button is-ghost is-slim padding-0"
                                        onclick=${() => {
                                          this.onNavigate({ node: l.target });
                                        }}
                                      >
                                        ${l.target.label}
                                      </button>
                                    `}
                              </div>
                            </div>
                            <div class="level-right">
                              <div class="level-item buttons">
                                <button
                                  title="Revert link direction"
                                  class="button is-info is-slim padding-05"
                                  onclick=${() => {
                                    this.onRevertLink(l);
                                  }}
                                >
                                  <span class="icon is-small">
                                    <i class="fas fa-random"></i>
                                  </span>
                                </button>
                                <button
                                  title="Delete link"
                                  class="button is-danger is-slim padding-05"
                                  onclick=${() => {
                                    this.onDeleteLink(l);
                                  }}
                                >
                                  <span class="icon is-small">
                                    <i class="fas fa-times"></i>
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        `
                    )}
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
