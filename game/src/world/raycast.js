/**
 * raycast.js - 2D Raycasting and Visibility Polygon Engine
 * Calculates occlusion, dynamic shadows, and line-of-sight against walls and smoke clouds.
 */

/**
 * Computes intersection between ray (p1->p2) and segment (p3->p4).
 * Returns {x, y, param: t} where t in [0, 1], or null if no intersection.
 */
export function getLineIntersection(p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y) {
  const r_dx = p2x - p1x;
  const r_dy = p2y - p1y;
  const s_dx = p4x - p3x;
  const s_dy = p4y - p3y;

  const denom = r_dx * s_dy - r_dy * s_dx;
  if (Math.abs(denom) < 1e-8) return null;

  const dx = p3x - p1x;
  const dy = p3y - p1y;

  const t = (dx * s_dy - dy * s_dx) / denom;
  const u = (dx * r_dy - dy * r_dx) / denom;

  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return {
      x: p1x + t * r_dx,
      y: p1y + t * r_dy,
      t: t
    };
  }
  return null;
}

/**
 * Checks whether there is unobstructed line of sight between two points.
 * Occluded by wall segments or dense smoke clouds.
 */
export function hasLineOfSight(x1, y1, x2, y2, wallSegments, smokeClouds = []) {
  // Check walls
  for (let i = 0; i < wallSegments.length; i++) {
    const s = wallSegments[i];
    const hit = getLineIntersection(x1, y1, x2, y2, s.x1, s.y1, s.x2, s.y2);
    if (hit && hit.t > 0.001 && hit.t < 0.999) {
      return false;
    }
  }

  // Check smoke clouds (treated as circular occluders)
  for (let i = 0; i < smokeClouds.length; i++) {
    const sc = smokeClouds[i];
    if (!sc.active || sc.radius <= 0) continue;
    // Distance from smoke center to segment (x1,y1)-(x2,y2)
    const dist = distToSegment(sc.x, sc.y, x1, y1, x2, y2);
    if (dist < sc.radius * 0.85) {
      return false;
    }
  }

  return true;
}

/**
 * Shortest distance from point (px, py) to line segment (x1, y1)-(x2, y2).
 */
export function distToSegment(px, py, x1, y1, x2, y2) {
  const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
}

/**
 * Builds a 2D visibility polygon from origin (ox, oy) within a max radius and optional FOV cone.
 * Used for dynamic lighting shadows, guard vision cones, and security camera beams.
 */
export function buildVisibilityPolygon(ox, oy, maxRadius, wallSegments, facingAngle = null, fovAngle = null, smokeClouds = []) {
  const angles = [];
  const hasFOV = facingAngle !== null && fovAngle !== null;
  const halfFov = hasFOV ? fovAngle * 0.5 : Math.PI;

  // Add boundary angles if FOV is constrained
  if (hasFOV) {
    angles.push(facingAngle - halfFov);
    angles.push(facingAngle + halfFov);
  }

  // Collect candidate angles from segment endpoints
  for (let i = 0; i < wallSegments.length; i++) {
    const s = wallSegments[i];
    const pts = [{ x: s.x1, y: s.y1 }, { x: s.x2, y: s.y2 }];
    for (let p = 0; p < 2; p++) {
      const dx = pts[p].x - ox;
      const dy = pts[p].y - oy;
      const dist = Math.hypot(dx, dy);
      if (dist > maxRadius * 1.5) continue;
      const baseAngle = Math.atan2(dy, dx);

      if (hasFOV) {
        let diff = (baseAngle - facingAngle + Math.PI * 3) % (Math.PI * 2) - Math.PI;
        if (Math.abs(diff) > halfFov + 0.1) continue;
      }

      angles.push(baseAngle - 0.0005);
      angles.push(baseAngle);
      angles.push(baseAngle + 0.0005);
    }
  }

  // Uniform sampling for smooth circular curvature
  const sampleSteps = hasFOV ? 16 : 32;
  const minA = hasFOV ? facingAngle - halfFov : -Math.PI;
  const maxA = hasFOV ? facingAngle + halfFov : Math.PI;
  for (let s = 0; s <= sampleSteps; s++) {
    angles.push(minA + (maxA - minA) * (s / sampleSteps));
  }

  // Normalize angles into [-PI, PI] relative to facing if FOV is active
  const rays = [];
  for (let a of angles) {
    if (hasFOV) {
      let diff = (a - facingAngle + Math.PI * 3) % (Math.PI * 2) - Math.PI;
      if (diff < -halfFov) a = facingAngle - halfFov;
      if (diff > halfFov) a = facingAngle + halfFov;
    }

    const targetX = ox + Math.cos(a) * maxRadius;
    const targetY = oy + Math.sin(a) * maxRadius;

    let closestHit = { x: targetX, y: targetY, dist: maxRadius, angle: a };

    for (let i = 0; i < wallSegments.length; i++) {
      const s = wallSegments[i];
      const hit = getLineIntersection(ox, oy, targetX, targetY, s.x1, s.y1, s.x2, s.y2);
      if (hit) {
        const d = hit.t * maxRadius;
        if (d < closestHit.dist) {
          closestHit = { x: hit.x, y: hit.y, dist: d, angle: a };
        }
      }
    }

    // Check smoke clouds clipping
    for (let sc of smokeClouds) {
      if (!sc.active || sc.radius <= 0) continue;
      const dToCloud = distToSegment(sc.x, sc.y, ox, oy, closestHit.x, closestHit.y);
      if (dToCloud < sc.radius) {
        // approximate ray entry into cloud
        const toCx = sc.x - ox;
        const toCy = sc.y - oy;
        const proj = (toCx * Math.cos(a) + toCy * Math.sin(a));
        if (proj > 0 && proj < closestHit.dist) {
          const entryDist = Math.max(10, proj - sc.radius);
          if (entryDist < closestHit.dist) {
            closestHit = {
              x: ox + Math.cos(a) * entryDist,
              y: oy + Math.sin(a) * entryDist,
              dist: entryDist,
              angle: a
            };
          }
        }
      }
    }

    rays.push(closestHit);
  }

  // Sort rays by relative angle
  rays.sort((r1, r2) => {
    let a1 = hasFOV ? ((r1.angle - facingAngle + Math.PI * 3) % (Math.PI * 2) - Math.PI) : r1.angle;
    let a2 = hasFOV ? ((r2.angle - facingAngle + Math.PI * 3) % (Math.PI * 2) - Math.PI) : r2.angle;
    return a1 - a2;
  });

  return rays;
}
