const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

let score = 0;
let gameOver = false;
let gameStarted = false;

const bird = {
    x: 50,
    y: 300,
    width: 34,
    height: 24,
    gravity: 0.25,
    velocity: 0,
    jump: -5.5
};

const pipes = []
const pipeWidth = 60;
const pipeGap = 150;
const pipeSpeed = 2.5;
let pipeSpawnTimer = 0;

document.addEventListener("keydown", function(e) {
    if (e.code === "Space") {
        handleJump()
    }
});

canvas.addEventListener("touchstart", function() {
    handleJump()
});

function handleJump() {
    if (gameOver) {
        resetGame();
        return;
    }
    if (!gameStarted) {
        gameStarted = true;
    }
    bird.velocity = bird.jump;
}

function resetGame() {
    bird.y = 300;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    gameOver = false;
    gameStarted = false;
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameStarted && !gameOver) {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
            gameOver = true;
        }

        pipeSpawnTimer++
        if (pipeSpawnTimer % 100 === 0) {
            const topPipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
            pipes.push({
                x: canvas.width,
                topHeight: topPipeHeight,
                passed: false
            });
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].x -= pipeSpeed;

            const inXBounds = bird.x + bird.width > pipes[i].x && bird.x < pipes[i].x + pipeWidth;
            const HitTopPipe = bird.y < pipes[i].topHeight;
            const hitBottomPipe = bird.y + bird.height > pipes[i].topHeight + pipeGap;

            if (inXBounds && (HitTopPipe || hitBottomPipe)) {
                gameOver = true;
            }

            if (!pipes[i].passed && pipes[i].x + pipeWidth < bird.x) {
                score++;
                pipes[i].passed = true;
            }

            if (pipes[i].x + pipeWidth < 0) {
                pipes.splice(i, 1);
            }
        }
    }

    ctx.fillStyle = "#73bf2e";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        const bottomPipeY = pipe.topHeight + pipeGap;
        ctx.fillRect(pipe.x, bottomPipeY, pipeWidth, canvas.height - bottomPipeY);
    })

    ctx.fillStyle = "#f8e71c";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    ctx.fillStyle = "white";
    ctx.font = "bold 35px Arial"
    ctx.textAlign = "center";
    ctx.fillText(score, canvas.width / 2, 60)

    if (!gameStarted && !gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.fillText("PRESS JUMP TO START", canvas.width / 2, canvas.height/ 2);
    }

    if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "white";
        ctx.font = "30px Arial"
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);
    }

    requestAnimationFrame(update)
}

update()