const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');



class Circle {
    constructor(x, y, dx, dy, radius) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.minRadius = radius;
        this.maxRadius = radius + 50;
        this.radius = radius;
        
        let fillr = Math.floor(Math.random() * 256);
        let fillg = Math.floor(Math.random() * 256);
        let fillb = Math.floor(Math.random() * 256);

        this.fillColor = `rgba(${fillr}, ${fillg}, ${fillb}, 1)`;
    }


    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.fillColor;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
    }

    animate(ctx) {
        this.draw(ctx);
        this.update(ctx);
    }

}



const circles = [];
const MOUSE_POSITION = {
    x: Infinity, y: Infinity
}

for(let i = 0; i < 500; i++) {

    let radius = 5 + Math.random() * 5;
    let x = Math.random() * canvas.width;
    x = Math.max(radius, x);
    x = Math.min(canvas.width - radius, x);

    let y = Math.random() * canvas.height;
    y = Math.max(radius, y);
    y = Math.min(canvas.height - radius, y);
    let dx = 1 * Math.random() < 0.5 ? -1 : 1 ;
    let dy = 1 * Math.random() < 0.5 ? -1 : 1 ;

    let circle = new Circle(x, y, dx, dy, radius);
    circles.push(circle);
}



function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(let c of circles) {
        if((c.x + c.radius) >= canvas.width || (c.x - c.radius) <= 0) {
            c.dx = -c.dx;
        }
        
        if((c.y + c.radius) >= canvas.height|| (c.y - c.radius) <= 0) {
            c.dy = -c.dy;
        }

        if(Math.abs(c.x - MOUSE_POSITION.x) < 100 && Math.abs(c.y - MOUSE_POSITION.y) < 100) {
            if(c.radius < c.maxRadius) {
                c.radius += 1;
            }
        } else if(c.radius > c.minRadius) {
            c.radius -= 1;
        }

        c.animate(ctx);
    }


    requestAnimationFrame(animate);
}

animate();



canvas.addEventListener("mousemove", (ev) => {
    MOUSE_POSITION.x = ev.x;
    MOUSE_POSITION.y = ev.y;
})


canvas.addEventListener("click", (ev) => {
    let dx = 1 * Math.random() < 0.5 ? -1 : 1 ;
    let dy = 1 * Math.random() < 0.5 ? -1 : 1 ;
    let radius = 5 + Math.random() * 5;
    circles.push(new Circle(MOUSE_POSITION.x, MOUSE_POSITION.y, dx, dy, radius));
})

canvas.addEventListener("mouseleave", ev => {
    MOUSE_POSITION.x = Infinity;
    MOUSE_POSITION.y = Infinity;
})