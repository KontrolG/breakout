// 'use strict';

const state = {};
const canvas = document.querySelector(".mainCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const canvasContext = canvas.getContext("2d");
const boomAudio = document.querySelector("audio.boom");
const liveLostAudio = document.querySelector("audio.liveLost");

const playAudio = audio => {
  audio.currentTime = 0;
  audio.play();
}

const showMessage = (message, marginTop = 0, colorString = "#fff") => {
  canvasContext.fillStyle = colorString;
  const { width: textWidth } = canvasContext.measureText(message);
  canvasContext.fillText(
    message,
    canvas.width / 2 - textWidth / 2,
    canvas.height / 2 + marginTop
  );
}

const showOverlay = () => {
  canvasContext.fillStyle = "rgba(51, 51, 51, 0.7";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}

const gameOver = () => {
  showOverlay();
  showMessage("You lost!", -13, "crimson");
  showMessage("Click anywhere to restart", 16);
  cancelAnimationFrame(render);
}

const gameFinished = () => {
  
  showOverlay();
  showMessage("You won!", -13, "forestgreen");
  showMessage("Click anywhere to restart", 16);
  cancelAnimationFrame(render);
};

const gamePaused = () => {
    showOverlay();
    showMessage("Game Paused", -13, "orange");
    showMessage("Click anywhere to continue", 16);
    cancelAnimationFrame(render);
}

const drawLives = lives => {
  for (let index = 1; index <= lives; index++) {
    canvasContext.drawImage(state.livesImage, 20 * index, 20, 30, 30);
  }
}

const drawBackground = () => {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  canvasContext.fillStyle = "#333";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}

const drawBricksCount = () => {
  const brickRectangle = new Rectangle(
    canvas.width - 95,
    35,
    "skyblue",
    75,
    15
  );
  brickRectangle.draw();
  canvasContext.fillStyle = "#fff";
  canvasContext.fillText(state.bricks.length, canvas.width - 72.5, 51.5);
}

const drawBricks = () => {
  for (const brick of state.bricks) brick.draw();
}

const checkCollisionWithBricks = () => {
  for (const brick of state.bricks) state.bouncingBall.didCollideWith(brick);
}

const changeCurrentState = () => {
  if (state.lives === 0) {
    state.currentState = "gameOver";
    gameOver();
  } else if (!state.bricks.length) {
    state.currentState = "gameFinished";
    gameFinished();
  } else if (state.currentState === "paused") {
    gamePaused();
  }
}

const drawEverything = () => {
  drawBackground();
  drawBricksCount();
  drawLives(state.lives);
  state.playerPad.draw();
  state.bouncingBall.draw();
  drawBricks();
}

const checkCollisions = () => {
  checkCollisionWithBricks();
  state.bouncingBall.didCollideWith(state.playerPad);
  state.bouncingBall.checkBoundariesCollision(canvas.width, canvas.height);
}

const render = () => {
  drawEverything();
  checkCollisions(); 

  changeCurrentState();
  if (state.currentState !== "playing") return;

  requestAnimationFrame(render);
}

const loadGame = () => {
  canvasContext.font = "26px 'Lato'";
  canvasContext.fillStyle = "#333";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  state.currentState = "standBy";
  showOverlay();
  showMessage("Click anywhere to start the game", -13);

  state.playerPad = new PlayerPad(
    canvas.width / 2 - 150 / 2,
    canvas.height - 20,
    "blueviolet",
    100,
    15
  );
}

const createBouncingBallWithRandomPosition = () => {
  const safeLimit = (canvas.width - 10);
  const randomPositionX = 10 + (Math.random() * safeLimit);
  let velocityX = 5;
  if (Math.random() > 0.5) velocityX *= -1;
  return new bouncingBall(
    randomPositionX,
    10,
    "blueviolet",
    10,
    velocityX,
    5
  );
};

const loadLivesImage = () => {
  state.livesImage = new Image();
  state.livesImage.src = "lives.png";
}

const initializateGame = () => {
  state.lives = 3;
  state.currentState = "playing";

  loadLivesImage();
  state.bouncingBall = createBouncingBallWithRandomPosition();
  state.bricks = levelGenerator(6, 4, canvas.width * 0.6, canvas.height * 0.4);
  render();
}

function levelGenerator(columns, rows, totalWidth, totalHeight) {
  let actualPositionX = (canvas.width - totalWidth) / 2;
  let actualPositionY = (canvas.height - totalHeight) / 2;
  const bricksMargins = (totalWidth + totalHeight) * 0.005;
  const bricksWidth = (totalWidth / columns) - bricksMargins;
  const bricksHeight = (totalHeight / rows) - bricksMargins;
  const bricks = [];

  for (let rowsCount = 1; rowsCount <= rows; rowsCount++) {
    for (let columnsCount = 1; columnsCount <= columns; columnsCount++) {
      bricks.push(
        new Brick(actualPositionX, actualPositionY, "skyblue", bricksWidth, bricksHeight)
      );
      actualPositionX += bricksWidth + bricksMargins;  
    }
    actualPositionX = (canvas.width - totalWidth) / 2;
    actualPositionY += bricksHeight + bricksMargins;
  }

  return bricks;
}

const continueGame = () => {
  state.currentState = "playing";
  requestAnimationFrame(render);
}

const handleControls = ({keyCode}) => {
  const rightLimit = canvas.width - state.playerPad.width;

  if (keyCode === 37)
    state.playerPad.move(-30, rightLimit);
  else if(keyCode === 39)
    state.playerPad.move(30, rightLimit);
  else if(keyCode === 27) 
    state.currentState = "paused";
}

const handleMouse = e => {
  const distance = e.x - state.playerPad.positionX;
  const rightLimit = canvas.width - state.playerPad.width;
  state.playerPad.move(distance, rightLimit, true);
}

const handleClick = () => {
  if (state.currentState !== "playing") {
    if (state.currentState === "paused") continueGame();
    else initializateGame();
  }
}

window.addEventListener("keydown", handleControls);
window.addEventListener("mousemove", handleMouse);
canvas.addEventListener("click", handleClick);
window.addEventListener("load", loadGame);