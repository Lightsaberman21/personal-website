const canvas = document.getElementById("pongCanvas")
const ctx = canvas.getContext("2d")

const p1ScoreDisplay = document.getElementById("player1-score")
const p2ScoreDisplay = document.getElementById("player2-score")

const paddleWidth = 10;
const paddleHeight = 80;
const ballRadius = 8;
const paddleSpeed = 7;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 3;
let ballSpeedY = 3;
let p1Score = 0;
let p2Score = 0;


let p1Y = (canvas.height - paddleHeight) / 2;
let p2Y = (canvas.height - paddleHeight) / 2;

const keysPressed = {}

window.addEventListener("keydown", (e) => { keysPressed[e.key] = true; });
window.addEventListener("keyup", e => { keysPressed[e.key] = false;});

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 4;
}

function update() {
    if (keysPressed["w"] || keysPressed["W"]) p1Y = Math.max(0, p1Y - paddleSpeed);
    if (keysPressed["s"] || keysPressed["S"]) p1Y = Math.min(canvas.height - paddleHeight, p1Y + paddleSpeed);

    if (keysPressed["ArrowUp"]) p2Y = Math.max(0, p2Y - paddleSpeed);
    if (keysPressed["ArrowDown"]) p2Y = Math.min(canvas.height - paddleHeight, p2Y + paddleSpeed);

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY - ballRadius <= 0 || ballY + ballRadius >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    if (ballSpeedX < 0 && ballX - ballRadius <= 30) {
        if (ballY >= p1Y && ballY <= p1Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            ballSpeedX *= 1.05; // Normal speed increase
        }
    }

    if (ballSpeedX > 0 && ballX + ballRadius >= canvas.width - 30) { 
        if (ballY >= p2Y && ballY <= p2Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            ballSpeedX *= 1.05; // Normal speed increase
        }
    }


    if (ballX < 0) {
        p2Score++;
        p2ScoreDisplay.textContent = p2Score;
        resetBall();
    } else if (ballX > canvas.width) {
        p1Score++;
        p1ScoreDisplay.textContent = p1Score; // FIXED
        resetBall();
    }
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height)
    ctx.stroke();
    ctx.setLineDash([])

    ctx.fillStyle = "#fff"
    ctx.fillRect(20, p1Y, paddleWidth, paddleHeight)

    ctx.fillRect(canvas.width - 20 - paddleWidth, p2Y, paddleWidth, paddleHeight)

    ctx.beginPath()
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2)
    ctx.fillStyle = "#fff"
    ctx.fill()
    ctx.closePath()
}

function gameLoop() {
    update()
    draw()
    requestAnimationFrame(gameLoop)
}

gameLoop()