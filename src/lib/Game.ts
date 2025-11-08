import * as THREE from "three";

const tmpv2 = new THREE.Vector2();

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

  intersect(ball: Ball): boolean {
    if (
      ball.position.x > this.position - this.size &&
      ball.position.x < this.position + this.size &&
      ball.position.y < -0.87 &&
      ball.velocity.y < 0
    ) {
      console.log(ball.position.x - this.position);
      return true;
    }

    return false;
  }
}

export class Ball {
  position = new THREE.Vector2(0, 0);
  velocity = new THREE.Vector2(0, 0);

  tick() {
    this.position.add(this.velocity);

    if (this.position.x >= 1 && this.velocity.x > 0) {
      this.velocity.x = -this.velocity.x;
      return;
    }

    if (this.position.x <= -1 && this.velocity.x < 0) {
      this.velocity.x = -this.velocity.x;
      return;
    }

    if (this.position.y >= 1 && this.velocity.y > 0) {
      this.velocity.y = -this.velocity.y;
      return;
    }

    if (this.position.y <= -1 && this.velocity.y < 0) {
      this.velocity.y = -this.velocity.y;
      return;
    }
  }

  bounceX(addRandom = false) {
    this.velocity.x = -this.velocity.x;

    if (addRandom) {
      this.velocity.y += (Math.random() - 0.5) * 0.01;
    }
  }

  bounceY(addRandom = false) {
    this.velocity.y = -this.velocity.y;

    if (addRandom) {
      this.velocity.x += (Math.random() - 0.5) * 0.01;
    }
  }
}

enum GameState {
  IDLE,
  PLAYING,
}

export class Game {
  player: Player;
  ball: Ball;

  leftDown = false;
  rightDown = false;

  state = GameState.IDLE;

  constructor() {
    this.player = new Player();
    this.ball = new Ball();
  }

  begin() {
    if (this.state === GameState.PLAYING) {
      return;
    }

    this.ball.position.set(0, 0);
    this.ball.velocity.set((Math.random() - 0.5) * 0.005, -0.01);

    this.state = GameState.PLAYING;
  }

  tick(_delta: Number) {
    if (this.leftDown) {
      this.player.moveLeft();
    }
    if (this.rightDown) {
      this.player.moveRight();
    }

    if (this.state === GameState.PLAYING) {
      this.ball.tick();

      if (this.player.intersect(this.ball)) {
        this.ball.bounceY(true);
      }
    }
  }
}
