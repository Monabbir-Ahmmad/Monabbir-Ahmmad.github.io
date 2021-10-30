const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

//Particle attributes
const particleArray = [];
const particleNumber = 100;
const particleRadius = 5;

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
    addParticle(mouse.x, mouse.y, particleRadius);
  }
});

//Generate random int within range with min and max included
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//Particle class
class Particle {
  constructor(x, y, radius, dx, dy, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
  }

  //Draw the particle
  draw() {
    let opacity = 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = this.color;
    let distance = (mouse.x - this.x) ** 2 + (mouse.y - this.y) ** 2;
    if (distance < canvas.width * canvas.height) {
      opacity = 1 - distance / 20000;
      ctx.strokeStyle = "rgba(100,100,100," + opacity + ")";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();
    }
  }

  //Update particle data
  update() {
    if (this.x + this.radius >= innerWidth || this.x - this.radius <= 0) {
      this.dx = -this.dx;
    }

    if (this.y + this.radius >= innerHeight || this.y - this.radius <= 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }
}

function init() {
  //Create particle array
  particleArray.length = 0;
  for (let i = 0; i < particleNumber; i++) {
    let x = randomIntFromInterval(particleRadius, innerWidth - particleRadius);
    let y = randomIntFromInterval(particleRadius, innerHeight - particleRadius);
    addParticle(x, y, particleRadius);
  }
}

//Add particle into particle array
function addParticle(x, y, radius) {
  let velocity = 5;
  let color = "rgba(100,100,100)";
  let dx = randomIntFromInterval(-velocity, velocity);
  let dy = randomIntFromInterval(-velocity, velocity);
  particleArray.push(new Particle(x, y, radius, dx, dy, color));
}

//Draw line between particles
function particleConnect() {
  let opacity = 1;
  for (let i = 0; i < particleArray.length; i++) {
    for (let j = i; j < particleArray.length; j++) {
      let distance =
        (particleArray[i].x - particleArray[j].x) ** 2 +
        (particleArray[i].y - particleArray[j].y) ** 2;
      if (distance < (canvas.width * canvas.height) / 100) {
        opacity = 1 - distance / 20000;
        ctx.strokeStyle = "rgba(100,100,100," + opacity + ")";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(particleArray[i].x, particleArray[i].y);
        ctx.lineTo(particleArray[j].x, particleArray[j].y);
        ctx.stroke();
      }
    }
  }
}

//Animate the canvas
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerWidth);
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].update();
  }

  particleConnect();
}

//Start the animation
init();
animate();
