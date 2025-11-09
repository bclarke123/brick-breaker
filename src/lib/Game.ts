import * as THREE from "three";

import { Ball } from "./Ball";
import { Level } from "./Level";
import { Player } from "./Player";
import { lineAABBIntersection } from "./utils";

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
    this.ball.prevPosition.copy(this.ball.position);
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

  tick(delta: number) {
    if (this.leftDown) {
      this.player.moveLeft(delta);
      if (this.state === GameState.IDLE) {
        this.ball.position.x = this.player.position;
      }
    }
    if (this.rightDown) {
      this.player.moveRight(delta);
      if (this.state === GameState.IDLE) {
        this.ball.position.x = this.player.position;
      }
    }

    if (this.state === GameState.PLAYING) {
      const { hit, pos } = this.player.intersect(this.ball);
      if (hit) {
        this.ball.bounceY(pos);
      }

      this.level.intersect(this.ball);

      if (this.ball.oob()) {
        this.init();
        return;
      }

      this.ball.tick(delta);
    }
  }
}
