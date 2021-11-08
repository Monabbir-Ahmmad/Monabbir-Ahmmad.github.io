import { randomNumFromInterval, randomColor } from "../utility.js";

const canvas = document.querySelector("canvas");
const inputParticleNum = document.getElementById("particleNum");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");
ctx.fillStyle = "rgba(0,0,0,0.2)";
ctx.fillRect(0, 0, innerWidth, innerWidth);

//Particle attributes
const particleArray = [];
let particleNumber = inputParticleNum.value;
const colorArray = [
  "rgba(200,100,100)",
  "rgba(100,200,100)",
  "rgba(100,100,200)",
  "rgba(200,200,100)",
  "rgba(200,100,200)",
  "rgba(100,200,200)",
  "rgba(250,250,250)",
];

//Gravity point attributes
const gravityPointArray = [];

//When window is resized reset canvas
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

//When particle number changes
inputParticleNum.addEventListener("input", () => {
  particleNumber = inputParticleNum.value;
  init();
});

//When mouse is clicked within canvas
canvas.addEventListener("click", (event) => {
  addGravityPoint(event.x, event.y);
});

//Particle class
class Particle {
  constructor() {
    this.radius = randomNumFromInterval(3, 3);

    this.pos = {
      x: randomNumFromInterval(this.radius, innerWidth - this.radius),
      y: randomNumFromInterval(this.radius, innerHeight - this.radius),
    };

    this.vel = {
      x: randomNumFromInterval(-1, 1),
      y: randomNumFromInterval(-1, 1),
    };

    this.acc = {
      x: 0,
      y: 0,
    };

    this.color = randomColor(colorArray);
  }

  //Draw the particle
  draw() {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  //Update particle data
  update() {
    this.draw();
    this.attract();

    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  //Attraction to gravity point
  attract() {
    this.acc.x = 0;
    this.acc.y = 0;
    gravityPointArray.forEach((point) => {
      let dx = point.pos.x - this.pos.x;
      let dy = point.pos.y - this.pos.y;
      let d = Math.hypot(dx, dy);
      if (d > point.radius) {
        let force = (30 * this.radius * point.radius) / (d * d);
        let forceX = force * (dx / d);
        let forceY = force * (dy / d);
        this.acc.x += forceX;
        this.acc.y += forceY;
      }
    });
  }
}

//Gravity point class
class GravityPoint {
  constructor(x, y) {
    this.radius = randomNumFromInterval(20, 40);

    this.pos = {
      x: x,
      y: y,
    };

    this.vel = {
      x: 0,
      y: 0,
    };

    this.color = randomColor(colorArray);
  }

  //Draw the gravity point
  draw() {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
    let gradient = ctx.createRadialGradient(
      this.pos.x,
      this.pos.y,
      randomNumFromInterval(this.radius * 0.6, this.radius * 0.8),
      this.pos.x,
      this.pos.y,
      this.radius * 1.2
    );
    gradient.addColorStop(0, "black");
    gradient.addColorStop(1, "white");
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  //Update gravity point data
  update() {
    this.draw();
    this.attract();

    if (this.pos.x - this.radius <= 0) {
      this.pos.x = this.radius;
    } else if (this.pos.x + this.radius >= innerWidth) {
      this.pos.x = innerWidth - this.radius;
    }

    if (this.pos.y - this.radius <= 0) {
      this.pos.y = this.radius;
    } else if (this.pos.y + this.radius >= innerHeight) {
      this.pos.y = innerHeight - this.radius;
    }

    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  //Attraction between gravity points
  attract() {
    this.vel.x = 0;
    this.vel.y = 0;
    gravityPointArray.forEach((point, index) => {
      if (this != point) {
        let dx = point.pos.x - this.pos.x;
        let dy = point.pos.y - this.pos.y;
        let d = Math.hypot(dx, dy);
        if (d >= this.radius) {
          let force = (30 * this.radius * point.radius) / (d * d);
          let forceX = force * (dx / d);
          let forceY = force * (dy / d);
          this.vel.x += forceX;
          this.vel.y += forceY;
        }
        //When collided merge points
        else {
          this.radius += point.radius * 0.5;
          gravityPointArray.splice(index, 1);
        }
      }
    });
  }
}

//Add particle into particle array
function addGravityPoint(x, y) {
  gravityPointArray.push(new GravityPoint(x, y));
}

//Animate the canvas
function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0, 0, innerWidth, innerWidth);

  for (let i = 0; i < gravityPointArray.length; i++) {
    if (gravityPointArray[i].radius < 150) {
      gravityPointArray[i].update();
    } else {
      gravityPointArray.splice(i, 1);
    }
  }

  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].update();
  }
  requestAnimationFrame(animate);
}

function init() {
  //Create particle array
  particleArray.length = 0;
  for (let i = 0; i < particleNumber; i++) {
    particleArray.push(new Particle());
  }
}
//Start the animation
init();
requestAnimationFrame(animate);
