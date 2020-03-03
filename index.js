'use strict';

const state = {};
const canvas = document.querySelector(".mainCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const canvasContext = canvas.getContext("2d");


const render = () => {
  canvasContext.fillStyle = "rgba(51, 51, 51, 0.5";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  canvasContext.fillStyle = "rgba(255, 255, 255, 1";
  canvasContext.font = "26px sans-serif";
  canvasContext.fillText(`Loses: ${state.loses}`, 15, 45);


  state.playerPad.draw(canvasContext);
  state.bouncingBall.draw(canvasContext);
  state.bouncingBall.checkCollision(state.playerPad);
  state.bouncingBall.update(canvas.width, canvas.height);

  requestAnimationFrame(render);
}

const loadGame = () => {
  state.loses = 0;

  state.playerPad = new PlayerPad(
    canvas.width / 2 - 150 / 2,
    canvas.height - 20,
    "magenta",
    150,
    20
  );

  state.bouncingBall = new bouncingBall(
    canvas.width / 2 - 15 / 2,
    canvas.height / 2 - 15 / 2,
    "magenta",
    15,
    10,
    5
  );


  render();
}

const handleControls = e => {
  const { keyCode } = e;
  const rightLimit = canvas.width - state.playerPad.width;

  if (keyCode === 37) 
    state.playerPad.move(-30, rightLimit);
  else if(keyCode === 39)
    state.playerPad.move(30, rightLimit);
}

window.addEventListener("keydown", handleControls);
window.addEventListener("load", loadGame);