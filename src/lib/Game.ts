import * as THREE from "three";

const tmpv2 = new THREE.Vector2();

// Helper for line-segment vs AABB collision (continuous collision detection)
function lineAABBIntersection(
  start: THREE.Vector2,
  end: THREE.Vector2,
  left: number,
  right: number,
  bottom: number,
  top: number
): { hit: boolean; t: number; horizontal: boolean } {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  // Handle edge case where line segment has no length
  if (dx === 0 && dy === 0) {
    const inside = start.x >= left && start.x <= right && start.y >= bottom && start.y <= top;
    return { hit: inside, t: 0, horizontal: false };
  }

  const tMinX = dx !== 0 ? (left - start.x) / dx : -Infinity;
  const tMaxX = dx !== 0 ? (right - start.x) / dx : Infinity;
  const tMinY = dy !== 0 ? (bottom - start.y) / dy : -Infinity;
  const tMaxY = dy !== 0 ? (top - start.y) / dy : Infinity;

  const tEnterX = Math.min(tMinX, tMaxX);
  const tExitX = Math.max(tMinX, tMaxX);
  const tEnterY = Math.min(tMinY, tMaxY);
  const tExitY = Math.max(tMinY, tMaxY);

  const tEnter = Math.max(tEnterX, tEnterY);
  const tExit = Math.min(tExitX, tExitY);

  // Check if there's an intersection in the segment [0, 1]
  const hit = tEnter <= tExit && tExit >= 0 && tEnter <= 1;
  const horizontal = tEnterX > tEnterY;

  return { hit, t: tEnter, horizontal };
}

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

export class Ball {
  speed = 1.2; // units per second (was 0.02 per frame at 60fps)
  position = new THREE.Vector2(0, 0);
  prevPosition = new THREE.Vector2(0, 0);
  velocity = new THREE.Vector2(0, 0);

