const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

class Circle {
    constructor(x, y, radius, degree) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.degree = degree;
    }
    
    update(radius) {
        this.radius = radius || this.radius;
        this.degree += 1;
    }

    toRadian() {
        return Math.PI * this.degree / 180;
    }

    draw(ctx, x, y) {
        ctx.beginPath();
        ctx.arc(x +this.radius * Math.cos(this.toRadian()), y + this.radius* Math.sin(this.toRadian()), 10, 0, Math.PI * 2, false);
        ctx.fillStyle = "rgba(255, 0, 0, 0.2)"; 
        ctx.fill();
    }
}

const MOUSE_POSITION = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

const points = [];

const ORIGINAL_RADIUS = 30;
let lastDegree = 0;
let radius = 30;

for(let i = 0; i < 10; i++) {   
    const degree = lastDegree;
    lastDegree += 36;
    points.push(new Circle(MOUSE_POSITION.x, MOUSE_POSITION.y, radius, degree))
}



function animate() {
    requestAnimationFrame(animate);

    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for(let point of points) {
        point.update(radius);
        point.draw(ctx, MOUSE_POSITION.x, MOUSE_POSITION.y);
    }
}

canvas.addEventListener("mousemove", (e) => {
    MOUSE_POSITION.x = e.x;
    MOUSE_POSITION.y = e.y;
})


let downAnimationId;
let upAnimationId;
canvas.addEventListener("mousedown", (e) => {
    function downAnimator() {
        cancelAnimationFrame(upAnimationId);
        downAnimationId = requestAnimationFrame(downAnimator)
        if(radius < ORIGINAL_RADIUS + 40) radius++;
    }
    downAnimator();
})

canvas.addEventListener("mouseup", (e) => {
    cancelAnimationFrame(downAnimationId);
    function upAnimator() {
        upAnimationId = requestAnimationFrame(upAnimator);
        if(radius > ORIGINAL_RADIUS) radius--;  
    }

    upAnimator();
})

animate();