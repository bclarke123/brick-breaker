import * as THREE from "three";

const tmpv2 = new THREE.Vector2();

export class Player {
  yPos = -0.9;
  position = 0;
  size = 0.1;
  speed = 0.02;

  moveLeft() {
    this.position = Math.max(-1 + this.size, this.position - this.speed);
  }

  moveRight() {
    this.position = Math.min(1 - this.size, this.position + this.speed);
  }

  intersect(ball: Ball): { hit: boolean; pos: number } {
    if (
      ball.position.x > this.position - this.size &&
      ball.position.x < this.position + this.size &&
      ball.position.y < this.yPos &&
      ball.velocity.y < 0
    ) {
      return { hit: true, pos: (ball.position.x - this.position) / this.size };
    }

    return { hit: false, pos: -1 };
  }
}

export class Ball {
  speed = 0.02;
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

  bounceX() {
    this.velocity.x = -this.velocity.x;
  }

  bounceY(intersection: number) {
    this.setVelocity(
      this.velocity.x + intersection * this.speed,
      -this.velocity.y,
    );
  }

  setVelocity(x: number, y: number) {
    // Keep the angle, maintain the speed
    tmpv2.set(x, y);
    tmpv2.divideScalar(tmpv2.length());
    tmpv2.multiplyScalar(this.speed);

    this.velocity.x = tmpv2.x;
    this.velocity.y = tmpv2.y;
  }

  oob() {
    return this.position.y < -0.99;
  }
}

export class Level {
  brickSize = new THREE.Vector2(0.05, 0.01);
  bricks: number[][];

  constructor() {
    this.bricks = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];
  }

  intersect(ball: Ball) {}
}

enum GameState {
  IDLE,
  PLAYING,
}

export class Game {
  player: Player;
  ball: Ball;
  level: Level;

  leftDown = false;
  rightDown = false;

  state = GameState.IDLE;

  constructor() {
    this.player = new Player();
    this.ball = new Ball();
    this.level = new Level();

    this.init();
  }

  init() {
    this.state = GameState.IDLE;
    this.ball.position.set(this.player.position, this.player.yPos);
  }

  begin() {
    if (this.state === GameState.PLAYING) {
      return;
    }

    this.ball.setVelocity(
      (Math.random() - 0.5) * this.ball.speed * 0.5,
      this.ball.speed,
    );
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
      const { hit, pos } = this.player.intersect(this.ball);
      if (hit) {
        this.ball.bounceY(pos);
      }

      if (this.ball.oob()) {
        this.init();
        return;
      }

      this.ball.tick();
    }
  }
}
