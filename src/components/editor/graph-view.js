import { GraphRendererD3 } from "./graph-renderer-d3.js";
import { cola } from "../../dependencies.js";

/**
 * @typedef {typeof component.props} Props
 * @typedef {ReturnType<typeof component.data>} State
 * @typedef {typeof component.methods} Methods
 * @typedef {Props & State & Methods & VueComponent} ThisVueComponent
 */

/**
 * Cola layout object is intentionally not a state variable because
 * Vue creates observable wrappers recursively which is a performance kill
 * @type {any}
 * */
let layout;

const component = {
  props: {
    graph: /** @type {GraphData} */ (/** @type {any} */ (Object)),
    graphTitle: /** @type {string} */ (/** @type {any} */ (String)),
    layoutOptions: /** @type {GraphLayoutOptions} */ (/** @type {any} */ (Object)),
    graphStructureUpdatesCount: /** @type {number} */ (/** @type {any} */ (Number)),
    onNodeClick: /** @type {(event: any, node: GraphNode) => void} */ (/** @type {any} */ (Function)),
    onBgClick: /** @type {(flags: any) => void} */ (/** @type {any} */ (Function)),
    selectedNode: /** @type {GraphNode} */ (/** @type {any} */ (Object)),
  },

  data() {
    return {
      needsUpdate: false,
      timerId: -1,
    };
  },

  methods: {
    /** @this {ThisVueComponent} */
    initializeLayout(isUpdated = false) {
      const { graph } = this;
      graph.layout = this.layoutOptions;
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
          this.needsUpdate = true;
        })
        .on(cola.EventType.end, () => {
          this.needsUpdate = false;
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
    },

    /** @this {ThisVueComponent} */
    restartLayout() {
      this.initializeLayout(true);
    },
  },

  template: `
    <div v-once id="main"></div>
  `,

  /** @this {ThisVueComponent} */
  mounted() {
    const { graph } = this;

    this.initializeLayout();

    const render = new GraphRendererD3({
      graph,
      onUpdate: (/** @type {Boolean} */ forceLayout) => {
        this.needsUpdate = true;
        if (forceLayout) {
          layout.start(0, 0, 0, 0, true, false);
        } else {
          layout.resume();
        }
      },
      onNodeClick: (event, node) => {
        this.onNodeClick(event, node);
        this.needsUpdate = true;
      },
      onBgClick: (flags) => {
        this.onBgClick(flags);
        this.needsUpdate = true;
      },
    });

    render.update();

    this.timerId = setInterval(() => {
      if (this.needsUpdate) {
        layout.tick();
        render.setSelectedNodeId(this.selectedNode && this.selectedNode.id);
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
      this.needsUpdate = true;
    });
  },

  /** @this {ThisVueComponent} */
  unmounted() {
    clearInterval(this.timerId);

    /**
     * Because `layout` is not a part of Vue component
     * it is just a variable which is shared between component lifecycles
     * So better to clean it when component creates and destroys
     * Also this design works only if there is only a single instance of this component on the page
     */
    layout = undefined;
  },
};

export default component;
export { component as GraphView };
