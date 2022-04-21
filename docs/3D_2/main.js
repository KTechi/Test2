// ================================================== [50]
//     Definition

'use strict'

function paint() {
  context.clearRect(0, 0, VW, VH)
  imageData = context.getImageData(0, 0, VW, VH)
  data = imageData.data
  
  // Quaternion
  const q_p = new Quaternion(pitch, new Vector(1, 0, 0))
  const q_r = new Quaternion(roll , new Vector(0, 1, 0))
  const q_y = new Quaternion(yaw  , new Vector(0, 0, 1))
  const q = qMultiply(qMultiply(q_r, q_p), q_y)
  
  // Axis
  // context.lineWidth = 2
  // context.strokeStyle = 'rgb(255, 0, 0, 1)'
  // context.fillStyle   = 'rgb(255, 0, 0, 1)'
  // paintEdgeR(axisX, q)
  // paintVertexR(axisX.v, q)
  // context.strokeStyle = 'rgb(0, 255, 0, 1)'
  // context.fillStyle   = 'rgb(0, 255, 0, 1)'
  // paintEdgeR(axisY, q)
  // paintVertexR(axisY.v, q)
  // context.strokeStyle = 'rgb(0, 127, 255, 1)'
  // context.fillStyle   = 'rgb(0, 127, 255, 1)'
  // paintEdgeR(axisZ, q)
  // paintVertexR(axisZ.v, q)
  
  // Edge
  context.lineWidth = 1.5
  for (const e of edges) {
    const y = (qRotation(e.u, q).y + qRotation(e.v, q).y) / 2
    if (0 < y) continue
    context.strokeStyle = 'rgb(255, 255, 255, ' + (-y/R) + ')'
    paintEdgeR(e, q)
  }
  
  // Vertex
  // context.fillStyle = 'rgb(255, 255, 255, 1)'
  // for (const v of vertices) paintVertexR(v, q)
}
function paintVertex(v) {
  context.beginPath()
  context.arc(VW/2 + v.x, VH/2 - v.z, 3, 0, 2*Math.PI, true)
  context.fill()
}
function paintVertexR(v, q) {
  paintVertex(qRotation(v, q))
}
function paintEdge(e) {
  context.beginPath()
  context.moveTo(VW/2 + e.u.x, VH/2 - e.u.z)
  context.lineTo(VW/2 + e.v.x, VH/2 - e.v.z)
  context.stroke()
}
function paintEdgeR(e, q) {
  paintEdge(new Edge(qRotation(e.u, q),
                     qRotation(e.v, q)))
}

// ================================================== [50]
//     Window

window.onload = load
window.onresize = resize
function load() {
  document.body.append(canvas)
  resize()
}
function resize() {
  VW = parseInt(scale * canvas.clientWidth)
  VH = parseInt(scale * canvas.clientHeight)
  canvas.width  = VW
  canvas.height = VH
  paint()
}

// ================================================== [50]
//     Mouse Event

//canvas.addEventListener('click'    , mouse_Click   , false)
//canvas.addEventListener('dblclick' , mouse_DBLClick, false)
//canvas.addEventListener('mousedown', mouse_Down    , false)
//canvas.addEventListener('mouseup'  , mouse_Up      , false)
function mouse_Click   (event) {
  console.log('Mouse Click:', event.button)
}
function mouse_DBLClick(event) {
  if (document.pointerLockElement === null)
    canvas.requestPointerLock()
  else
    document.exitPointerLock()
}
function mouse_Down    (event) {}
function mouse_Up      (event) {}

// ====

//canvas.addEventListener('mouseenter' , mouse_Enter, false)
//canvas.addEventListener('mouseleave' , mouse_Leave, false)
//canvas.addEventListener('mouseover'  , mouse_Over , false)
//canvas.addEventListener('mouseout'   , mouse_Out  , false)
//canvas.addEventListener('contextmenu', contextMenu, false)
function mouse_Enter(event) {}
function mouse_Leave(event) {}
function mouse_Over (event) {}
function mouse_Out  (event) {}
function contextMenu(event) {}

// ====

//canvas.addEventListener('mousemove', mouse_Move, false)
function mouse_Move(event) {
  if (document.pointerLockElement === canvas) {
    console.log(event.movementX, event.movementY)
  }
  
  if (event.buttons === 1) {
    console.log('drag')
  }
}

// ================================================== [50]
//     Scroll Listener

document.addEventListener('mousewheel', mouse_Wheel, { passive: false })
function mouse_Wheel(event) {
  // Disable scroll event
  event.preventDefault()
  
  yaw   = (yaw   - 0.01 * event.deltaX) % (2*Math.PI)
  pitch = (pitch - 0.01 * event.deltaY)
  if (pitch < -Math.PI / 2) pitch = -Math.PI / 2
  if ( Math.PI / 2 < pitch) pitch =  Math.PI / 2
  
  paint()
}

// ================================================== [50]
//     Animation

// let animation = setInterval(repeat, 100)
// setTimeout(stop, 1 * 1000)
// function repeat() {
//   console.log('Animation')
// }
// function stop() {
//   clearInterval(animation)
//   console.log('Animation STOP')
// }
console.log('Ready')

// ================================================== [50]
//     END
// ================================================== [50]