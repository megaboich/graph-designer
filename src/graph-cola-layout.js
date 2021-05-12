import * as cola from "./lib/cola.esm.js";

export class GraphColaLayout extends cola.Layout {
  constructor(render) {
    super();
    this.render = render;
    this._enabled = true;
    this.timerHandle = undefined;
    this._isLayoutCalculated = false;
  }

  get isRunning() {
    return !!this.timerHandle;
  }

  get isLayoutCalculated() {
    if (!this._enabled) {
      return true;
    }
    return this._isLayoutCalculated;
  }

  init(options) {
    this._enabled = options.enable;
    console.log("INIT layout", options);
    if (!this._enabled) {
      this.clearTimer(); // In case we have simulation running
      return;
    }
    this.startTimer();
    this._isLayoutCalculated = false;

    /**
     * During (re)initialization of layout the idea is to fix all nodes so they not jump
     * Later on the first tick iteration those nodes are unfixed
     */
    let shouldRevertOriginalFixedState = false;
    for (const n of options.nodes) {
      n.fixed |= 2;
    }
    shouldRevertOriginalFixedState = true;

    this.nodes(options.nodes)
      .links(options.links)
      .groups(options.groups)
      .convergenceThreshold(0.05)
      .size([options.width, options.height])
      .jaccardLinkLengths(30)
      .linkDistance((x) => {
        return options.forceLinkLength;
      })
      .avoidOverlaps(true)
      //.flowLayout("x", 50)
      .on(cola.EventType.start, (e) => {
        //console.log("Cola layout start event", e);
      })
      .on(cola.EventType.tick, (e) => {
        this._isLayoutCalculated = true;

        // Unfix previously fixed nodes
        if (shouldRevertOriginalFixedState) {
          for (let ni = 0; ni < options.nodes.length; ++ni) {
            options.nodes[ni].fixed &= ~2;
          }
          shouldRevertOriginalFixedState = false;
        }

        if (this.isRunning) {
          this.render();
        }
      })
      .on(cola.EventType.end, (e) => {
        //console.log("Cola layout end event", e);
        this.clearTimer();
        this.render();
      })
      .start(0, 0, 0, 0, true);
  }

  triggerLayout() {
    if (!this._enabled) {
      return;
    }
    if (!this.isRunning) {
      this.startTimer();
      this.resume();
    }
  }

  timerTick = () => {
    if (!this._enabled) {
      return;
    }
    if (this.isRunning) {
      super.tick();
    }
  };

  /**
   * It is important to override super tick method and return true.
   * This will stop WebCola to call it in a loop until layout finish
   * We want to call original tick in the timer manually in order to animate layout
   */
  tick() {
    return true;
  }

  startTimer() {
    if (!this._enabled) {
      return;
    }
    if (!this.timerHandle) {
      this.timerHandle = setInterval(this.timerTick, 50);
    }
  }

  clearTimer() {
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
      this.timerHandle = undefined;
    }
  }
}
