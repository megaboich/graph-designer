/**
 * Catitalizes the first symbol in input string
 * @param {string} string
 * @returns {string} result
 */
export function capFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Gerenates random integer in min-max interval
 * @param {number} min
 * @param {number} max
 * @returns {number} result
 */
export function getRandomInt(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

/**
 * Transforms input string to its kebab form
 * Nice Input => nice-input
 * @param {string} input
 * @returns {string}
 */
export function kebabify(input) {
  const id = input.toLowerCase().replace(/\W/g, "-");
  if (!id) {
    throw new Error("Input has no data");
  }
  return id;
}

/**
 * Gets chunks from an array
 * @param {Array<T>} arr
 * @param {Number} n
 * @returns {Array<Array<T>>}
 * @template T
 */
export function chunks(arr, n) {
  const res = [];
  for (let i = 0; i < arr.length; i += n) {
    res.push(arr.slice(i, i + n));
  }
  return res;
}
