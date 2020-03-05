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

  move(distance, rightLimit) {
    const newPosition = this.positionX - (this.width / 2) + distance;
    const isNegative = newPosition < 0;
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
    canvasContext.closePath();
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
    this[`velocity${axis}`] = -this[`velocity${axis}`];
  }

  updatePosition(axis, axisLimit) {
    const newPosition = this[`position${axis}`] + this[`velocity${axis}`];
    if (newPosition + this.radius >= axisLimit || newPosition <= this.radius)
      this.revertVelocity(axis);
    this[`position${axis}`] = newPosition;
  }

  update(rightLimit, bottomLimit) {
    if (this.positionY + this.radius + this.velocityY >= bottomLimit) {
      state.lives--;
      playAudio(liveLostAudio);
      const totalSize = this.radius * 2; 
      this.positionX = totalSize + (Math.random() * (canvas.width - totalSize));
      this.positionY = totalSize;
      this.velocityX = 5 * (Math.random() > 0.5 ? 1 : -1);
    } else {
      this.updatePosition("X", rightLimit);
      this.updatePosition("Y", bottomLimit);
    }    
  }

  // checkCollision(otherShape) {

  //   const ballRightEdge = this.positionX + this.radius;
  //   const ballBottomEdge = this.positionY + this.radius;
  //   const ballTopEdge = this.positionY - this.radius;
  //   const ballLeftEdge = this.positionX - this.radius;

  //   const otherShapeRightEdge = otherShape.positionX + otherShape.width;
  //   const otherShapeBottomEdge = otherShape.positionY + otherShape.height;

  //   /* When the ball touched the top of the rectangle. */
  //   const touchTop =
  //     ballRightEdge >= (otherShape.positionX) &&
  //     ballLeftEdge <= (otherShapeRightEdge) &&
  //     ballBottomEdge < otherShape.positionY &&
  //     this.positionY >= otherShape.positionY &&
  //     this.velocityY >= 0;

  //   /* When the ball touched the bottom of the rectangle. */
  //   const touchBottom =
  //     ballRightEdge >= (otherShape.positionX) &&
  //     ballLeftEdge <= (otherShapeRightEdge) &&

  //     ballTopEdge < otherShapeBottomEdge &&
  //     this.positionY >= otherShapeBottomEdge &&
  //     this.velocityY <= 0;

  //     /* When the ball touch one side of the rectangle. */
  //   /* Right side */
  //   const touchRight =
  //   /* Done */
  //     ballLeftEdge <= otherShapeRightEdge &&

  //     // ballTopEdge >= otherShape.positionY &&
  //     ballBottomEdge >= otherShape.positionY &&

  //     ballRightEdge > otherShapeRightEdge &&
  //     ballTopEdge <= otherShapeBottomEdge &&
  //     this.velocityX <= 0;

  //   /* Left side */
  //   const touchLeft =
  //     /* Siempre que sobrepase el lado izq sera true */
  //     ballRightEdge >= otherShape.positionX &&
  //     /* Cuando sobrepase el borde superior */
  //     // ballTopEdge >= otherShape.positionY &&
  //     ballBottomEdge >= otherShape.positionY &&
  //     /*  */
  //     ballLeftEdge < otherShape.positionX &&
  //     ballTopEdge <= otherShapeBottomEdge &&
  //     this.velocityX >= 0;

  //     /* if (ballRightEdge >= otherShape.positionX) {
  //       debugger;
  //     } */

  //     if (!(otherShape instanceof PlayerPad) && (touchTop || touchBottom || touchRight || touchLeft)) {
  //       // debugger;
  //       otherShape.hitted();
  //     }

  //   if (touchTop || touchBottom) {
  //     this.revertVelocity("Y");
  //   } else if (touchRight || touchLeft) {
  //     this.revertVelocity("X");
  //   }
  // }

  didCollideWith(otherShape) {
    const circunference = this.radius - (Math.PI / 2);
    if (
      this.positionX - circunference <
        otherShape.positionX + otherShape.width &&
      this.positionX + circunference > otherShape.positionX &&
      this.positionY - circunference <
        otherShape.positionY + otherShape.height &&
      this.positionY + circunference > otherShape.positionY
    ) this.changeDirection(otherShape);
  }

  changeDirection(otherShape) {
    const circunference = this.radius - Math.PI / 2;
    const secondAndSixth = (this.positionX - circunference >= otherShape.positionX &&
    this.positionX - circunference <= otherShape.positionX + otherShape.width);

    const fourthAndEight =
      this.positionY + circunference >= otherShape.positionY &&
      this.positionY + circunference <=
        otherShape.positionY + otherShape.height;

    if (secondAndSixth) {
      this.revertVelocity("Y");
    } else if (fourthAndEight) {
      this.revertVelocity("X");
    } else {
      this.revertVelocity("Y");
      this.revertVelocity("X");
    }

    if (otherShape instanceof Brick) {
      otherShape.hitted();      
    }
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
