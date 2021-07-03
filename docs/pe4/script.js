// ================================================== [50]
//     Definition

class Vertex {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}
class Edge {
  constructor(u, v) {
    this.u = u
    this.v = v
  }
}
class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  normalize() {
    const r = Math.sqrt(this.x**2 + this.y**2)
    if (r == 0) return
    this.x /= r
    this.y /= r
  }
  rotate(angle) {
    const x = Math.cos(angle)
    const y = Math.sin(angle)
    const thisX = this.x
    const thisY = this.y
    this.x = x*thisX - y*thisY
    this.y = x*thisY + y*thisX
  }
}

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
let VW = window.innerWidth
let VH = window.innerHeight

const ship = new Vertex(200, 200)
let angle = 0
let f = new Vector(0, 0) // 力
let v = new Vector(0, 0) // 速度
let t = 0 // トルク
let w = 0 // 角速度
let main_fuel = 1
let sub_fuel  = 1
let scale = 1

function isMobile() {
  const regexp = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  return window.navigator.userAgent.search(regexp) !== -1
}
function paint() {
  context.clearRect(0, 0, VW, VH)
  
  // Thruster
  const thruster = [
    new Vector(-50,  40),
    new Vector(-50, -40),
    new Vector(-40, -50),
    new Vector( 40, -50),
    new Vector( 50, -40),
    new Vector( 50,  40),
  ]
  context.fillStyle = 'rgb(255, 255, 255, 1)'
  for (let i = 0; i < thruster.length; i++) {
    thruster[i].rotate(angle)
    thruster[i].x += ship.x
    thruster[i].y += ship.y
    paintVertex(thruster[i])
  }
  // Gas
  const gas = [
    // 1
    new Vector(-90,  40),
    new Vector(-90,  50),
    new Vector(-90,  30),
    // 2
    new Vector(-90, -40),
    new Vector(-90, -30),
    new Vector(-90, -50),
    // 3
    new Vector(-40, -90),
    new Vector(-50, -90),
    new Vector(-30, -90),
    // 4
    new Vector( 40, -90),
    new Vector( 30, -90),
    new Vector( 50, -90),
    // 5
    new Vector( 90, -40),
    new Vector( 90, -50),
    new Vector( 90, -30),
    // 6
    new Vector( 90,  40),
    new Vector( 90,  30),
    new Vector( 90,  50),
  ]
  for (let i = 0; i < gas.length; i++) {
    gas[i].rotate(angle)
    gas[i].x += ship.x
    gas[i].y += ship.y
//    paintVertex(gas[i])
  }
  for (let i = 0; i < 6; i++) {
    if (i == 0 && !key_1) continue
    if (i == 1 && !key_2) continue
    if (i == 2 && !key_3) continue
    if (i == 3 && !key_4) continue
    if (i == 4 && !key_5) continue
    if (i == 5 && !key_6) continue
    
    const v0 = gas[i*3 + 0]
    const v1 = gas[i*3 + 1]
    const v2 = gas[i*3 + 2]
    const gradient = context.createLinearGradient(
      thruster[i].x, thruster[i].y, v0.x, v0.y
    )
    gradient.addColorStop(0, 'rgb(255, 255, 255, 1)')
    gradient.addColorStop(0.5, 'rgb(255, 255, 255, 0.3)')
    gradient.addColorStop(1, 'rgb(255, 255, 255, 0)')
    context.fillStyle = gradient
    context.beginPath()
    context.moveTo(thruster[i].x, thruster[i].y)
    context.lineTo(v1.x, v1.y)
    context.lineTo(v2.x, v2.y)
    context.fill()
  }
  
  // Body
  const v = [ // Vertices
    // Body
    new Vector(-50,  50),
    new Vector(-50, -50),
    new Vector( 50, -50),
    new Vector( 50,  50),
    // Engine
    new Vector(-25,  50),
    new Vector(-50, 100),
    new Vector( 50, 100),
    new Vector( 25,  50),
    // Rod
    new Vector(  0, -50),
    new Vector(  0,-100),
  ]
  const e = [ // Edges
    // Body
    new Edge(v[0], v[1]),
    new Edge(v[1], v[2]),
    new Edge(v[2], v[3]),
    new Edge(v[3], v[0]),
    // Engine
    new Edge(v[4], v[5]),
    new Edge(v[5], v[6]),
    new Edge(v[6], v[7]),
    new Edge(v[7], v[4]),
    // Rod
    new Edge(v[8], v[9]),
  ]
  for (let i = 0; i < v.length; i++) {
    v[i].rotate(angle)
    v[i].x += ship.x
    v[i].y += ship.y
  }
  context.fillStyle = 'rgb(0, 0, 0, 1)'
  context.beginPath()
  context.moveTo(v[0].x, v[0].y)
  context.lineTo(v[1].x, v[1].y)
  context.lineTo(v[2].x, v[2].y)
  context.lineTo(v[3].x, v[3].y)
  context.fill()
  context.fillStyle = 'rgb(0, 255, 0, 0.75)'
  paintVertex(ship)
  // Body frame
  context.lineWidth = 2
  context.strokeStyle = 'rgb(255, 255, 255, 1)'
  for (let i = 0; i < e.length; i++) paintEdge(e[i])
  
  // Main fire
  const fire = [
    new Vector(  0, 100),
    new Vector(-25, 100),
    new Vector(-40, 140),
    new Vector(  0, 200),
    new Vector( 40, 140),
    new Vector( 25, 100),
  ]
  for (let i = 0; i < fire.length; i++) {
    fire[i].rotate(angle)
    fire[i].x += ship.x
    fire[i].y += ship.y
  }
  const gradient = context.createLinearGradient(
    fire[0].x, fire[0].y, fire[3].x, fire[3].y
  )
  gradient.addColorStop(0  , 'rgb(255, 255, 255, 0.6)')
  gradient.addColorStop(0.5, 'rgb(255, 255, 255, 0.2)')
  gradient.addColorStop(1  , 'rgb(255, 255, 255, 0  )')
  context.fillStyle = gradient
  context.beginPath()
  context.moveTo(fire[1].x, fire[1].y)
  context.quadraticCurveTo(fire[2].x, fire[2].y, fire[3].x, fire[3].y)
  context.quadraticCurveTo(fire[4].x, fire[4].y, fire[5].x, fire[5].y)
  if (key_0) context.fill()
  
  // Fuel
  context.lineWidth = 10
  context.strokeStyle = 'rgb(255, 255, 255, 1)'
  context.beginPath()
  context.arc(ship.x, ship.y, 35,
              angle - 0.5*Math.PI,
              angle - 0.5*Math.PI + 2*Math.PI*sub_fuel, false)
  context.stroke()
  context.beginPath()
  context.arc(ship.x, ship.y, 25.4,
              angle - 0.5*Math.PI,
              angle - 0.5*Math.PI + 2*Math.PI*main_fuel, false)
  context.stroke()
  
  // Goal
  context.lineWidth = 2
  context.strokeStyle = 'rgb(0, 255, 0, 1)'
  context.beginPath()
  context.arc(goal.x, goal.y, 5, 0, 2 * Math.PI, true)
  context.stroke()
  
  const rod_goal = new Vector(0, -100)
  rod_goal.rotate(goal_ang)
  rod_goal.x += goal.x
  rod_goal.y += goal.y
  context.strokeStyle = 'rgb(255, 0, 255, 1)'
  context.beginPath()
  context.arc(rod_goal.x, rod_goal.y, 5, 0, 2 * Math.PI, true)
  context.stroke()
  
  // Guide
  if (guide) {
    context.lineWidth = 2
    context.strokeStyle = 'rgb(0, 255, 0, 1)'
    paintEdge(new Edge(ship, goal))
  }
}
function paintArc(x, y) {
  context.beginPath()
  context.arc(x, y, 5, 0, 2 * Math.PI, true)
  context.fill()
}
function paintVertex(v) {
  paintArc(v.x, v.y)
}
function paintLine(x1, y1, x2, y2) {
  context.beginPath()
  context.moveTo(x1, y1)
  context.lineTo(x2, y2)
  context.stroke()
}
function paintEdge(e) {
  paintLine(e.u.x, e.u.y, e.v.x, e.v.y)
}

