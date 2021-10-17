/**
 * @typedef {object} GraphNode
 * @property id {string}
 * @property label {string}
 * @property index {number}
 * @property x {number=}
 * @property y {number=}
 * @property width {number=}
 * @property height {number=}
 * @property rx {number=}
 * @property ry {number=}
 * @property bounds {any=}
 * @property hardWidth {number=}
 * @property hardHeight {number=}
 * @property fixed {number=}
 * @property imageUrl {string=}
 * @property imageOriginalWidth {number=}
 * @property imageOriginalHeight {number=}
 * @property imageZoom {number=}
 * @property imageWidth {number=}
 * @property imageHeight {number=}
 */

/**
 * @typedef {object} GraphGroup
 * @property leaves {Array<Number> | Array<GraphNode>}
 * @property style {string}
 * @property padding {any}
 * @property bounds {any=}
 */

/**
 * @typedef {object} GraphLink
 * @property source {GraphNode}
 * @property target {GraphNode}
 * @property route {any=}
 */

/**
 * @typedef {object} GraphData
 * @property nodes {Array<GraphNode>}
 * @property links {Array<GraphLink>}
 * @property groups {Array<GraphGroup>}
 * @property constraints {Array<any>}
 * @property selectedNodeId {string=}
 */

/**
 * @typedef {object} GraphSerializedNode
 * @property id {string}
 * @property label {string}
 * @property x {number=}
 * @property y {number=}
 * @property width {number=}
 * @property height {number=}
 * @property image {string=}
 */

/**
 * @typedef {object} GraphSerializedLink
 * @property source {string}
 * @property target {string}
 */

/**
 * @typedef {object} GraphSerializedGroup
 * @property members {Array<string>}
 * @property style {string}
 * @property padding {any}
 */

/**
 * @typedef {object} GraphSerializedData
 * @property nodes {Array<GraphSerializedNode>}
 * @property links {Array<GraphSerializedLink>}
 * @property groups {Array<GraphSerializedGroup>}
 */

/**
 * @typedef {object} GraphLayoutOptions
 * @property layoutType {string}
 * @property linkDistance {number}
 * @property minSeparation {number}
 */
