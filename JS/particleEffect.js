import { ParticleEntity } from "./ParticleEntity.js";
import { debounce, randomNumFromInterval } from "./utility.js";

const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext("2d");

//Particle attributes
const particleArray = new Array();
const particleNumber = 100;
const particleRadius = 5;
const particleVelocity = 2;
const particleColor = "rgba(200,200,200)";

//Mouse position
const mousePosition = {
  x: undefined,
  y: undefined,
};

//When window is resized reset canvas
window.addEventListener(
  "resize",
  debounce(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
  }, 500)
);

//Update mouse position on mouse move
window.addEventListener("mousemove", (event) => {
  mousePosition.x = event.x;
  mousePosition.y = event.y;
});

//Clear mouse position on mouse out of window
window.addEventListener("mouseout", () => {
  mousePosition.x = undefined;
  mousePosition.y = undefined;
});

//Add particles and shift particle array on mouse click
window.addEventListener("click", () => {
  for (let i = 0; i < 5; i++) {
    const position = {
      x: mousePosition.x,
      y: mousePosition.y,
    };

    particleArray.shift();

    addParticle(position, getRandomVelocity(), particleRadius, particleColor);
  }
});

const getRandomPosition = () => {
  return {
    x: randomNumFromInterval(particleRadius, canvas.width - particleRadius),
    y: randomNumFromInterval(particleRadius, canvas.height - particleRadius),
  };
};

const getRandomVelocity = () => {
  return {
    dx: randomNumFromInterval(-particleVelocity, particleVelocity) || 1,
    dy: randomNumFromInterval(-particleVelocity, particleVelocity) || 1,
  };
};

//Add particle into particle array
const addParticle = (position, velocity, radius, color) => {
  particleArray.push(
    new ParticleEntity(
      canvas,
      context,
      position,
      radius,
      velocity,
      color,
      mousePosition,
      particleArray
    )
  );
};

const init = () => {
  //Create particle array
  particleArray.length = 0;
  for (let i = 0; i < particleNumber; i++) {
    addParticle(
      getRandomPosition(),
      getRandomVelocity(),
      particleRadius,
      particleColor
    );
  }
};

//Animate the canvas
const animate = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  particleArray.forEach((particle) => particle.update());
  requestAnimationFrame(animate);
};

//Start the animation
init();
animate();
