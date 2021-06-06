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
