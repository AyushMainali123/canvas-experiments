const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");


class Circle {
    
    constructor(x, y, radius, dx, dy, fillColor="rgba(255, 0, 0, 0.4)") {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.fillColor = fillColor;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.fillColor;
        ctx.fill();
    }


    update(xbound, ybound, circles) {
        this.x += this.dx;
        this.y += this.dy;

        const [startx, endx] = xbound;
        const [starty, endy] = ybound;

        if((this.x + this.radius) >= endx || (this.x - this.radius) <= startx) {
            if((this.x + this.radius) >= endx) {
                this.x = endx - this.radius;
            }

            if((this.x - this.radius) <= startx) {
                this.x = startx + this.radius;
            }

            this.changeDirectionX();
        }


        if((this.y + this.radius) >= endy || (this.y - this.radius) <= starty) {
            if((this.y + this.radius) >= endy) {
                this.y = endy - this.radius;
            }

            if((this.y - this.radius) <= starty) {
                this.y = this.radius + starty;
            }
 
            this.changeDirectionY();
        }

        for (let other of circles) {
            if (other === this) continue;
        
            let dx = other.x - this.x;
            let dy = other.y - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            let minDist = this.radius + other.radius;
        
            if (dist < minDist) {
                // 1. Normalize direction
                let nx = dx / dist;
                let ny = dy / dist;
        
                // 2. Push them apart
                let overlap = minDist - dist;
                this.x -= nx * overlap / 2;
                this.y -= ny * overlap / 2;
                other.x += nx * overlap / 2;
                other.y += ny * overlap / 2;
        
                // // 3. Swap velocity components along n (basic elastic collision)
                let p = (this.dx - other.dx) * nx + (this.dy - other.dy) * ny;
        
                this.dx -= p * nx;
                this.dy -= p * ny;
                other.dx += p * nx;
                other.dy += p * ny;
            }
        }
    }

    changeDirectionX() {
        this.dx = -this.dx;
    }

    changeDirectionY() {
        this.dy = -this.dy;
    }
}


const circles = [];
const positions = [];



function hasCollision(x, y, radius, circles) {
    for(let circle of circles) {
        let dx = Math.pow(x - circle.x, 2);
        let dy = Math.pow(y - circle.y, 2);

        let dist = Math.sqrt(dx + dy);
        let minRadii = radius + circle.radius;

        if(minRadii >= dist) return true; 
    }

    return false;
}

function randomWithinRange(min, max) {
    let ans = Math.round(Math.random() * max);
    ans = Math.max(min, ans);

    return ans;
}


for(let i = 0; i < 120; i++) {

    let radius;
    let x;
    let y;

    do {
        radius =  20;
        x = randomWithinRange(radius, canvas.width - radius);
        y = randomWithinRange(radius, canvas.height - radius);
    } while(hasCollision(x, y, radius, circles) === true);
    
    
    const dx = Math.ceil(Math.random() * 3);
    const dy = Math.ceil(Math.random() * 3);

    const rfill = Math.round(Math.random() * 255);
    const gfill = Math.round(Math.random() * 255);
    const bfill = Math.round(Math.random() * 255);

    const fillColor = `rgba(${rfill}, ${gfill}, ${bfill}, 1)`;

    circles.push(new Circle(x, y, radius, dx, dy, fillColor));
}


function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(let circle of circles) {
        circle.update([0, canvas.width], [0, canvas.height], circles);
        circle.draw(ctx);
    }
}


animate();