'use strict';

const state = {};
const canvas = document.querySelector(".mainCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const canvasContext = canvas.getContext("2d");
const boomAudio = document.querySelector("audio.boom");

const playBoom = () => {
  boomAudio.currentTime = 0;
  boomAudio.play();
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
  showMessage("Click anywhere to restart.", 16);
  cancelAnimationFrame(render);
}

const gameFinished = () => {
  state.currentState = "gameFinished";
  showOverlay();
  showMessage("You won!", -13, "forestgreen");
  showMessage("Click anywhere to restart.", 16);
  cancelAnimationFrame(render);
};

const gamePaused = () => {
    showOverlay();
    showMessage("Game Paused", -13, "orange");
    showMessage("Click anywhere to continue.", 16);
    cancelAnimationFrame(render);
}

const render = () => {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  canvasContext.fillStyle = "rgba(51, 51, 51, 1";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  canvasContext.fillStyle = "rgba(255, 255, 255, 1";
  canvasContext.fillText(`Lives: ${state.lives}`, 15, 45);
  canvasContext.fillText(`Bricks: ${state.bricks.length}`, canvas.width - 120, 45);

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
  showMessage("Click anywhere to restart.", -13);

  state.playerPad = new PlayerPad(
    canvas.width / 2 - 150 / 2,
    canvas.height - 25,
    "blueviolet",
    150,
    25
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

  state.bouncingBall = new bouncingBall(15, 15, "blueviolet", 15, 5, 5);

  state.bricks = [
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
  ];

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