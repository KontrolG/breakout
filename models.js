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
  }
}

class PlayerPad extends Rectangle {
  constructor(positionX, positionY, colorString, width, height) {
    super(positionX, positionY, colorString, width, height);
  }

  move(distance, rightLimit) {
    const newPosition = this.positionX + distance;
    const isNegative = Math.sign(distance) === -1;
    if (newPosition <= rightLimit && newPosition >= 0) {
      /* while (this.positionX !== newPosition) {
        this.positionX += isNegative ? -1 : 1;
        this.draw();
      } */

      this.positionX = newPosition;
    }
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
  }
}

class bouncingBall extends Circle {
  constructor(positionX, positionY, colorString, radius, velocityX, velocityY) {
    super(positionX, positionY, colorString, radius);
    this.velocityX = velocityX;
    this.velocityY = velocityY;
  }

  revertVelocity(axis) {
    this[`velocity${axis}`] = -(this[`velocity${axis}`]);
  }

  updatePosition(axis, axisLimit) {
    const newPosition = this[`position${axis}`] + this[`velocity${axis}`];
    if (newPosition + this.radius >= axisLimit || newPosition <= this.radius) this.revertVelocity(axis);
    this[`position${axis}`] = newPosition;
  }

  update(rightLimit, bottomLimit) {
    this.updatePosition("X", rightLimit);
    this.updatePosition("Y", bottomLimit);
  }

  checkCollision(otherShape) {
    // console.log(this);
    // console.log(otherShape);
    const touchX =
      this.positionX + this.radius >= otherShape.positionX &&
      this.positionX + this.radius <= otherShape.positionX + otherShape.width;    
    const touchY = this.positionY + this.radius >= otherShape.positionY;
    if (touchX && touchY) {
      this.revertVelocity("Y");
    }

    if (this.positionY + this.radius >= 489) {
      state.loses++;
      this.positionX = 1024 / 2;
      this.positionY = 489 / 2;
    }
    /* if (touchY) {
      this.revertVelocity("Y");
    } */  
  }
}