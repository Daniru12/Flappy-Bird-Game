// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 600;

const startButton = document.getElementById('start-button');
const gameOverPopup = document.getElementById('game-over-popup');
const retryButton = document.getElementById('retry-button');

// Images
const birdImage = new Image();
birdImage.src = 'https://i.postimg.cc/HnG6fLGS/58bcfebc8dc9f2e854012911852020ef.png'; // Bird image
const pipeImage = new Image();
pipeImage.src = 'https://i.postimg.cc/8zVmDY0C/pngegg.png'; // Pipe image

let bird = { x: 50, y: 300, width: 40, height: 30, velocity: 0 };
let gravity = 0.5;
let isGameRunning = false;
let pipes = [];
let pipeWidth = 50;
let pipeGap = 150;
let score = 0;
let animationFrame;
let birdVisible = true; // Bird visibility state
let passedPipes = 0; // To track how many pipes have been passed by the bird

// Handle Bird Flap
function flap() {
  bird.velocity = -8;
}

// Start the game
startButton.addEventListener('click', () => {
  resetGame();
  isGameRunning = true;
  startButton.style.display = 'none';
  gameOverPopup.style.display = 'none'; // Hide the game over popup
  requestAnimationFrame(gameLoop);
});

// Reset Game State
function resetGame() {
  bird = { x: 50, y: 300, width: 40, height: 30, velocity: 0 };
  pipes = [];
  score = 0;
  passedPipes = 0;
  birdVisible = true; // Show the bird before the game starts
  isGameRunning = false;
}

// Draw Bird
function drawBird() {
  if (birdVisible) {
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
  }
}

// Generate Pipes
function generatePipes() {
  const topHeight = Math.random() * (canvas.height / 2);
  const bottomY = topHeight + pipeGap;
  pipes.push({
    x: canvas.width,
    topHeight,
    bottomY,
    width: pipeWidth,
  });
}

// Draw Pipes
function drawPipes() {
  pipes.forEach(pipe => {
    // Top pipe
    ctx.drawImage(pipeImage, pipe.x, pipe.topHeight - pipeImage.height, pipeWidth, pipeImage.height);
    // Bottom pipe
    ctx.drawImage(pipeImage, pipe.x, pipe.bottomY, pipeWidth, pipeImage.height);
  });
}

// Update Pipes
function updatePipes() {
  pipes.forEach(pipe => {
    pipe.x -= 3;
  });

  // Remove pipes that go off-screen
  pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

  // Add new pipes
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    generatePipes();
  }
}

// Collision Detection
function checkCollision() {
  // Check collision with ground or ceiling
  if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
    return true;
  }

  // Check collision with pipes
  for (const pipe of pipes) {
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.topHeight || bird.y + bird.height > pipe.bottomY)
    ) {
      return true;
    }
  }

  return false;
}

// Update Score
function updateScore() {
  pipes.forEach(pipe => {
    // Increment score when the bird passes the pipe (bird x position > pipe x position)
    if (pipe.x + pipeWidth < bird.x && !pipe.passed) {
      score++;
      pipe.passed = true; // Mark the pipe as passed so we don't count it multiple times
    }
  });
}

// Draw Scoreboard
function drawScoreboard() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30); // Scoreboard position
}

// Draw Developer Credit
function drawDeveloperCredit() {
  ctx.fillStyle = 'white';
  ctx.font = '14px Arial';
  ctx.fillText('Game Developed by Daniru Punsith', canvas.width / 2, canvas.height - 10);
}

// Game Loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update bird position
  bird.velocity += gravity;
  bird.y += bird.velocity;

  // Update pipes and score
  updatePipes();
  updateScore();

  // Draw everything
  drawBird();
  drawPipes();
  drawScoreboard();
  drawDeveloperCredit(); // Draw the developer credit text

  // Check for collision
  if (checkCollision()) {
    gameOver();
    return;
  }

  // Loop
  if (isGameRunning) {
    animationFrame = requestAnimationFrame(gameLoop);
  }
}

// Game Over
function gameOver() {
  isGameRunning = false;
  cancelAnimationFrame(animationFrame);
  ctx.fillStyle = 'red';
  ctx.font = '30px Arial';
  ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);

  // Display the final score in the game over popup
  const finalScoreText = document.getElementById('final-score');
  finalScoreText.innerText = `Final Score: ${score}`;  // Show the final score text
  gameOverPopup.style.display = 'block';
  startButton.style.display = 'block';
}

// Retry button functionality
retryButton.addEventListener('click', () => {
  resetGame();
  isGameRunning = true;
  gameOverPopup.style.display = 'none'; // Hide the game over popup
  startButton.style.display = 'none';
  requestAnimationFrame(gameLoop);
});

// Event Listener for Flap
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && isGameRunning) {
    flap();
  }
});

// Display "Start the Game" text initially
function showInitialText() {
  ctx.font = '40px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText('Start the Game', canvas.width / 2, canvas.height / 2);
  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 1000);
}
