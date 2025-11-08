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

  intersect(ball: Ball): { hit: boolean; pos: number } {
    if (
      ball.position.x > this.position - this.size &&
      ball.position.x < this.position + this.size &&
      ball.position.y < -0.87 &&
      ball.velocity.y < 0
    ) {
      return { hit: true, pos: (ball.position.x - this.position) / this.size };
    }

    return { hit: false, pos: -1 };
  }
}

export class Ball {
  position = new THREE.Vector2(0, -0.87);
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

  bounceX() {
    this.velocity.x = -this.velocity.x;
  }

  bounceY() {
    this.velocity.y = -this.velocity.y;
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

    this.ball.velocity.set((Math.random() - 0.5) * 0.005, 0.01);

    this.state = GameState.PLAYING;
  }

  tick(_delta: Number) {
    if (this.leftDown) {
      this.player.moveLeft();
      if (this.state === GameState.IDLE) {
        this.ball.position.x = this.player.position;
      }
    }
    if (this.rightDown) {
      this.player.moveRight();
      if (this.state === GameState.IDLE) {
        this.ball.position.x = this.player.position;
      }
    }

    if (this.state === GameState.PLAYING) {
      this.ball.tick();

      const { hit, pos } = this.player.intersect(this.ball);
      if (hit) {
        this.ball.bounceY();
        this.ball.velocity.x += pos * 0.01;
      }
    }
  }
}
