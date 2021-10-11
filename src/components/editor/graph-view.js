import { GraphRendererD3 } from "./graph-renderer-d3.js";
import { cola } from "../../dependencies.js";

/**
 * @typedef {object} GraphView
 * -- props
 * @property graph {GraphData}
 * @property layoutOptions {GraphLayoutOptions}
 * @property graphStructureUpdatesCount {Number}
 * @property onNodeClick {Function}
 * @property selectedNode {GraphNode}
 * @property onBgClick {Function}
 * -- methods
 * @property initializeLayout {(isUpdated?: boolean)=>void}
 * @property restartLayout {()=>void}
 *
 * @typedef {GraphView & VueComponent} GraphViewVue
 */

export default {
  props: {
    graph: Object,
    layoutOptions: Object,
    graphStructureUpdatesCount: Number,
    onNodeClick: Function,
    onBgClick: Function,
    selectedNode: Object,
  },

  template: `
    <div v-once id="main"></div>
  `,

  /**
   * @this {GraphViewVue}
   */
  mounted() {
    const { graph } = this;

    let needsUpdate = false;
    /** @type {any} */
    let layout;

    this.initializeLayout = (isUpdated = false) => {
      const { layoutType, minSeparation, linkDistance } = this.layoutOptions;
      layout = new cola.Layout();
      layout
        .nodes(graph.nodes)
        .links(graph.links)
        .groups(graph.groups)
        .convergenceThreshold(0.05)
        .size([1000, 1000])
        .linkDistance((/** @type {GraphLink} */ link) => {
          return (
            linkDistance +
            ((link.source.width || 0) + (link.source.height || 0)) / 4.1 +
            ((link.target.width || 0) + (link.target.height || 0)) / 4.1
          );
        })
        .avoidOverlaps(true)
        .on(cola.EventType.start, () => {
          needsUpdate = true;
        })
        .on(cola.EventType.end, () => {
          needsUpdate = false;
        });

      if (layoutType === "flow-x") {
        layout.flowLayout("x", minSeparation);
      }
      if (layoutType === "flow-y") {
        layout.flowLayout("y", minSeparation);
      }

      layout.kick = () => {};
      layout.start(0, 0, isUpdated ? 0 : 30, 0, true, !isUpdated);
      layout.tick();
    };

    this.restartLayout = () => {
      this.initializeLayout(true);
    };

    this.initializeLayout();

    const render = new GraphRendererD3({
      graph,
      onUpdate: (/** @type {Boolean} */ forceLayout) => {
        needsUpdate = true;
        if (forceLayout) {
          layout.start(0, 0, 0, 0, true, false);
        } else {
          layout.resume();
        }
      },
      onNodeClick: (event, node) => {
        this.onNodeClick(event, node);
        needsUpdate = true;
      },
      onBgClick: (flags) => {
        this.onBgClick(flags);
        needsUpdate = true;
      },
    });

    render.update();

    setInterval(() => {
      if (needsUpdate) {
        layout.tick();
        graph.selectedNodeId = this.selectedNode && this.selectedNode.id;
        render.update();
      }
    }, 1000 / 60 /** 60fps */);

    this.$watch("layoutOptions", this.restartLayout, { deep: true });
    this.$watch("graphStructureUpdatesCount", () => {
      render.destroyElements();
      render.setupElements();
      this.restartLayout();
      render.update();
    });
    this.$watch("selectedNode", () => {
      needsUpdate = true;
    });
  },
};
