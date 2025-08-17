const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const ctx = canvas.getContext("2d");


const PROJECTILE_SPEED = 5;
const PROJECTILE_SIZE = 2;
const PROJECTILE_COLOR = "yellow";
const STEP = 10;
const HIT_DELAY = 300;

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}


class Projectile {
    constructor(x, y, radius, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
    } 

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();

    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
}


class ProjectileFactory {
    static createbaseProjectile(player, pos) {
        const dx = pos.x -  player.x;
        const dy = pos.y - player.y;

        const dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        const unitDx = dx / dist;
        const unitDy = dy / dist;


        let vx = unitDx * PROJECTILE_SPEED;
        let vy = unitDy * PROJECTILE_SPEED;
        return new Projectile(player.x, player.y, PROJECTILE_SIZE, vx, vy, PROJECTILE_COLOR);
    }
}



const player = new Player(canvas.width / 2, canvas.height / 2, 20, "blue");

const projectiles = [];


function sceneCreator() {
    const xDirs = [];
    const yDirs = [];
    for(let i = 0; i < 200; i++) {
        xDirs.push(Math.round(Math.random()* canvas.width) );
        yDirs.push(Math.round(Math.random() * canvas.height));
    }

    return function() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        function drawStars() {
           for(let i = 0; i < xDirs.length; i++) {
            ctx.beginPath();
            ctx.arc(xDirs[i], yDirs[i], 1, 0, 2 * Math.PI, false);
            ctx.fillStyle = "white";
            ctx.fill();
           }
     
        }
        drawStars();
    }
}

const createScene = sceneCreator();

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    createScene();

    // Draw All Projectiles
    projectiles.forEach(projectile => {
        projectile.draw(ctx);
        projectile.update();
    })

    // Draw Player
    player.draw(ctx);

}


const MOUSE_POSITION = {
    x: Infinity,
    y: Infinity
}


// Either Pressed or Released
let MOUSE_STATE = "released";
let projectileCreationsId;

// Delay of 1 second On Hit

function throttle(fn, delay) {
    let isRunning = false;
    return function(...args) {
        if(isRunning) return;
        isRunning = true;
        const context=  this;
        fn.call(context, ...args);
        setTimeout(() =>{

            isRunning = false;
        }, delay);

    }
}



function attack(player, pos) {
    projectiles.push(ProjectileFactory.createbaseProjectile(player, pos));
}

const throttledAttack = throttle(attack, HIT_DELAY);


canvas.addEventListener("mousemove", (e) => {
    MOUSE_POSITION.x = e.x;
    MOUSE_POSITION.y = e.y;
    

    if(MOUSE_STATE === "pressed") {
      throttledAttack(player, MOUSE_POSITION);
    }
});


canvas.addEventListener("mousedown", e => {
    attack(player, MOUSE_POSITION);
    MOUSE_STATE = "pressed";
})


canvas.addEventListener("mouseup", () => {
   MOUSE_STATE = "released";
})


const keyPressed = {
    w: false,
    a: false,
    s: false,
    d: false
}

window.addEventListener("keydown", e => {


    // Arrow Key Pressed
    if(e.key !== "w" && e.key !== "s" && e.key !== "a" && e.key !== "d") return;
    keyPressed[e.key] = true;

    function handleMovement() {
        for(let key of Object.keys(keyPressed)) {
            if(keyPressed[key] ===false) continue;
            if(key === "w") player.y -= STEP;
            if(key === "a") player.x -= STEP;
            if(key === "s") player.y += STEP;
            if(key === "d") player.x += STEP;
        }
    }


    handleMovement();

    if(player.x <=player.radius) player.x = player.radius;
    if(player.x + player.radius >= canvas.width) player.x = canvas.width - player.radius;
    if(player.y <= player.radius) player.y = player.radius;
    if(player.y + player.radius >= canvas.height) player.y = canvas.height - player.radius;

});

window.addEventListener("keyup", e => {
    if(e.key !== "w" && e.key !== "s" && e.key !== "a" && e.key !== "d") return;
    keyPressed[e.key] = false;
})


animate();