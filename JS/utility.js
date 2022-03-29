//Generate random number within range with min and max included
function randomNumFromInterval(min, max) {
  return Math.random() * (max - min + 1) + min;
}

//Get random color form color array
function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function debounce(func, timeout = 500) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export { randomNumFromInterval, randomColor, debounce };
