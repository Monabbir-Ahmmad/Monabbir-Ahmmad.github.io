const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const cellsHorizontal = 1 + Math.floor(Math.random() * 10); // Number of cells horizontally
const cellsVertical = 1 + Math.floor(Math.random() * 5); // Number of cells vertically
const width = window.innerWidth;
const height = window.innerHeight;

const unitLengthX = width / cellsHorizontal; // Single all length horizontally
const unitLengthY = height / cellsVertical; // Single all length vertically

const wallColor = "hsl(0,50%,50%)"; // Wall color
const ballColor = "hsl(220,50%,50%)"; // Ball color
const goalColor = "hsl(120,50%,40%)"; // Goal color

// Engin initialization
const engine = Engine.create();
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    width,
    height,
  },
});
Render.run(render);
Runner.run(Runner.create(), engine);

// Outer walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 5, {
    isStatic: true,
    render: {
      fillStyle: wallColor,
    },
  }),
  Bodies.rectangle(width / 2, height, width, 5, {
    isStatic: true,
    render: {
      fillStyle: wallColor,
    },
  }),
  Bodies.rectangle(0, height / 2, 5, height, {
    isStatic: true,
    render: {
      fillStyle: wallColor,
    },
  }),
  Bodies.rectangle(width, height / 2, 5, height, {
    isStatic: true,
    render: {
      fillStyle: wallColor,
    },
  }),
];
World.add(world, walls);

// Shuffle the neighbors for next cell selection
const shuffle = (arr) => {
  let counter = arr.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);

    counter--;

    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }

  return arr;
};

const grid = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

const verticals = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal - 1).fill(false));

const horizontals = Array(cellsVertical - 1)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

//Generate maze
const stepThroughCell = (row, column) => {
  // If the cell at [row, column] has been visited, then return
  if (grid[row][column]) {
    return;
  }

  // Mark this cell as being visited
  grid[row][column] = true;

  // Assemble randomly-ordered list of neighbors
  const neighbors = shuffle([
    [row - 1, column, "up"],
    [row, column + 1, "right"],
    [row + 1, column, "down"],
    [row, column - 1, "left"],
  ]);

  // For each neighbor....
  for (let neighbor of neighbors) {
    const [nextRow, nextColumn, direction] = neighbor;

    // See if that neighbor is out of bounds
    if (
      nextRow < 0 ||
      nextRow >= cellsVertical ||
      nextColumn < 0 ||
      nextColumn >= cellsHorizontal
    ) {
      continue;
    }

    // If that neighbor at at [row, column] has been visited, continue to next neighbor
    if (grid[nextRow][nextColumn]) {
      continue;
    }

    // Remove a wall from either horizontals or verticals
    if (direction === "left") {
      verticals[row][column - 1] = true;
    } else if (direction === "right") {
      verticals[row][column] = true;
    } else if (direction === "up") {
      horizontals[row - 1][column] = true;
    } else if (direction === "down") {
      horizontals[row][column] = true;
    }

    stepThroughCell(nextRow, nextColumn);
  }
};

stepThroughCell(startRow, startColumn);

// Generate the horizontal inner walls
horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX / 2,
      rowIndex * unitLengthY + unitLengthY,
      unitLengthX,
      5,
      {
        label: "wall",
        isStatic: true,
        render: {
          fillStyle: wallColor,
        },
      }
    );
    World.add(world, wall);
  });
});

// Generate the vertical inner walls
verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX,
      rowIndex * unitLengthY + unitLengthY / 2,
      5,
      unitLengthY,
      {
        label: "wall",
        isStatic: true,
        render: {
          fillStyle: wallColor,
        },
      }
    );
    World.add(world, wall);
  });
});

// Goal or destination
const goal = Bodies.rectangle(
  width - unitLengthX / 2,
  height - unitLengthY / 2,
  Math.min(unitLengthX, unitLengthY) * 0.7,
  Math.min(unitLengthX, unitLengthY) * 0.7,
  {
    label: "goal",
    isStatic: true,
    render: {
      fillStyle: goalColor,
    },
  }
);
World.add(world, goal);

// Ball or player
const ball = Bodies.circle(
  unitLengthX / 2,
  unitLengthY / 2,
  Math.min(unitLengthX, unitLengthY) / 4,
  {
    label: "ball",
    render: {
      fillStyle: ballColor,
    },
  }
);
World.add(world, ball);

// Ball movement on keydown
document.addEventListener("keydown", (event) => {
  const { x, y } = ball.velocity;

  if (event.key === "w" || event.key === "W") {
    Body.setVelocity(ball, { x, y: -5 });
  }

  if (event.key === "d" || event.key === "D") {
    Body.setVelocity(ball, { x: 5, y });
  }

  if (event.key === "s" || event.key === "S") {
    Body.setVelocity(ball, { x, y: 5 });
  }

  if (event.key === "a" || event.key === "A") {
    Body.setVelocity(ball, { x: -5, y });
  }
});

// Win the game
Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    const labels = ["ball", "goal"];

    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      document.querySelector(".winner").classList.remove("hidden");
      world.bodies.forEach((body) => {
        if (body.label === "wall" || body.label === "goal") {
          Body.setStatic(body, false);
          World.remove(world, goal);
        }
      });
    }
  });
});
