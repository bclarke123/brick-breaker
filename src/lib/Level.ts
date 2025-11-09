import * as THREE from "three";

import { lineAABBIntersection } from "./utils";

export class Level {
  cols = 20;
  rows = 20;
  bricks: number[][];
  brickTypes: number[][];
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

    this.brickTypes = [
      [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
      [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
      [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
      [  0,   0,   0,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   0,   0,   0 ],
      [  0,   0,   0,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   0,   0,   0 ],
      [  0,   0,   0,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   0,   0,   0 ],
      [  0,   0,   0,   1,   1,   1,   1,   2,   2,   2,   2,   2,   2,   1,   1,   1,   1,   0,   0,   0 ],
      [  0,   0,   0,   1,   1,   1,   1,   2,   2,   2,   2,   2,   2,   1,   1,   1,   1,   0,   0,   0 ],
      [  0,   0,   0,   1,   1,   1,   1,   2,   2,   3,   3,   2,   2,   1,   1,   1,   1,   0,   0,   0 ],
      [  0,   0,   0,   1,   1,   1,   1,   2,   2,   3,   3,   2,   2,   1,   1,   1,   1,   0,   0,   0 ],
      [  0,   0,   0,   1,   1,   1,   1,   2,   2,   2,   2,   2,   2,   1,   1,   1,   1,   0,   0,   0 ],
      [  0,   0,   0,   1,   1,   1,   1,   2,   2,   2,   2,   2,   2,   1,   1,   1,   1,   0,   0,   0 ],
      [  0,   0,   0,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   0,   0,   0 ],
      [  0,   0,   0,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   0,   0,   0 ],
      [  0,   0,   0,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   0,   0,   0 ],
      [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
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
            this.brickTypes[y][x],
            0, 0
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
