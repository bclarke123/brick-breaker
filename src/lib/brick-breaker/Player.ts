import { lineAABBIntersection } from "./utils";

export class Player {
  yPos = -0.9;
  position = 0;
  size = 0.1;
  speed = 1.2; // units per second (was 0.02 per frame at 60fps)

  moveLeft(delta: number) {
    this.position = Math.max(-1 + this.size, this.position - this.speed * delta);
  }

  moveRight(delta: number) {
    this.position = Math.min(1 - this.size, this.position + this.speed * delta);
  }

  intersect(ball: Ball): { hit: boolean; pos: number } {
    // Only check if ball is moving downward
    if (ball.velocity.y >= 0) {
      return { hit: false, pos: -1 };
    }

    // Use continuous collision detection
    const paddleLeft = this.position - this.size;
    const paddleRight = this.position + this.size;
    const paddleBottom = this.yPos - 0.05; // Small height for the paddle
    const paddleTop = this.yPos;

    const result = lineAABBIntersection(
      ball.prevPosition,
      ball.position,
      paddleLeft,
      paddleRight,
      paddleBottom,
      paddleTop
    );

    if (result.hit) {
      // Calculate intersection point to determine position on paddle
      const hitX = ball.prevPosition.x + (ball.position.x - ball.prevPosition.x) * result.t;
      const pos = (hitX - this.position) / this.size;
      return { hit: true, pos };
    }

    return { hit: false, pos: -1 };
  }
}
