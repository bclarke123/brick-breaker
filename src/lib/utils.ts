// Helper for line-segment vs AABB collision (continuous collision detection)
export function lineAABBIntersection(
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
