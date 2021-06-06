/**
 * @typedef GraphNode
 * @property id {string}
 * @property label {string}
 * @property index {number}
 * @property x {number=}
 * @property y {number=}
 * @property width {number=}
 * @property height {number=}
 * @property rx {number=}
 * @property ry {number=}
 * @property innerBounds {any=}
 * @property bounds {any=}
 * @property hardWidth {number=}
 * @property hardHeight {number=}
 * @property fixed {boolean=}
 */

/**
 * @typedef GraphGroup
 * @property leaves {Array<GraphNode>}
 * @property style {string}
 * @property padding {any}
 * @property bounds {any=}
 */

/**
 * @typedef GraphLink
 * @property source {GraphNode}
 * @property target {GraphNode}
 * @property route {any=}
 */

/**
 * @typedef GraphData
 * @property nodes {Array<GraphNode>}
 * @property links {Array<GraphLink>}
 * @property groups {Array<GraphGroup>}
 * @property constraints {Array<any>}
 * @property selectedNodeId {string=}
 */

/**
 * @typedef GraphSerializedNode
 * @property id {string}
 * @property label {string}
 * @property width {number}
 * @property height {number}
 */

/**
 * @typedef GraphSerializedLink
 * @property source {string}
 * @property target {string}
 */

/**
 * @typedef GraphSerializedGroup
 * @property members {Array<string>}
 * @property style {string}
 * @property padding {any}
 */

/**
 * @typedef GraphSerializedData
 * @property nodes {Array<GraphSerializedNode>}
 * @property links {Array<GraphSerializedLink>}
 * @property groups {Array<GraphSerializedGroup>}
 */
