// ================================================== [50]
//     Definition

'use strict'

// Quaternion
function qMultiply(p, q) {
  return new Quaternion(p.w*q.w - p.x*q.x - p.y*q.y - p.z*q.z,
                        p.w*q.x + p.x*q.w + p.y*q.z - p.z*q.y,
                        p.w*q.y - p.x*q.z + p.y*q.w + p.z*q.x,
                        p.w*q.z + p.x*q.y - p.y*q.x + p.z*q.w)
}
function qRotation(targetVertex, rotationQuaternion) {
  const p = new Quaternion(targetVertex) // Target Quaternion
  const q = rotationQuaternion
  const q_ = q.conjugate()
  return qMultiply(qMultiply(q, p), q_)
}

// Vector
function genVector(from, to) {
  return new Vector(to.x - from.x,
                    to.y - from.y,
                    to.z - from.z)
}
function distance(u, v) {
  return Math.sqrt((u.x - v.x)**2 +
                   (u.y - v.y)**2 +
                   (u.z - v.z)**2  )
}
function innerProduct(u, v) {
  return (u.x*v.x +
          u.y*v.y +
          u.z*v.z  )
}
function crossProduct(u, v) {
  return new Vector(u.y*v.z - u.z*v.y,
                    u.z*v.x - u.x*v.z,
                    u.x*v.y - u.y*v.x)
}
function add(a, u, b, v) {
  return new Vector(a*u.x + b*v.x,
                    a*u.y + b*v.y,
                    a*u.z + b*v.z)
}
function world(offset, a, v) {
  return new Vertex(offset.x + a*v.x,
                    offset.y + a*v.y,
                    offset.z + a*v.z)
}
function world2V(offset, a, u, b, v) {
  return world(offset, 1, add(a, u, b, v))
}

// ================================================== [50]
//     END
// ================================================== [50]