// ================================================== [50]
//     Window

window.onload = load
window.onresize = resize

function load() {
  if (isMobile()) {
    scale = 0.5
    const body = document.querySelector('body')
    const w = document.createElement('div')
    const a = document.createElement('div')
    const d = document.createElement('div')
    const s = document.createElement('div')
    body.appendChild(w)
    body.appendChild(a)
    body.appendChild(d)
    body.appendChild(s)
    w.addEventListener('touchstart', function(e) {
      key_W = true
      e.preventDefault()
    }, false)
    w.addEventListener('touchend'  , function() { key_W = false }, false)
    a.addEventListener('touchstart', function(e) {
      key_A = true
      e.preventDefault()
    }, false)
    a.addEventListener('touchend'  , function() { key_A = false }, false)
    d.addEventListener('touchstart', function(e) {
      key_D = true
      e.preventDefault()
    }, false)
    d.addEventListener('touchend'  , function() { key_D = false }, false)
    s.addEventListener('touchstart', function(e) {
      key_S = true
      e.preventDefault()
    }, false)
    s.addEventListener('touchend'  , function() { key_S = false }, false)
  }
  resize()
}
function resize() {
  VW = scale * window.innerWidth
  VH = scale * window.innerHeight
  canvas.width  = VW
  canvas.height = VH
  paint()
}

