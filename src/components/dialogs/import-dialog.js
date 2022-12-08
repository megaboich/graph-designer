import { html } from "../../dependencies.js";

import { Modal } from "../generic/modal.js";
import { importGraphToLibraryFromJSON } from "../../data/gallery.js";
import { vueProp } from "../../helpers/vue-prop.js";

/**
 * @typedef {typeof component.props} Props
 * @typedef {ReturnType<typeof component.data>} State
 * @typedef {typeof component.methods} Methods
 * @typedef {Props & State & Methods & VueComponent} ThisVueComponent
 */

/**
 * @typedef {object} ImportResult
 * @property {string=} fileName
 * @property {string=} id
 * @property {string=} errorMessage
 * @property {string=} graphName
 */

const component = {
  props: {
    show: vueProp(Boolean),

    /** @type {() => void} */
    onClose: vueProp(Function),
  },

  data() {
    return {
      importResults: /** @type {ImportResult[]} */ ([]),
    };
  },

  /**
   * @this {ThisVueComponent}
   */
  render() {
    if (!this.show) {
      return null;
    }

    const successImports = this.importResults.filter((x) => !x.errorMessage);
    const failedImports = this.importResults.filter((x) => Boolean(x.errorMessage));

    return html`
      <${Modal}
        title="Import"
        onclose=${() => {
          this.importResults = [];
          this.onClose();
        }}
      >
        <table class="table">
          <tbody>
            <tr>
              <td>
                <div class="file is-info">
                  <label class="file-label">
                    <input
                      class="file-input"
                      multiple
                      type="file"
                      name="resume"
                      onchange=${this.handleImportFromJSON}
                    />
                    <span class="file-cta">
                      <span class="file-icon">
                        <i class="fas fa-upload"></i>
                      </span>
                      <span class="file-label">Import from JSON</span>
                    </span>
                  </label>
                </div>
              </td>
              <td>
                <p>Accepts JSON files created by "Export to JSON" functionality of Graph Designer.</p>
              </td>
            </tr>
            <tr>
              <td class="pt-5">
                <button
                  class="button is-info"
                  onclick=${() => {
                    //
                  }}
                >
                  Import from Base64
                </button>
              </td>
              <td class="pt-5">
                <p>Accepts text files created by "Export to Base64" functionality of Graph Designer.</p>
                <p>(Not implemented yet)</p>
              </td>
            </tr>
            ${failedImports.length &&
            html`
              <tr>
                <td colspan="2">
                  <div class="message is-danger">
                    <div class="message-header">
                      <p>Import failed</p>
                    </div>
                    <div class="message-body">
                      ${failedImports.map(
                        (x) =>
                          html`
                            <p>Import from file "${x.fileName}" failed: ${x.errorMessage}</p>
                          `
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            `}
            ${successImports.length &&
            html`
              <tr>
                <td colspan="2">
                  <div class="message is-success">
                    <div class="message-header">
                      <p>Import operation completed</p>
                    </div>
                    <div class="message-body">
                      ${successImports.map(
                        (x) =>
                          html`
                            <p>
                              Import from file "${x.fileName}" was processed succesfully. New graph "${x.graphName}" was
                              created.${" "}
                              <span><a href="#gallery/${x.id}">Open graph in editor.</a></span>
                            </p>
                          `
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            `}
          </tbody>
        </table>
      <//>
    `;
  },

  methods: {
    /**
     * @this {ThisVueComponent}
     * @param {HTMLInputEvent} event
     */
    async handleImportFromJSON(event) {
      /**
       * @param {File} file
       * @returns {Promise<ImportResult>}
       */
      async function importFromFile(file) {
        try {
          const data = await file.text();
          const newId = await importGraphToLibraryFromJSON(data);
          return { id: newId, fileName: file.name, graphName: newId };
        } catch (ex) {
          return { errorMessage: "Failed", fileName: file.name };
        }
      }

      const input = /** @type {HTMLInputElement} */ (event.target);
      if (input.files) {
        const results = await Promise.all(Array(...input.files).map(importFromFile));
        this.importResults = results;
      }
    },

    /**
     * @this {ThisVueComponent}
     */
    importFromBase64() {
      // TODO
    },
  },
};

export { component as ImportDialog };
