const canvas = document.querySelector("canvas");
canvas.style.background = "rgba(100, 220, 255, 0.4)";
canvas.style.border = "1px solid red";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');


class Circle {
  constructor(x, y, radius, dx=0, dy=0) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    const rfill = Math.floor(Math.random() * 256);
    const gfill = Math.floor(Math.random() * 256);
    const bfill = Math.floor(Math.random() * 256);
    this.fillColor = `rgba(${rfill}, ${gfill}, ${bfill}, 1)`;
    this.traces = [];
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.fillColor;
    ctx.fill();

    ctx.beginPath();
    for(let [x, y] of this.traces) {
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = this.fillColor;
    ctx.stroke();
  }

  update(gravity, groundFriction, wallFriction, groundHeight, wallPos, airResistance) {
    this.dy += gravity;

    this.dy *= airResistance;
    this.dx *= airResistance;


    this.y += this.dy;
    this.x += this.dx;

    if(this.y + this.radius >= groundHeight) {
      this.y = groundHeight - this.radius;
      this.dy = - this.dy * groundFriction;
      this.dx *= groundFriction;
    }
    
    if(this.x + this.radius >= wallPos) {
      this.x = wallPos - this.radius;
      this.dx = -wallFriction * this.dx;
    }

    if(this.x <= this.radius) {
      this.x = this.radius;
      this.dx = -wallFriction * this.dx;
    }

    this.traces.push([this.x, this.y]);
    if(this.traces.length > 30) {
      this.traces.shift();
    }

  }

}


const circles = [];


for(let i = 0; i < 100; i++) {
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;
  const radius = 20 + Math.ceil(Math.random() * 20);
  const vx = Math.ceil(Math.random() * 20);
  const vy = Math.ceil(Math.random() * 20);
  circles.push(new Circle(x, y, radius, vx, vy));
}


function animate() {
  requestAnimationFrame(animate);

  const gravity = 2;

  // 1 means perfectly elastic surface.
  // 0 means surface which absorbs all energy.
  const groundFriction = 0.7;

  // 1 means perfectly elastic surface.
  // 0 means surface which absorbs all energy.
  const wallFriction = 0.6;

  // 1 means no air resistance.
  // 0 means complete resistance.
  const airResistance = 1;
  ctx.clearRect(0, 0, canvas.width, canvas.height, canvas.width);

  for(let circle of circles) {
    circle.draw(ctx);
    circle.update(gravity, groundFriction, wallFriction, canvas.height, canvas.width, airResistance);
  }

}

animate();

