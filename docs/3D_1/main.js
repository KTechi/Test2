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




  const PI = Math.PI
  const PI2 = 2 * Math.PI
  const W = 600
  const H = 300
  const div = 20
  function isMobile() {
    const regexp = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    return window.navigator.userAgent.search(regexp) !== -1
  }
  context.lineWidth = isMobile() ? 2 : 1
  context.strokeStyle = 'rgb(255, 0, 255, 0.5)'
  for (let x = 0; x <= div; x++) {
    const vtx = [
      [-1.0, Math.sin(PI*0.00 - arg + PI*x/div)],
      [-0.7, Math.sin(PI*0.15 - arg + PI*x/div) * 1.15],
      [-0.3, Math.sin(PI*0.35 - arg + PI*x/div) * 1.15],
      [ 0.0, Math.sin(PI*0.50 - arg + PI*x/div)],
      [ 0.3, Math.sin(PI*0.65 - arg + PI*x/div) * 1.15],
      [ 0.7, Math.sin(PI*0.85 - arg + PI*x/div) * 1.15],
      [ 1.0, Math.sin(PI*1.00 - arg + PI*x/div)],
    ]
    const tmp = []
    for (const v of vtx) {
      tmp.push(qRotation(new Vertex(W*x/div - W/2, W/2*v[0], H/2*v[1]), q))
    }
    if (viewMode === 1)
      for (let i = 0; i < tmp.length; i++) {
        tmp[i].x *= 2*W/(2*W + tmp[i].y)
        tmp[i].z *= 2*W/(2*W + tmp[i].y)
      }
    context.beginPath()
    context.moveTo       (VW/2 + tmp[0].x, VH/2 - tmp[0].z)
    context.bezierCurveTo(VW/2 + tmp[1].x, VH/2 - tmp[1].z,
                          VW/2 + tmp[2].x, VH/2 - tmp[2].z,
                          VW/2 + tmp[3].x, VH/2 - tmp[3].z)
    context.bezierCurveTo(VW/2 + tmp[4].x, VH/2 - tmp[4].z,
                          VW/2 + tmp[5].x, VH/2 - tmp[5].z,
                          VW/2 + tmp[6].x, VH/2 - tmp[6].z)
    context.stroke()
  }
  context.strokeStyle = 'rgb(0, 255, 255, 0.5)'
  for (let x = 0; x <= div; x++) {
    const vtx = [
      [-1.0, Math.sin(PI*0.00 - arg + PI*x/div)],
      [-0.7, Math.sin(PI*0.15 - arg + PI*x/div) * 1.15],
      [-0.3, Math.sin(PI*0.35 - arg + PI*x/div) * 1.15],
      [ 0.0, Math.sin(PI*0.50 - arg + PI*x/div)],
      [ 0.3, Math.sin(PI*0.65 - arg + PI*x/div) * 1.15],
      [ 0.7, Math.sin(PI*0.85 - arg + PI*x/div) * 1.15],
      [ 1.0, Math.sin(PI*1.00 - arg + PI*x/div)],
    ]
    const tmp = []
    for (const v of vtx) {
      tmp.push(qRotation(new Vertex(W/2*v[0], W*x/div - W/2, H/2*v[1]), q))
    }
    if (viewMode === 1)
      for (let i = 0; i < tmp.length; i++) {
        tmp[i].x *= 2*W/(2*W + tmp[i].y)
        tmp[i].z *= 2*W/(2*W + tmp[i].y)
      }
    context.beginPath()
    context.moveTo       (VW/2 + tmp[0].x, VH/2 - tmp[0].z)
    context.bezierCurveTo(VW/2 + tmp[1].x, VH/2 - tmp[1].z,
                          VW/2 + tmp[2].x, VH/2 - tmp[2].z,
                          VW/2 + tmp[3].x, VH/2 - tmp[3].z)
    context.bezierCurveTo(VW/2 + tmp[4].x, VH/2 - tmp[4].z,
                          VW/2 + tmp[5].x, VH/2 - tmp[5].z,
                          VW/2 + tmp[6].x, VH/2 - tmp[6].z)
    context.stroke()
  }




  // Edge
  // context.lineWidth = 2
  // context.strokeStyle = 'rgb(255, 255, 255, 1)'
  // for (const e of edges) paintEdgeR(e, q)
  
  // Vertex
  // context.fillStyle = 'rgb(255, 255, 255, 1)'
  // for (const v of vertices) paintVertex(qRotation(v, q))
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
  console.log('Ready')
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
//     Touch Listener

let touch_x = 0
let touch_y = 0
canvas.addEventListener('touchstart' , touch_Start , false)
canvas.addEventListener('touchend'   , touch_End   , false)
canvas.addEventListener('touchcancel', touch_Cancel, false)
canvas.addEventListener('touchmove'  , touch_Move  , false)
function touch_Start (event) {
  const touches = event.changedTouches
  touch_x = touches[0].pageX
  touch_y = touches[0].pageY
}
function touch_End   (event) {}
function touch_Cancel(event) {}
function touch_Move  (event) {
  event.preventDefault()
  const touches = event.changedTouches
  const new_x = touches[0].pageX
  const new_y = touches[0].pageY
  const dx = new_x - touch_x
  const dy = new_y - touch_y
  touch_x = new_x
  touch_y = new_y

  yaw   = (yaw   + 0.01 * dx) % (2*Math.PI)
  pitch = (pitch + 0.01 * dy)
  if (pitch < -Math.PI / 2) pitch = -Math.PI / 2
  if ( Math.PI / 2 < pitch) pitch =  Math.PI / 2

  paint()
}

// ================================================== [50]
//     Animation

let animation = setInterval(repeat, 80)
setTimeout(stop, 1 * 1000)
function repeat() {
    arg += 0.01
    paint()
}
// function stop() {
//   clearInterval(animation)
//   console.log('Animation STOP')
// }

// ================================================== [50]
//     END
// ================================================== [50]
