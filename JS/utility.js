//Generate random number within range with min and max included
export function randomNumFromInterval(min, max) {
  return Math.random() * (max - min + 1) + min;
}

//Get random color form color array
export function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}
