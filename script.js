const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreElement = document.getElementById('score');
const bestElement = document.getElementById('best');
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');

let score = 0;
let bestScore = localStorage.getItem('bestDodge') || 0;
bestElement.textContent = bestScore;

let player = { x: 175, y: 480, width: 50, height: 80, speed: 6 };
let obstacles = [];
let keys = {};
let gameRunning = true;
let speedGame = 4;

window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

function drawRoad() {
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Faixas da estrada
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 8;
  for (let i = -50; i < canvas.height; i += 80) {
    ctx.beginPath();
    ctx.moveTo(100, i);
    ctx.lineTo(100, i + 40);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(300, i);
    ctx.lineTo(300, i + 40);
    ctx.stroke();
  }
}

function drawPlayer() {
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(player.x, player.y, player.width, player.height);
  
  // Detalhes do carro
  ctx.fillStyle = '#00cc00';
  ctx.fillRect(player.x + 8, player.y + 15, player.width - 16, 20);
}

function createObstacle() {
  const lane = [60, 175, 290][Math.floor(Math.random() * 3)];
  obstacles.push({
    x: lane,
    y: -80,
    width: 50,
    height: 80,
    speed: speedGame + Math.random() * 2
  });
}

function drawObstacles() {
  ctx.fillStyle = '#ff3366';
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    
    // Detalhe do carro inimigo
    ctx.fillStyle = '#cc0000';
    ctx.fillRect(obs.x + 8, obs.y + 15, obs.width - 16, 20);
    ctx.fillStyle = '#ff3366';
    
    obs.y += obs.speed;
    
    if (obs.y > canvas.height) {
      obstacles.splice(i, 1);
      score += 10;
    }
  }
}

function checkCollision() {
  for (let obs of obstacles) {
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      endGame();
    }
  }
}

function updatePlayer() {
  if (keys['ArrowLeft'] && player.x > 20) player.x -= player.speed;
  if (keys['ArrowRight'] && player.x < canvas.width - player.width - 20) player.x += player.speed;
}

function gameLoop() {
  if (!gameRunning) return;

  drawRoad();
  updatePlayer();
  drawPlayer();
  drawObstacles();
  checkCollision();

  score += 1;
  scoreElement.textContent = Math.floor(score / 5);

  // Aumenta dificuldade com o tempo
  if (score % 800 === 0) speedGame += 0.3;

  // Spawn de obstáculos
  if (Math.random() < 0.025) createObstacle();

  // Atualiza melhor pontuação
  if (score > bestScore) {
    bestScore = score;
    bestElement.textContent = Math.floor(bestScore / 5);
    localStorage.setItem('bestDodge', bestScore);
  }

  requestAnimationFrame(gameLoop);
}

function endGame() {
  gameRunning = false;
  finalScoreElement.textContent = Math.floor(score / 5);
  gameOverScreen.style.display = 'flex';
}

function newGame() {
  score = 0;
  speedGame = 4;
  obstacles = [];
  player.x = 175;
  scoreElement.textContent = '0';
  gameOverScreen.style.display = 'none';
  gameRunning = true;
  gameLoop();
}

// Iniciar o jogo
newGame();
