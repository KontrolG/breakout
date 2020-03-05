'use strict';

class Shape {
  constructor(positionX, positionY, colorString) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.colorString = colorString;
  }
}

class Rectangle extends Shape {
  constructor(positionX, positionY, colorString, width, height) {
    super(positionX, positionY, colorString);
    this.width = width;
    this.height = height;
  }

  draw() {
    canvasContext.fillStyle = this.colorString;
    canvasContext.fillRect(this.positionX, this.positionY, this.width, this.height);
    canvasContext.closePath();
  }
}

class PlayerPad extends Rectangle {
  constructor(positionX, positionY, colorString, width, height) {
    super(positionX, positionY, colorString, width, height);
  }

  move(distance, rightLimit, isKeyEvent = false) {
    const padOrigen = isKeyEvent ? (this.width / 2) : 0;
    const newPosition = (this.positionX + distance) - padOrigen;
    if (newPosition <= rightLimit && newPosition >= 0) 
      this.positionX = newPosition;
  }
}

class Circle extends Shape {
  constructor(positionX, positionY, colorString, radius) {
    super(positionX, positionY, colorString);
    this.radius = radius;
  }

  draw() {
    canvasContext.beginPath();
    canvasContext.fillStyle = this.colorString;
    canvasContext.arc(this.positionX, this.positionY, this.radius, 0, 180);
    canvasContext.fill();
    canvasContext.closePath();
  }
}

class Brick extends Rectangle {
  constructor(positionX, positionY, colorString, width, height) {
    super(positionX, positionY, colorString, width, height);
  }

  hitted() {
    this.colorString = `hsl(0, 0%, 30%)`;
    const index = state.bricks.indexOf(this);
    state.bricks.splice(index, 1);
  }
}

class bouncingBall extends Circle {
  constructor(positionX, positionY, colorString, radius, velocityX, velocityY) {
    super(positionX, positionY, colorString, radius);
    this.velocityX = velocityX;
    this.velocityY = velocityY;
  }

  revertVelocity(axis) {
    playAudio(boomAudio);
    this[`velocity${axis}`] *= -1;
  }

  updatePosition(axis, axisLimit) {
    const newPosition = this[`position${axis}`] + this[`velocity${axis}`];
    if (newPosition + this.radius >= axisLimit || newPosition <= this.radius)
      this.revertVelocity(axis);

    this[`position${axis}`] = newPosition;
  }

  restartPosition() {
    const safeArea = this.radius * 2;
    const randomPositionX = Math.random() * (canvas.width - safeArea);
    this.positionX = safeArea + randomPositionX;
    this.positionY = safeArea;
    if (Math.random() > 0.5) this.revertVelocity("X");
  }

  checkBoundariesCollision(rightLimit, bottomLimit) {
    if (this.positionY + this.radius + this.velocityY >= bottomLimit) {
      state.lives--;
      playAudio(liveLostAudio);
      this.restartPosition();
    } else {
      this.updatePosition("X", rightLimit);
      this.updatePosition("Y", bottomLimit);
    }
  }

  didCollideWith(otherShape) {
    const circunference = this.radius - Math.PI / 2;
    if (
      this.positionX - circunference <
        otherShape.positionX + otherShape.width &&
      this.positionX + circunference > otherShape.positionX &&
      this.positionY - circunference <
        otherShape.positionY + otherShape.height &&
      this.positionY + circunference > otherShape.positionY
    )
      this.changeDirection(otherShape, circunference);
  }

  changeDirection(otherShape, circunference) {
    const touchedUpOrDowm =
      this.positionX - circunference >= otherShape.positionX &&
      this.positionX - circunference <= otherShape.positionX + otherShape.width;

    const touchedSides =
      this.positionY + circunference >= otherShape.positionY &&
      this.positionY + circunference <= otherShape.positionY + otherShape.height;

    if (touchedUpOrDowm) this.revertVelocity("Y");
    else if (touchedSides) this.revertVelocity("X");
    else {
      this.revertVelocity("Y");
      this.revertVelocity("X");
    }

    if (otherShape instanceof Brick) otherShape.hitted();
  }
}
