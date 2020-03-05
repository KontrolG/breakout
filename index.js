'use strict';

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
  state.currentState = "gameOver";
  showOverlay();
  showMessage("You lost!", -13, "crimson");
  showMessage("Click anywhere to restart", 16);
  cancelAnimationFrame(render);
}

const gameFinished = () => {
  state.currentState = "gameFinished";
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

const render = () => {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  canvasContext.fillStyle = "rgba(51, 51, 51, 1)";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  new Rectangle(canvas.width - 95, 35, "skyblue", 75, 15).draw();

  drawLives(state.lives);
  canvasContext.fillStyle = "rgba(255, 255, 255, 1)";
  canvasContext.fillText(state.bricks.length, canvas.width - 72.5, 51.5);

  state.playerPad.draw(canvasContext);
  state.bouncingBall.draw(canvasContext);
  for (const brick of state.bricks) {
    state.bouncingBall.didCollideWith(brick);
    brick.draw();
  }



  state.bouncingBall.didCollideWith(state.playerPad);
  state.bouncingBall.update(canvas.width, canvas.height);

  if (state.lives === 0) {
    gameOver();
    return;
  } else if (!state.bricks.length) {
    gameFinished();
    return;
  } else if (state.currentState === "paused") {
    gamePaused();
    return;
  }

  requestAnimationFrame(render);
}

const loadGame = () => {
  canvasContext.font = "26px 'Lato'";
  canvasContext.fillStyle = "rgba(51, 51, 51, 1";
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

  /* initializateGame(); */

  // Left Side test
  // state.bouncingBall = new bouncingBall(
  //   15,
  //   canvas.height / 2 - 15,
  //   "magenta",
  //   15,
  //   5,
  //   0
  // );

  // Right Side test
  // state.bouncingBall = new bouncingBall(
  //   canvas.width - 15,
  //   canvas.height / 2 - 5,
  //   "magenta",
  //   15,
  //   -5,
  //   0
  // );

  // Top side (for the right) test
  // state.bouncingBall = new bouncingBall(15, 15, "blueviolet", 15, 10, 10);

  // Top side (for the left) test
  // state.bouncingBall = new bouncingBall(
  //   canvas.width - (190 + 165),
  //   15,
  //   "magenta",
  //   15,
  //   0,
  //   5
  // );

  // Bottom side (for the right) test
  // state.bouncingBall = new bouncingBall(
  //   canvas.width - 190,
  //   canvas.height - 100,
  //   "magenta",
  //   15,
  //   0,
  //   -5
  // );

  // Bottom side (for the left) test
  // state.bouncingBall = new bouncingBall(
  //   canvas.width - (190 + 165),
  //   canvas.height - 100,
  //   "magenta",
  //   15,
  //   0,
  //   -5
  // );
}

const initializateGame = () => {
  state.lives = 3;
  state.currentState = "playing";

  state.livesImage = new Image();
  state.livesImage.src = "lives.png";
  state.livesImage.addEventListener("load", function () {
    canvasContext.drawImage(this, 20, 20, 30, 30);
  })

  state.bouncingBall = new bouncingBall(10 + (Math.random() * (canvas.width - 10)), 10, "blueviolet", 10, 5 * (Math.random() > 0.5 ? 1 : -1), 5);

  state.bricks = levelGenerator();
  /* [
    new Brick(
      canvas.width / 2 + 160,
      canvas.height / 2 - 10 / 2,
      "skyblue",
      150,
      10
    ),
    new Brick(
      canvas.width / 2 - 50 / 2,
      canvas.height / 2 - 25 / 2,
      "skyblue",
      150,
      25
    ),
    new Brick(
      canvas.width / 2 - 200,
      canvas.height / 2 - 30 / 2,
      "skyblue",
      150,
      30
    )
  ]; */

  render();
}

const continueGame = () => {
  state.currentState = "playing";
  requestAnimationFrame(render);
}

const handleControls = e => {
  const { keyCode } = e;
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
  state.playerPad.move(distance, rightLimit);
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




function levelGenerator() {
  const columns = 8;
  const rows = 8;
  const totalWidth = canvas.width * 0.6;
  const totalHeight = canvas.height * 0.4;
  let actualPositionX = (canvas.width - totalWidth) / 2;
  let actualPositionY = (canvas.height - totalHeight) / 2;
  const bricksMargins = totalWidth * 0.01;
  const bricksWidth = (totalWidth / rows) - bricksMargins;
  const bricksHeight = (totalHeight / columns) - bricksMargins;
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

