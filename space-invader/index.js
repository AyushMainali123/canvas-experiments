const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const ctx = canvas.getContext("2d");


const PROJECTILE_SPEED = 10;
const PROJECTILE_SIZE = 2;
const PROJECTILE_COLOR = "yellow";
const STEP = 20;
const HIT_DELAY = 300;
const ENEMY_SPAWN_RATE = 1000;
const DAMAGE_PER_PROJECTILE = 20;

const SPRITES= {
    player: "./player.png",
    enemy: "./enemy.png"
}

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw(ctx) {
        const spriteSize = this.radius * 2; 
        const sprite = ImageCreator.createImage(SPRITES.player, spriteSize, spriteSize);
        ctx.drawImage(sprite, this.x - this.radius, this.y - this.radius, spriteSize, spriteSize);
    }
}


class Projectile {
    constructor(x, y, radius, vx, vy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
    } 

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fill();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
}


class ImageCreator {
    static createImage(src) {
        const img = new Image();
        img.src = src;
        return img;
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


class Enemy {
    constructor(x, y, radius, vx, vy, sprite) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.sprite = sprite;
    }


    draw(ctx) {
        ctx.drawImage(this.sprite, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
    

    update(towards) {
        const dx = towards.x - this.x;
        const dy = towards.y - this.y;

        const dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        const unitDx = dx / dist;
        const unitDy = dy / dist;

        this.x += unitDx * this.vx;
        this.y += unitDy * this.vy;
    }
}


class EnemyFactory {
    static createStartPosition() {
            const xSpawnDir = Math.random() < 0.5 ? -1 : 1;
            const ySpawnDir = Math.random() < 0.5 ? -1 : 1;
            const xPos = (canvas.width + Math.random() * canvas.width) * xSpawnDir;
            const yPos = (canvas.height + Math.random() * canvas.height) * ySpawnDir;

            return {xPos, yPos};
    }
    static createBaseEnemy() {
        const {xPos, yPos} = EnemyFactory.createStartPosition();
        const sprite = ImageCreator.createImage(SPRITES.enemy);
        return new Enemy(xPos, yPos, 40, 0.5, 0.5, sprite);
    }

    static createFastEnemy() {
        const {xPos, yPos} = EnemyFactory.createStartPosition();
        const sprite = ImageCreator.createImage(SPRITES.enemy);
        return new Enemy(xPos, yPos, 20, 1, 1, sprite);
    }

    static createGiantEnemy() {
        const {xPos, yPos} = EnemyFactory.createStartPosition();
        const sprite = ImageCreator.createImage(SPRITES.enemy);
        return new Enemy(xPos, yPos, 80, 0.4, 0.4, sprite);
    }
}


const player = new Player(canvas.width / 2, canvas.height / 2, 20, "blue");

const projectiles = new Set();
const enemies = [];


function sceneCreator() {
    const xDirs = [];
    const yDirs = [];
    for(let i = 0; i < 200; i++) {
        xDirs.push(Math.round(Math.random()* canvas.width) );
        yDirs.push(Math.round(Math.random() * canvas.height));
    }

    return function() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
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
let animationId;
function animate() {
    animationId = requestAnimationFrame(animate);
    createScene();

    // Draw All Projectiles
    for(let projectile of projectiles) {
        if(projectile.x + projectile.radius >= canvas.width || projectile.x <= projectile.radius) {
            projectiles.delete(projectile);
            continue;
        }

        if(projectile.y + projectile.radius >= canvas.height || projectile.y <= projectile.radius) {
            projectiles.delete(projectile);
            continue;
        }

        projectile.draw(ctx);
        projectile.update();
    }

    for(let enemy of enemies) {
        enemy.draw(ctx);
        enemy.update(player);
    }


    // Check for Projectile and enemy collision
    for (let projectile of projectiles) {
        for (let enemy of enemies) {
            const dx = projectile.x - enemy.x;
            const dy = projectile.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < projectile.radius + enemy.radius) {

                if(enemy.radius > DAMAGE_PER_PROJECTILE) {
                    enemy.radius -= DAMAGE_PER_PROJECTILE;
                } else {
                    enemies.splice(enemies.indexOf(enemy), 1);
                }
                projectiles.delete(projectile);
            }
        }
    }

    // Check for Player and enemy collision
    for (let enemy of enemies) {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < player.radius + enemy.radius) {
            // Handle player damage or death
            cancelAnimationFrame(animationId);
        }
    }

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
    projectiles.add(ProjectileFactory.createbaseProjectile(player, pos));
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


function spawnEnemies() {
    
    setInterval(() => {
        const enemyTypes = [
            EnemyFactory.createBaseEnemy(),
            EnemyFactory.createFastEnemy(),
            EnemyFactory.createGiantEnemy()
        ];
        const randomIndex = Math.floor(Math.random() * enemyTypes.length);
        enemies.push(enemyTypes[randomIndex]);
    }, ENEMY_SPAWN_RATE);
}


spawnEnemies();
animate();