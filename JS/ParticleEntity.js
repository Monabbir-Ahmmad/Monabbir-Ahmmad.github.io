export class ParticleEntity {
  constructor(
    canvas,
    context,
    position,
    radius,
    velocity,
    color,
    mousePosition,
    particleArray
  ) {
    this.canvas = canvas;
    this.context = context;
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.color = color;
    this.mouse = mousePosition;
    this.particleArray = particleArray;
  }

  //Update particle data
  update() {
    this.render();
    this.changeVelocityOnCollision();
    this.drawLineToOtherParticles();
  }

  //Draw the particle
  render() {
    this.drawParticle();
    this.drawLineToParticleFromMouse();
  }

  drawParticle() {
    this.context.beginPath();
    this.context.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2,
      false
    );
    this.context.fillStyle = this.color;
    this.context.fill();
  }

  drawLineToParticleFromMouse() {
    let lineOpacity = 1;
    let distanceFromMouse = this.getDistance(this.mouse, this.position);

    if (distanceFromMouse < (this.canvas.width * this.canvas.height) / 100) {
      lineOpacity = 1 - distanceFromMouse / 20000;

      this.context.strokeStyle = "rgba(200,200,200," + lineOpacity + ")";
      this.context.lineWidth = 2;
      this.context.beginPath();
      this.context.moveTo(this.mouse.x, this.mouse.y);
      this.context.lineTo(this.position.x, this.position.y);
      this.context.stroke();
    }
    this.context.closePath();
  }

  drawLineToOtherParticles() {
    this.particleArray.forEach((particle) => {
      if (particle !== this) {
        let opacity = 1;
        let distance = this.getDistance(this.position, particle.position);
        if (distance < (this.canvas.width * this.canvas.height) / 100) {
          opacity = 1 - distance / 20000;
          this.context.strokeStyle = "rgba(200,200,200," + opacity + ")";
          this.context.lineWidth = 2;
          this.context.beginPath();
          this.context.moveTo(this.position.x, this.position.y);
          this.context.lineTo(particle.position.x, particle.position.y);
          this.context.stroke();
          this.context.closePath();
        }
      }
    });
  }

  changeVelocityOnCollision() {
    if (
      this.position.x + this.radius >= this.canvas.width ||
      this.position.x - this.radius <= 0
    ) {
      this.velocity.dx = -this.velocity.dx;
    }

    if (
      this.position.y + this.radius >= this.canvas.height ||
      this.position.y - this.radius <= 0
    ) {
      this.velocity.dy = -this.velocity.dy;
    }

    this.position.x += this.velocity.dx;
    this.position.y += this.velocity.dy;
  }

  getDistance(from, to) {
    return (from.x - to.x) ** 2 + (from.y - to.y) ** 2;
  }
}
