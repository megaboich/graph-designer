import { html } from "../../dependencies.js";

/**
 * @typedef {typeof component.props} Props
 * @typedef {ReturnType<typeof component.data>} State
 * @typedef {typeof component.methods} Methods
 * @typedef {Props & State & Methods & VueComponent} ThisVueComponent
 */

const component = {
  props: {
    node: /** @type {GraphNode} */ (/** @type {any} */ (Object)),
    graph: /** @type {GraphData} */ (/** @type {any} */ (Object)),
    onNavigate: /** @type {(node: GraphNode) => void} */ (/** @type {any} */ (Function)),
    onDeleteLink: /** @type {(link: GraphLink) => void} */ (/** @type {any} */ (Function)),
    onRevertLink: /** @type {(link: GraphLink) => void} */ (/** @type {any} */ (Function)),
  },

  data() {
    return {};
  },

  /** @this {ThisVueComponent} */
  render() {
    const { id } = this.node;
    const inLinks = [];
    const outLinks = [];
    for (const link of this.graph.links) {
      if (link.source.id === id) {
        inLinks.push(link);
      }
      if (link.target.id === id) {
        outLinks.push(link);
      }
    }

    return html`
      <nav class="panel">
        <p class="panel-heading is-small">Connections</p>
        <div class="panel-block">
          <div class="flex-column">
            ${inLinks.map((l) => this.renderLink(l, id))} ${outLinks.map((l) => this.renderLink(l, id))}
          </div>
        </div>
      </nav>
    `;
  },

  methods: {
    /**
     * @this {ThisVueComponent}
     * @param {GraphLink} link
     * @param {String} nodeId
     */
    renderLinkNavigation(link, nodeId) {
      return html`
        <div class="level-item">
          ${link.source.id === nodeId
            ? html`
                <span class="mr-1">to</span>
                <button
                  class="button is-ghost is-slim p-0 btn-link-connection"
                  onclick=${() => {
                    this.onNavigate(link.target);
                  }}
                >
                  ${link.target.label}
                </button>
              `
            : html`
                <span class="mr-1">from</span>
                <button
                  class="button is-ghost is-slim p-0 btn-link-connection"
                  onclick=${() => {
                    this.onNavigate(link.source);
                  }}
                >
                  ${link.source.label}
                </button>
              `}
        </div>
      `;
    },

    /**
     * @this {ThisVueComponent}
     * @param {GraphLink} link
     * @param {String} nodeId
     */
    renderLink(link, nodeId) {
      return html`
        <div class="level mb-1">
          <div class="level-left">${this.renderLinkNavigation(link, nodeId)}</div>
          <div class="level-right">
            <div class="level-item buttons">
              <button
                title="Change direction"
                class="button is-info is-slim p-2"
                onclick=${() => {
                  this.onRevertLink(link);
                }}
              >
                <span class="icon is-small">
                  <i class="fas fa-random"></i>
                </span>
              </button>
              <button
                title="Delete link"
                class="button is-danger is-slim p-2"
                onclick=${() => {
                  this.onDeleteLink(link);
                }}
              >
                <span class="icon is-small">
                  <i class="far fa-trash-alt"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      `;
    },
  },
};

export default component;
export { component as EditorPanelLinks };
