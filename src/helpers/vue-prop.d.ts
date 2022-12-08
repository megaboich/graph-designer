
/**
 * This is a simple wrapping function which does actually nothing - just returns its single argument.
 * The main purpose is to have overried TypeScript type definitions which converts type of Vue property to actual field type.
 */
export function vueProp(propType: StringConstructor): string

export function vueProp(propType: NumberConstructor): number

export function vueProp(propType: BooleanConstructor): boolean

export function vueProp<T extends Object>(propType: ObjectConstructor): T

export function vueProp<T extends Function>(propType: FunctionConstructor): T

export function vueProp<T>(propType: ArrayConstructor): T[]
