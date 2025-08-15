const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");


function degreeToRadian(deg) {
    return Math.PI * deg / 180;
}


const AMPLITUDE = 200;
const FREQUENCY = 0.2;
let increment = 0;


function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0, 0, 0, 0.01)"; 
    ctx.fillRect(0 ,0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);

    for(let i = 0; i < canvas.width; i++) {
        let height = canvas.height / 2;
        ctx.lineTo(i, height +  AMPLITUDE * Math.sin(degreeToRadian(increment)) *  Math.sin(degreeToRadian(i * FREQUENCY + increment)));
    }

    increment += FREQUENCY;
    ctx.strokeStyle = `hsl(0, ${Math.min(Math.abs(Math.sin(degreeToRadian(increment / 2)) * 100), 100)}%, 50%)`;
    ctx.stroke();
}

animate();