  tick(delta: number) {
    this.prevPosition.copy(this.position);
    this.position.add(tmpv2.copy(this.velocity).multiplyScalar(delta));

    // Continuous collision with walls
    // Check right wall (x = 1)
    if (this.velocity.x > 0 && this.prevPosition.x < 1 && this.position.x >= 1) {
      this.velocity.x = -this.velocity.x;
      this.position.x = 1 - (this.position.x - 1);
    }

    // Check left wall (x = -1)
    if (this.velocity.x < 0 && this.prevPosition.x > -1 && this.position.x <= -1) {
      this.velocity.x = -this.velocity.x;
      this.position.x = -1 - (this.position.x + 1);
    }

    // Check top wall (y = 1)
    if (this.velocity.y > 0 && this.prevPosition.y < 1 && this.position.y >= 1) {
      this.velocity.y = -this.velocity.y;
      this.position.y = 1 - (this.position.y - 1);
    }

    // Check bottom wall (y = -1) - though this is usually handled by oob()
    if (this.velocity.y < 0 && this.prevPosition.y > -1 && this.position.y <= -1) {
      this.velocity.y = -this.velocity.y;
      this.position.y = -1 - (this.position.y + 1);
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
  cols = 20;
  rows = 20;
  bricks: number[][];
  data: Uint8Array;
  dataTexture: THREE.DataTexture;

  constructor() {
    this.bricks = [
      [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
      [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
      [  0,   0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,   0,   0 ],
      [  0,   0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,   0,   0 ],
      [  0,   0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,   0,   0 ],
      [  0,   0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,   0,   0 ],
      [  0,   0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,   0,   0 ],
      [  0,   0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,   0,   0 ],
      [  0,   0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,   0,   0 ],
      [  0,   0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,   0,   0 ],
      [  0,   0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,   0,   0 ],
      [  0,   0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,   0,   0 ],
      [  0,   0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,   0,   0 ],
      [  0,   0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,   0,   0 ],
      [  0,   0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,   0,   0 ],
      [  0,   0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,   0,   0 ],
      [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
      [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
      [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
      [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ]
    ];

    this.data = new Uint8Array(this.rows * this.cols * 4);
    this.update();

    this.dataTexture = new THREE.DataTexture(this.data, this.cols, this.rows, THREE.RGBAFormat);
    this.dataTexture.flipY = true;
    this.dataTexture.needsUpdate = true;
  }

  update() {
    for (let y = 0; y < this.bricks.length; y++) {
      for (let x = 0; x < this.bricks[y].length; x++) {
        this.data.set(
          [
            this.bricks[y][x],
            0, 0, 0
          ],
          (this.bricks[y].length * y + x) * 4
        );
      }
    }
  }

  intersect(ball: Ball): boolean {
    // Brick bounds in -1..1 space
    const bricksBL = { x: -1.0, y: 0.0 };
    const bricksTR = { x: 1.0, y: 1.0 };

    const brickWidth = (bricksTR.x - bricksBL.x) / this.cols;
    const brickHeight = (bricksTR.y - bricksBL.y) / this.rows;

    // Calculate bounding box of the line segment to limit brick checks
    const minX = Math.min(ball.prevPosition.x, ball.position.x);
    const maxX = Math.max(ball.prevPosition.x, ball.position.x);
    const minY = Math.min(ball.prevPosition.y, ball.position.y);
    const maxY = Math.max(ball.prevPosition.y, ball.position.y);

    // Convert bounds to grid coordinates
    const minGridX = Math.max(0, Math.floor(((minX - bricksBL.x) / (bricksTR.x - bricksBL.x)) * this.cols));
    const maxGridX = Math.min(this.cols - 1, Math.floor(((maxX - bricksBL.x) / (bricksTR.x - bricksBL.x)) * this.cols));
    const minGridY = Math.max(0, this.rows - 1 - Math.floor(((maxY - bricksBL.y) / (bricksTR.y - bricksBL.y)) * this.rows));
    const maxGridY = Math.min(this.rows - 1, this.rows - 1 - Math.floor(((minY - bricksBL.y) / (bricksTR.y - bricksBL.y)) * this.rows));

    let closestT = Infinity;
    let hitGridX = -1;
    let hitGridY = -1;
    let hitHorizontal = false;

    // Check all bricks in the path's bounding box
    for (let gridY = minGridY; gridY <= maxGridY; gridY++) {
      for (let gridX = minGridX; gridX <= maxGridX; gridX++) {
        if (this.bricks[gridY][gridX] === 0) continue;

        // Calculate brick boundaries
        const brickLeft = bricksBL.x + gridX * brickWidth;
        const brickRight = brickLeft + brickWidth;
        const brickBottom = bricksTR.y - (gridY + 1) * brickHeight;
        const brickTop = brickBottom + brickHeight;

        const result = lineAABBIntersection(
          ball.prevPosition,
          ball.position,
          brickLeft,
          brickRight,
          brickBottom,
          brickTop
        );

        if (result.hit && result.t < closestT) {
          closestT = result.t;
          hitGridX = gridX;
          hitGridY = gridY;
          hitHorizontal = result.horizontal;
        }
      }
    }

    // If we found a hit, destroy the brick and bounce
    if (hitGridX >= 0) {
      this.bricks[hitGridY][hitGridX] = 0;

      // Update only the specific brick in the texture data (O(1) instead of O(400))
      const index = (this.cols * hitGridY + hitGridX) * 4;
      this.data[index] = 0;
      this.data[index + 1] = 0;
      this.data[index + 2] = 0;
      this.data[index + 3] = 0;

      this.dataTexture.needsUpdate = true;

      // Bounce based on which face was hit
      if (hitHorizontal) {
        ball.velocity.x = -ball.velocity.x;
      } else {
        ball.velocity.y = -ball.velocity.y;
      }

      return true;
    }

    return false;
  }
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
