/**
 * raycast.js - 2D Raycasting, Visibility Polygon & Dynamic Shadow Engine
 * Calculates ray-segment intersections, occlusion from walls and furniture obstacles,
 * and builds smooth visibility polygons for guard flashlights, cameras, and shadows.
 */

/**
 * Computes intersection between ray (p1->p2) and segment (p3->p4).
 * Returns {x, y, t} where t in [0, 1], or null if no intersection.
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
 * Converts solid furniture obstacles (pillars, plinths, server racks, desks, vitrines)
 * into 4-sided opaque bounding segments for dynamic shadow casting and vision occlusion.
 */
export function getFurnitureOccluderSegments(furnitureList = []) {
  const segments = [];
  for (let i = 0; i < furnitureList.length; i++) {
    const item = furnitureList[i];
    // All solid physical obstacles cast shadows
    if (
      item.type === 'column' ||
      item.type === 'plinth' ||
      item.type === 'server' ||
      item.type === 'desk' ||
      item.type === 'vitrine' ||
      item.type === 'loot_pedestal'
    ) {
      const x1 = item.x;
      const y1 = item.y;
      const x2 = item.x + item.w;
      const y2 = item.y + item.h;

      segments.push({ x1: x1, y1: y1, x2: x2, y2: y1 });
      segments.push({ x1: x2, y1: y1, x2: x2, y2: y2 });
      segments.push({ x1: x2, y1: y2, x2: x1, y2: y2 });
      segments.push({ x1: x1, y1: y2, x2: x1, y2: y1 });
    }
  }
  return segments;
}

/**
 * Checks whether there is unobstructed line of sight between two points.
 * Occluded by wall segments, solid furniture obstacles, or dense smoke clouds.
 */
export function hasLineOfSight(x1, y1, x2, y2, wallSegments, smokeClouds = [], furnitureSegments = []) {
  // 1. Check architectural walls
  for (let i = 0; i < wallSegments.length; i++) {
    const s = wallSegments[i];
    const hit = getLineIntersection(x1, y1, x2, y2, s.x1, s.y1, s.x2, s.y2);
    if (hit && hit.t > 0.002 && hit.t < 0.998) {
      return false;
    }
  }

  // 2. Check solid furniture obstacles
  for (let i = 0; i < furnitureSegments.length; i++) {
    const s = furnitureSegments[i];
    const hit = getLineIntersection(x1, y1, x2, y2, s.x1, s.y1, s.x2, s.y2);
    if (hit && hit.t > 0.002 && hit.t < 0.998) {
      return false;
    }
  }

  // 3. Check smoke clouds (dense circular occluders)
  for (let i = 0; i < smokeClouds.length; i++) {
    const sc = smokeClouds[i];
    if (!sc.active || sc.radius <= 0) continue;
    const dist = distToSegment(sc.x, sc.y, x1, y1, x2, y2);
    if (dist < sc.radius * 0.82) {
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
 * Combines walls and furniture occluders, solving endpoint collinearity issues.
 */
export function buildVisibilityPolygon(
  ox,
  oy,
  maxRadius,
  wallSegments,
  facingAngle = null,
  fovAngle = null,
  smokeClouds = [],
  furnitureSegments = []
) {
  // Combine all occluding geometry
  const allSegments = furnitureSegments.length > 0
    ? wallSegments.concat(furnitureSegments)
    : wallSegments;

  const hasFOV = facingAngle !== null && fovAngle !== null;
  const halfFov = hasFOV ? fovAngle * 0.5 : Math.PI;

  const rawAngles = [];

  // Add boundary cone limit angles if FOV is constrained
  if (hasFOV) {
    rawAngles.push(facingAngle - halfFov);
    rawAngles.push(facingAngle + halfFov);
  }

  // Collect candidate angles from segment endpoints
  for (let i = 0; i < allSegments.length; i++) {
    const s = allSegments[i];
    const pts = [{ x: s.x1, y: s.y1 }, { x: s.x2, y: s.y2 }];
    for (let p = 0; p < 2; p++) {
      const dx = pts[p].x - ox;
      const dy = pts[p].y - oy;
      const dist = Math.hypot(dx, dy);
      if (dist > maxRadius * 1.45 || dist < 1.0) continue;
      const baseAngle = Math.atan2(dy, dx);

      if (hasFOV) {
        let diff = (baseAngle - facingAngle + Math.PI * 3) % (Math.PI * 2) - Math.PI;
        if (Math.abs(diff) > halfFov + 0.05) continue;
      }

      // Slightly offset rays to detect corners cleanly without bleeding through edges
      rawAngles.push(baseAngle - 0.0002);
      rawAngles.push(baseAngle);
      rawAngles.push(baseAngle + 0.0002);
    }
  }

  // Uniform sampling for smooth circular perimeter
  const sampleSteps = hasFOV ? 24 : 48;
  const minA = hasFOV ? facingAngle - halfFov : -Math.PI;
  const maxA = hasFOV ? facingAngle + halfFov : Math.PI;
  for (let s = 0; s <= sampleSteps; s++) {
    rawAngles.push(minA + (maxA - minA) * (s / sampleSteps));
  }

  // Normalize and cast rays
  const rays = [];
  for (let i = 0; i < rawAngles.length; i++) {
    let a = rawAngles[i];
    if (hasFOV) {
      let diff = (a - facingAngle + Math.PI * 3) % (Math.PI * 2) - Math.PI;
      if (diff < -halfFov) a = facingAngle - halfFov;
      if (diff > halfFov) a = facingAngle + halfFov;
    }

    const cosA = Math.cos(a);
    const sinA = Math.sin(a);
    const targetX = ox + cosA * maxRadius;
    const targetY = oy + sinA * maxRadius;

    let closestHit = { x: targetX, y: targetY, dist: maxRadius, angle: a };

    for (let j = 0; j < allSegments.length; j++) {
      const s = allSegments[j];
      const hit = getLineIntersection(ox, oy, targetX, targetY, s.x1, s.y1, s.x2, s.y2);
      if (hit) {
        const d = hit.t * maxRadius;
        if (d < closestHit.dist) {
          closestHit = { x: hit.x, y: hit.y, dist: d, angle: a };
        }
      }
    }

    // Clip against dense smoke clouds
    for (let k = 0; k < smokeClouds.length; k++) {
      const sc = smokeClouds[k];
      if (!sc.active || sc.radius <= 0) continue;
      const dToCloud = distToSegment(sc.x, sc.y, ox, oy, closestHit.x, closestHit.y);
      if (dToCloud < sc.radius) {
        const toCx = sc.x - ox;
        const toCy = sc.y - oy;
        const proj = (toCx * cosA + toCy * sinA);
        if (proj > 0 && proj < closestHit.dist) {
          const entryDist = Math.max(10, proj - sc.radius);
          if (entryDist < closestHit.dist) {
            closestHit = {
              x: ox + cosA * entryDist,
              y: oy + sinA * entryDist,
              dist: entryDist,
              angle: a
            };
          }
        }
      }
    }

    rays.push(closestHit);
  }

  // Sort rays by relative angle using standard angle difference
  rays.sort((r1, r2) => {
    let a1 = hasFOV ? ((r1.angle - facingAngle + Math.PI * 3) % (Math.PI * 2) - Math.PI) : r1.angle;
    let a2 = hasFOV ? ((r2.angle - facingAngle + Math.PI * 3) % (Math.PI * 2) - Math.PI) : r2.angle;
    if (Math.abs(a1 - a2) < 1e-7) {
      return r1.dist - r2.dist;
    }
    return a1 - a2;
  });

  return rays;
}
