import { html } from "../../dependencies.js";

/**
 * @typedef {object} EditorPanelLinks
 * -- props
 * @property node {GraphNode}
 * @property graph {GraphData}
 * @property onNavigate {Function}
 * @property onDeleteLink {Function}
 * @property onRevertLink {Function}
 */

/**
 * @param {GraphLink} link
 * @param {String} nodeId
 * @this EditorPanelLinks
 */
function renderLinkNavigation(link, nodeId) {
  return html`
    <div class="level-item">
      ${link.source.id === nodeId
        ? html`
            <span class="mr-1">to</span>
            <button
              class="button is-ghost is-slim p-0"
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
              class="button is-ghost is-slim p-0"
              onclick=${() => {
                this.onNavigate(link.source);
              }}
            >
              ${link.source.label}
            </button>
          `}
    </div>
  `;
}

/**
 * @param {GraphLink} link
 * @param {String} nodeId
 * @this EditorPanelLinks
 */
function renderLink(link, nodeId) {
  return html`
    <div class="level mb-1">
      <div class="level-left">
        ${renderLinkNavigation.call(this, link, nodeId)}
      </div>
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
              <i class="fas fa-times"></i>
            </span>
          </button>
        </div>
      </div>
    </div>
  `;
}

export default {
  props: {
    node: Object,
    graph: Object,
    onNavigate: Function,
    onDeleteLink: Function,
    onRevertLink: Function,
  },

  /**
   * @this {EditorPanelLinks}
   */
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
            ${inLinks.map((l) => renderLink.call(this, l, id))}
            ${outLinks.map((l) => renderLink.call(this, l, id))}
          </div>
        </div>
      </nav>
    `;
  },
};
