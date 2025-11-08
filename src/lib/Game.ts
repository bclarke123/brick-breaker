import * as THREE from "three";

export class Player {
  position = 0;
  size = 0.1;
  speed = 0.02;

  moveLeft() {
    this.position = Math.max(-1 + this.size * 0.5, this.position - this.speed);
  }

  moveRight() {
    this.position = Math.min(1 - this.size * 0.5, this.position + this.speed);
  }
}

export class Ball {
  position = new THREE.Vector2();
  velocity = new THREE.Vector2(); // x = angle [0, 2pi], y = speed
}

export class Game {
  player: Player;
  ball: Ball;

  leftDown = false;
  rightDown = false;

  constructor() {
    this.player = new Player();
    this.ball = new Ball();
  }

  tick(_delta: Number) {
    if (this.leftDown) {
      this.player.moveLeft();
    }
    if (this.rightDown) {
      this.player.moveRight();
    }
  }
}
