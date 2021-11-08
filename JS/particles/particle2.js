import { randomNumFromInterval, randomColor } from "../utility.js";

const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

//Particle attributes
const particleArray = [];
const particleNumber = 300;
let particleRadius = randomNumFromInterval(5, 10);
const particleVelocity = 3;
const particleColorArray = [
  "rgba(200,100,100)",
  "rgba(100,200,100)",
  "rgba(100,100,200)",
  "rgba(200,200,100)",
  "rgba(200,100,200)",
  "rgba(100,200,200)",
  "rgba(50,50,50)",
];

//Mouse position
const mouse = {
  x: undefined,
  y: undefined,
};

//When window is resized reset canvas
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

//Update mouse position on mouse move
window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

//Clear mouse position on mouse out of window
window.addEventListener("mouseout", () => {
  mouse.x = undefined;
  mouse.y = undefined;
});

//Add particles and shift particle array on mouse click
window.addEventListener("click", () => {
  for (let i = 0; i < 6; i++) {
    particleArray.shift();
    particleRadius = randomNumFromInterval(5, 10);
    addParticle(mouse.x, mouse.y, particleRadius);
  }
});

//Particle class
class Particle {
  constructor(x, y, radius, dx, dy, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.minRadius = radius;
    this.maxRadius = radius * 10;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
  }

  //Draw the particle
  draw() {
    let distance = (mouse.x - this.x) ** 2 + (mouse.y - this.y) ** 2;
    if (
      distance < (canvas.width * canvas.height) / 300 &&
      this.radius <= this.maxRadius
    ) {
      this.radius++;
    } else if (this.radius >= this.minRadius) {
      this.radius--;
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.closePath();
  }

  //Update particle data
  update() {
    this.draw();

    if (this.x + this.radius >= innerWidth || this.x - this.radius <= 0) {
      this.dx = -this.dx;
    }

    if (this.y + this.radius >= innerHeight || this.y - this.radius <= 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;
  }
}

function init() {
  //Create particle array
  particleArray.length = 0;
  for (let i = 0; i < particleNumber; i++) {
    particleRadius = randomNumFromInterval(5, 10);
    let x = randomNumFromInterval(particleRadius, innerWidth - particleRadius);
    let y = randomNumFromInterval(particleRadius, innerHeight - particleRadius);
    addParticle(x, y, particleRadius);
  }
}

//Add particle into particle array
function addParticle(x, y, radius) {
  let dx = randomNumFromInterval(-particleVelocity, particleVelocity);
  let dy = randomNumFromInterval(-particleVelocity, particleVelocity);
  dx = dx == 0 ? 1 : dx;
  dy = dy == 0 ? 1 : dy;
  particleArray.push(
    new Particle(x, y, radius, dx, dy, randomColor(particleColorArray))
  );
}

//Animate the canvas
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerWidth);
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].update();
  }
}

//Start the animation
init();
animate();
