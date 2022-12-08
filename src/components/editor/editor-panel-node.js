import { html } from "../../dependencies.js";
import { assignNodeImageAndDimensions } from "../../data/graph-helpers.js";
import { vueProp } from "../../helpers/vue-prop.js";

/**
 * @typedef {typeof component.props} Props
 * @typedef {ReturnType<typeof component.data>} State
 * @typedef {typeof component.methods} Methods
 * @typedef {Props & State & Methods & VueComponent} ThisVueComponent
 */

const component = {
  props: {
    /** @type {GraphNode} */
    node: vueProp(Object),

    /** @type {GraphData} */
    graph: vueProp(Object),

    /** @type {() => void} */
    onChange: vueProp(Function),
  },

  data() {
    return {};
  },

  methods: {
    /** @this {ThisVueComponent} */
    onTextInputChange(/** @type {HTMLInputEvent} */ e) {
      this.node.label = e.target.value;
      this.onChange();
    },

    /** @this {ThisVueComponent} */
    onFileInputChange(/** @type {HTMLInputEvent} */ e) {
      if (e.target && e.target.files && e.target.files.length > 0) {
        const reader = new FileReader();
        reader.onload = async (/** @type {any} */ e2) => {
          await assignNodeImageAndDimensions(this.node, e2.target.result);
          this.onChange();
        };
        if (e.target.files[0].size > 1 * 1024 * 1024) {
          throw new Error("File is too big");
        }
        reader.readAsDataURL(e.target.files[0]);
      }
    },

    /** @this {ThisVueComponent} */
    async onUrlInputChange(/** @type {HTMLInputEvent} */ e) {
      await assignNodeImageAndDimensions(this.node, e.target.value);
      this.onChange();
    },

    /** @this {ThisVueComponent} */
    onImageZoomChange(/** @type {HTMLInputEvent} */ e) {
      const number = Number(e.target.value);
      if (!Number.isNaN(number)) {
        this.node.imageZoom = number;
        this.node.imageWidth = Math.round(((this.node.imageOriginalWidth || 1) * number) / 100);
        this.node.imageHeight = Math.round(((this.node.imageOriginalHeight || 1) * number) / 100);
        this.onChange();
      }
    },

    /** @this {ThisVueComponent} */
    onDeleteImageClick() {
      delete this.node.imageUrl;
      delete this.node.imageOriginalWidth;
      delete this.node.imageOriginalHeight;
      delete this.node.imageWidth;
      delete this.node.imageHeight;
      delete this.node.imageZoom;
      this.onChange();
    },

    /** @this {ThisVueComponent} */
    onFixedCheckboxChange(/** @type {HTMLInputEvent} */ e) {
      this.node.fixed = Number(e.target.checked);
      this.onChange();
    },
  },

  /** @this {ThisVueComponent} */
  render() {
    const textLinesCount = this.node.label ? this.node.label.split(`\n`).length : 1;

    return html`
      <nav class="panel">
        <p class="panel-heading is-small">${this.node.label}</p>
        <div class="panel-block">
          <div class="flex-column">
            <div class="field is-horizontal">
              <div class="field-label is-small is-wide-1">
                <label class="label">Text</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <textarea
                      class="textarea p-1 pl-2"
                      style="resize:none"
                      wrap="off"
                      placeholder="Text label of the node"
                      rows=${textLinesCount}
                      value=${this.node.label}
                      oninput=${this.onTextInputChange}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            ${!this.node.imageUrl &&
            html`
            <div class="field is-horizontal">
              <div class="field-label is-small is-wide-1">
                <label for="is-node-fixed" class="label">Image</label>
              </div>
              <div class="field-body">
                <div class="field has-addons">
                  <p class="control is-expanded">
                    <input 
                      class="input"
                      type="text" 
                      placeholder="Image url or upload" 
                      value=${this.node.imageUrl} 
                      onchange=${this.onUrlInputChange}
                    />
                  </p>
                  <p class="control">
                    <div class="file is-right" title="Upload image">
                      <label class="file-label">
                        <input 
                          class="file-input" 
                          type="file" 
                          name="resume"
                          onchange=${this.onFileInputChange} 
                        />
                        <span class="file-cta">
                          <span class="icon is-small">
                            <i class="fas fa-upload"></i>
                          </span>
                        </span>
                      </label>
                    </div>
                  </p>
                </div>
              </div>
            </div>
            `}
            ${this.node.imageUrl &&
            html`
              <div class="field is-horizontal">
                <div class="field-label is-small is-wide-1">
                  <label for="is-node-fixed" class="label">Image data</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <div class="control">
                      <div class="node-img-url-container">
                        ${this.node.imageUrl.startsWith("data:")
                          ? `${this.node.imageUrl.substring(0, 48)}...`
                          : this.node.imageUrl}
                      </div>
                    </div>
                  </div>
                  <div class="field">
                    <div class="control">
                      <button
                        title="Delete image"
                        class="button is-danger is-slim p-2 mt-1"
                        onclick=${this.onDeleteImageClick}
                      >
                        <span class="icon is-small">
                          <i class="far fa-trash-alt"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-small is-wide-1">
                  <label for="is-node-fixed" class="label">Image zoom</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <div class="control has-icons-left has-icons-right">
                      <input
                        class="input"
                        type="number"
                        min="1"
                        placeholder="Zoom"
                        value=${this.node.imageZoom}
                        oninput=${this.onImageZoomChange}
                      />
                      <span class="icon is-small is-left">
                        <i class="fas fa-search-plus"></i>
                      </span>
                      <span class="icon is-small is-right">
                        <i class="fas fa-percent"></i>
                      </span>
                    </div>
                  </div>
                  <div class="field pt-1 is-size-7">
                    <div>Original: ${this.node.imageOriginalWidth}x${this.node.imageOriginalHeight}</div>
                    <div>Scaled: ${this.node.imageWidth}x${this.node.imageHeight}</div>
                  </div>
                </div>
              </div>
            `}

            <div class="field is-horizontal">
              <div class="field-label is-small is-wide-1">
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
                        onchange=${this.onFixedCheckboxChange}
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

export { component as EditorPanelNode };
