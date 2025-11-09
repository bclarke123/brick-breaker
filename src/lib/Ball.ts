import * as THREE from "three";

const tmpv2 = new THREE.Vector2();

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
