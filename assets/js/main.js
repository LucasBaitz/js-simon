const gameTiles = document.querySelectorAll('[data-game-tile]');
const startGame = document.querySelector('[data-start]');
const score = document.querySelector('#score');
const gameOverScreen = document.getElementById('gameOverScreen');
let isGameRunning = false;
let roundsCounter = 0;
let isPlayingSequence = false;
let isPlayerTurn = false;
let isGameOver = false;

startGame.addEventListener('click', () => {
  if (!isGameRunning) {
    gameLoop();
    startGame.style.backgroundColor = "#ff8000";
    isGameRunning = true;
  }
});

const bleepColors = {
  "red": "red",
  "green": "green",
  "blue": "blue",
  "yellow": "yellow"
};

const colorResets = {
  "red": "rgba(255, 0, 0, 0.515)",
  "green": "rgba(0, 128, 0, 0.515)",
  "blue": "rgba(0, 0, 255, 0.515)",
  "yellow": "rgba(255, 255, 0, 0.515)"
};

const bleepSounds = {
  "red": new Audio('/assets/sounds/gold-beep.mp3'),
  "green": new Audio('/assets/sounds/ping-beep.mp3'),
  "blue": new Audio('/assets/sounds/pitch-beep.mp3'),
  "yellow": new Audio('/assets/sounds/quick-beep.mp3'),
  "gameStart": new Audio('/assets/sounds/game-start.mp3'),
  "gameOver": new Audio('/assets/sounds/game-over.wav')
};

const currentSequence = [];
const playerSequence = [];

function randomTilePicker() {
  const tileIndex = Math.floor(Math.random() * 4);
  return tileIndex;
}

async function computerPlayTiles() {
  isPlayingSequence = true;
  isPlayerTurn = false;

  currentSequence.push(randomTilePicker());

  for (const index of currentSequence) {
    let currentTile = gameTiles[index];
    await bleepAsync(currentTile, bleepColors[currentTile.id]);
    await delay(1000);
  }

  isPlayingSequence = false;
  isPlayerTurn = true;
}

function bleepAsync(tile, color) {
  return new Promise(resolve => {
    tile.style.backgroundColor = color;
    bleepSounds[color].play();
    setTimeout(() => {
      tile.style.backgroundColor = colorResets[tile.id];
      resolve();
    }, 1000);
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function onTileClick() {
  if (!isPlayerTurn || isPlayingSequence) {
    return;
  }

  const tile = this;
  bleepAsync(tile, bleepColors[tile.id]);
  playerSequence.push(Array.from(gameTiles).indexOf(tile));
  if (!checkPlayerSequence()) {
    endGame();
  }
}

function capturePlayerClick() {
  const gameTilesArray = Array.from(gameTiles);
  gameTilesArray.forEach(tile => {
    tile.addEventListener('click', onTileClick);
  });
}

function checkPlayerSequence() {
  for (let i = 0; i < playerSequence.length; i++) {
    if (playerSequence[i] !== currentSequence[i]) {
      isGameOver = true;
      return false;
    }
  }

  if (playerSequence.length === currentSequence.length) {
    playerSequence.length = 0;
    isPlayingSequence = true;
    setTimeout(() => {
      isPlayingSequence = false;
      gameLoop();
    }, 1000);
  }

  isGameOver = false;
  return true;
}

function gameLoop() {
  hideGameOverScreen();
  playerSequence.length = 0;
  bleepSounds.gameStart.play();
  roundsCounter++;
  increaseRoundsCounter(roundsCounter);
  removeTileClickListeners();
  computerPlayTiles();
  capturePlayerClick();
}

function removeTileClickListeners() {
  const gameTilesArray = Array.from(gameTiles);
  gameTilesArray.forEach(tile => {
    tile.removeEventListener('click', onTileClick);
  });
}

function endGame() {
  showGameOverScreen();
  startGame.style.backgroundColor = "#ff800083";
  isGameRunning = false;
  roundsCounter = 0;
  playerSequence.length = 0;
  currentSequence.length = 0;
  removeTileClickListeners();
}

function increaseRoundsCounter(roundsCounter) {
  score.textContent = roundsCounter;
}

function showGameOverScreen() {
  bleepSounds.gameOver.play();
  gameOverScreen.style.top = '50%';
}

function hideGameOverScreen() {
  gameOverScreen.style.top = '-100px';
}
