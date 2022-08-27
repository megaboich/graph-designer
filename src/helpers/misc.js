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
 * Gets chunks from an array
 * @template T
 * @param {T[]} arr
 * @returns {T} result
 */
export function pickRandomElement(arr) {
  return arr[getRandomInt(0, arr.length - 1)];
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
 * @template T
 * @param {T[]} arr
 * @param {Number} n
 * @returns {T[][]}
 */
export function chunks(arr, n) {
  const res = [];
  for (let i = 0; i < arr.length; i += n) {
    res.push(arr.slice(i, i + n));
  }
  return res;
}
