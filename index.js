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

const render = () => {
  canvasContext.fillStyle = "rgba(51, 51, 51, 0.5";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  canvasContext.fillStyle = "rgba(255, 255, 255, 1";
  canvasContext.font = "26px sans-serif";
  canvasContext.fillText(`Loses: ${state.loses}`, 15, 45);


  state.playerPad.draw(canvasContext);
  state.bouncingBall.draw(canvasContext);
  for (const brick of state.bricks) {
    state.bouncingBall.checkCollision(brick);
    brick.draw();
  }


  state.bouncingBall.checkCollision(state.playerPad);
  state.bouncingBall.update(canvas.width, canvas.height);

  requestAnimationFrame(render);
}

const loadGame = () => {
  state.loses = 0;

  state.playerPad = new PlayerPad(
    canvas.width / 2 - 150 / 2,
    canvas.height - 25,
    "magenta",
    150,
    25
  );

  state.bouncingBall = new bouncingBall(
    (canvas.width / 2) - 15,
    15,
    "magenta",
    15,
    0,
    5
  );

  state.bricks = [
    new Brick(
      canvas.width / 2 + 160,
      canvas.height / 2 - 30 / 2,
      "olive",
      150,
      30
    ),
    new Brick(
      canvas.width / 2 - 50 / 2,
      canvas.height / 2 - 25 / 2,
      "olive",
      150,
      25
    ),
    new Brick(
      canvas.width / 2 - 200,
      canvas.height / 2 - 25 / 2,
      "olive",
      150,
      25
    )
  ];

  render();
}

const handleControls = e => {
  const { keyCode } = e;
  const rightLimit = canvas.width - state.playerPad.width;

  if (keyCode === 37) 
    state.playerPad.move(-30, rightLimit);
  else if(keyCode === 39)
    state.playerPad.move(30, rightLimit);
  else if(keyCode === 27) 
    debugger;
}

const handleMouse = e => {
  const distance = e.x - state.playerPad.positionX;
  const rightLimit = canvas.width - state.playerPad.width;
  state.playerPad.move(distance, rightLimit);
}

window.addEventListener("keydown", handleControls);
window.addEventListener("mousemove", handleMouse);
window.addEventListener("load", loadGame);