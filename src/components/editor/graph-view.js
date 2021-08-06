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
 * @property initializeLayout {(iterations?: number)=>void}
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

    this.initializeLayout = (iterations = 30) => {
      const { layoutType, minSeparation, linkDistance } = this.layoutOptions;
      layout = new cola.Layout();
      layout
        .nodes(graph.nodes)
        .links(graph.links)
        .groups(graph.groups)
        .convergenceThreshold(0.05)
        .size([1000, 1000])
        .jaccardLinkLengths(linkDistance)
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
      layout.start(0, 0, iterations);
      layout.tick();
    };

    this.restartLayout = () => {
      graph.nodes.forEach((node) => {
        // eslint-disable-next-line no-bitwise
        node.fixed = (node.fixed || 0) | 2;
      });

      this.initializeLayout(0);

      graph.nodes.forEach((node) => {
        // eslint-disable-next-line no-bitwise
        node.fixed = (node.fixed || 0) & ~6;
      });
    };

    this.initializeLayout();

    const render = new GraphRendererD3({
      graph,
      onUpdate: () => {
        needsUpdate = true;
        layout.resume();
      },
      onNodeClick: (node, flags) => {
        this.onNodeClick(node, flags);
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
    }, 20);

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