// ================================================== [50]
//     Key Listener

let key_1 = false
let key_2 = false
let key_3 = false
let key_4 = false
let key_5 = false
let key_6 = false
let key_0 = false
let count = 0
let goal = new Vertex(300, 300)
let goal_ang = 0
let guide = false

document.addEventListener('keypress', key_Press, false)
document.addEventListener('keydown' , key_Down , false)
document.addEventListener('keyup'   , key_Up   , false)

function key_Press(event) {
  switch (event.key) {
    case 'ArrowUp'   : console.log('Arrow Up');    break
    case 'ArrowDown' : console.log('Arrow Down');  break
    case 'ArrowLeft' : console.log('Arrow Left');  break
    case 'ArrowRight': console.log('Arrow Right'); break
    case ' ': console.log('Space'); break
    case 'g': guide = !guide; break
  }
  event.preventDefault()
}
function key_Down(event) {
  switch (event.key) {
    case 'q': key_1 = true; break
    case 'w': key_2 = true; break
    case 'e': key_3 = true; break
    case 'r': key_4 = true; break
    case 't': key_5 = true; break
    case 'y': key_6 = true; break
    case ' ': key_0 = true; break
    
    case 'z': key_1 = true; break
    case 'a': key_2 = true; break
    case 's': key_3 = true; break
    case 'd': key_4 = true; break
    case 'f': key_5 = true; break
    case 'v': key_6 = true; break
  }
}
function key_Up(event) {
  switch (event.key) {
    case 'q': key_1 = false; break
    case 'w': key_2 = false; break
    case 'e': key_3 = false; break
    case 'r': key_4 = false; break
    case 't': key_5 = false; break
    case 'y': key_6 = false; break
    case ' ': key_0 = false; break
    
    case 'z': key_1 = false; break
    case 'a': key_2 = false; break
    case 's': key_3 = false; break
    case 'd': key_4 = false; break
    case 'f': key_5 = false; break
    case 'v': key_6 = false; break
  }
}

let anime = setInterval(time, 50)
function time() {
  if (main_fuel <= 0) {
    main_fuel = 0
    key_0 = false
  }
  if (sub_fuel <= 0) {
    sub_fuel = 0
    key_1 = false
    key_2 = false
    key_3 = false
    key_4 = false
    key_5 = false
    key_6 = false
  }
  f.x = 0
  f.y = 0
  t   = 0
  if (key_1) { f.x += 1; t -= 1; sub_fuel -= 0.0002 }
  if (key_2) { f.x += 1; t += 1; sub_fuel -= 0.0002 }
  if (key_3) { f.y += 1; t -= 1; sub_fuel -= 0.0002 }
  if (key_4) { f.y += 1; t += 1; sub_fuel -= 0.0002 }
  if (key_5) { f.x -= 1; t -= 1; sub_fuel -= 0.0002 }
  if (key_6) { f.x -= 1; t += 1; sub_fuel -= 0.0002 }
  f.x *= 0.005
  f.y *= 0.005
  t   *= 0.005
  
  if (key_0) {
    f.y -= 0.03
    main_fuel -= 0.0008
  }
  
  f.rotate(angle)
  v.x += f.x / 1
  v.y += f.y / 1
  w   += t / 100
  
  ship.x += v.x
  ship.y += v.y
  angle  += w
  
  const rod = new Vector(0, -100)
  rod.rotate(angle)
  rod.x += ship.x
  rod.y += ship.y
  
  const rod_goal = new Vector(0, -100)
  rod_goal.rotate(goal_ang)
  rod_goal.x += goal.x
  rod_goal.y += goal.y
  
  if (Math.sqrt((goal.x - ship.x)**2 +
                (goal.y - ship.y)**2) <= 5 &&
      Math.sqrt((rod_goal.x - rod.x)**2 +
                (rod_goal.y - rod.y)**2) <= 5) {
    main_fuel += 0.003
    sub_fuel += 0.003
    
    if (1 < main_fuel && 1 < sub_fuel) {
      count += 1
      console.log('check', count)
      main_fuel = 1
      sub_fuel  = 1
      goal.x = (VW - 200) * Math.random() + 100
      goal.y = (VH - 200) * Math.random() + 100
      goal_ang = 2 * Math.PI * Math.random()
    }
  }
  
  paint()
}

// ================================================== [50]
//     Cancel Listener

canvas.addEventListener('click', function(e) { e.preventDefault() }, false)
canvas.addEventListener('dblclick', function(e) { e.preventDefault() }, false)
