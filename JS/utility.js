//Generate random number within range with min and max included
function randomNumFromInterval(min, max) {
  return Math.random() * (max - min + 1) + min;
}

//Get random color form color array
function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

export { randomNumFromInterval, randomColor };
