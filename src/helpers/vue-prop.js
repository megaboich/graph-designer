/**
 * This is a simple wrapping function which does actually nothing - just returns its single argument.
 * The main purpose is to have overried TypeScript type definitions which converts type of Vue property to actual field types.
 * @param {any} propType
 * @returns {any}
 */
export function vueProp(propType) {
  return propType;
}
