import { GraphRendererD3 } from "./graph-renderer-d3.js";
import { cola } from "../../dependencies.js";
import { vueProp } from "../../helpers/vue-prop.js";

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
 */
let layout;

const component = {
  props: {
    /** @type {GraphData} */
    graph: vueProp(Object),

    /** @type {GraphOptions} */
    graphOptions: vueProp(Object),

    graphLayoutTrigger: vueProp(Number),

    /** @type {(event: any, node: GraphNode) => void} */
    onNodeClick: vueProp(Function),

    /** @type {(flags: any) => void} */
    onBgClick: vueProp(Function),

    /** @type {GraphNode} */
    selectedNode: vueProp(Object),
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
      graph.options = this.graphOptions;
      const { layoutType, minSeparation, linkDistance } = this.graphOptions;
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

    const render = new GraphRendererD3({
      graph,
      onNodeMove: () => {
        this.needsUpdate = true;
        layout.resume();
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

    this.initializeLayout();

    render.updateElements();

    this.timerId = setInterval(() => {
      if (this.needsUpdate) {
        layout.tick();
        render.setSelectedNodeId(this.selectedNode && this.selectedNode.id);
        render.updateElements();
      }
    }, 1000 / 60 /** 60fps */);

    this.$watch("graphOptions", this.restartLayout, { deep: true });
    this.$watch("graphLayoutTrigger", () => {
      render.renderElements();
      this.restartLayout();
      render.updateElements();
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

export { component as GraphView };
