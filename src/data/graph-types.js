/**
 * @typedef {object} GraphNode
 * @property {string} id
 * @property {string} label
 * @property {number} index
 * @property {number=} x
 * @property {number=} y
 * @property {number=} width
 * @property {number=} height
 * @property {number=} rx
 * @property {number=} ry
 * @property {any=} bounds
 * @property {number=} hardWidth
 * @property {number=} hardHeight
 * @property {number=} fixed
 * @property {string=} imageUrl
 * @property {number=} imageOriginalWidth
 * @property {number=} imageOriginalHeight
 * @property {number=} imageZoom
 * @property {number=} imageWidth
 * @property {number=} imageHeight
 * @property {boolean=} needsToRerender  Flag indicating that some node graphical attributes were changed and render is needed
 */

/**
 * @typedef {object} GraphGroup
 * @property {Array<Number> | Array<GraphNode>} leaves
 * @property {string} style
 * @property {any} padding
 * @property {any=} bounds
 */

/**
 * @typedef {object} GraphLink
 * @property {GraphNode} source
 * @property {GraphNode} target
 * @property {any=} route
 */

/**
 * @typedef {object} GraphData
 * @property {Array<GraphNode>} nodes
 * @property {Array<GraphLink>} links
 * @property {Array<GraphGroup>} groups
 * @property {Array<any>} constraints
 * @property {GraphTransform} transform
 * @property {GraphOptions} options
 */

/**
 * @typedef {object} GraphSerializedNode
 * @property {string} id
 * @property {string} label
 * @property {number=} x
 * @property {number=} y
 * @property {number=} width
 * @property {number=} height
 * @property {string=} image
 * @property {number=} imageZoom
 */

/**
 * @typedef {object} GraphSerializedLink
 * @property {string} source
 * @property {string} target
 */

/**
 * @typedef {object} GraphSerializedGroup
 * @property {Array<string>} members
 * @property {string} style
 * @property {any} padding
 */

/**
 * @typedef {object} GraphSerializedData
 * @property {Array<GraphSerializedNode>} nodes
 * @property {Array<GraphSerializedLink>} links
 * @property {Array<GraphSerializedGroup>} groups
 * @property {GraphTransform} transform
 * @property {GraphOptions} options
 */

/**
 * @typedef {object} GraphOptions
 * @property {string} title
 * @property {string} layoutType
 * @property {number} linkDistance
 * @property {number} minSeparation
 */

/**
 * @typedef {object} GraphTransform
 * @property {number} x
 * @property {number} y
 * @property {number} k
 */
