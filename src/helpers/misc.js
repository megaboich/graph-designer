export function capFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getRandomInt(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}
