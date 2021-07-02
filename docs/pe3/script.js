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
}

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
let VW = window.innerWidth
let VH = window.innerHeight
let vertices = [
  new Vertex(100, 100),
  new Vertex(200, 100),
  new Vertex(200, 200),
  new Vertex(100, 200),
  new Vertex(250, 150),
]
let edges = [
  new Edge(vertices[0], vertices[1]),
  new Edge(vertices[1], vertices[2]),
  new Edge(vertices[2], vertices[3]),
  new Edge(vertices[3], vertices[0]),
]
let f = new Vector(0, 0)
let v = new Vector(0, 0)
let fuel = 1
let scale = 1

function isMobile(){
  const regexp = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  return window.navigator.userAgent.search(regexp) !== -1
}
function paint() {
  context.clearRect(0, 0, VW, VH)
  
  context.lineWidth = 2
  context.strokeStyle = 'rgb(255, 255, 255, 1)'
  for (let i = 0; i < edges.length; i++) paintE(edges[i])
  
  // fuel
  const x1 = vertices[3].x
  const x2 = vertices[2].x
  const y1 = vertices[3].y
  const y2 = vertices[3].y - fuel*(vertices[2].y - vertices[1].y)
  context.fillStyle = 'rgb(255, 255, 255, 0.3)'
  context.beginPath()
  context.moveTo(x1, y1)
  context.lineTo(x1, y2)
  context.lineTo(x2, y2)
  context.lineTo(x2, y1)
  context.closePath()
  context.fill()
  
  // engine
  context.fillStyle = 'rgb(255, 255, 255, '+(key_W?1:0.5)+')'
  paintV(new Vertex(0.5*(vertices[0].x + vertices[1].x),
                    0.5*(vertices[0].y + vertices[1].y)))
  context.fillStyle = 'rgb(255, 255, 255, '+(key_D?1:0.5)+')'
  paintV(new Vertex(0.5*(vertices[1].x + vertices[2].x),
                    0.5*(vertices[1].y + vertices[2].y)))
  context.fillStyle = 'rgb(255, 255, 255, '+(key_S?1:0.5)+')'
  paintV(new Vertex(0.5*(vertices[2].x + vertices[3].x),
                    0.5*(vertices[2].y + vertices[3].y)))
  context.fillStyle = 'rgb(255, 255, 255, '+(key_A?1:0.5)+')'
  paintV(new Vertex(0.5*(vertices[3].x + vertices[0].x),
                    0.5*(vertices[3].y + vertices[0].y)))
  
  // goal
  context.strokeStyle = 'rgb(0, 255, 0, 1)'
  context.beginPath()
  context.arc(goal.x, goal.y, 5, 0, 2 * Math.PI, true)
  context.stroke()
  
  // pole
  context.strokeStyle = 'rgb(255, 255, 255, 1)'
  paintE(new Edge(vertices[4], new Vertex(
    0.5*(vertices[1].x + vertices[2].x),
    0.5*(vertices[1].y + vertices[2].y)
  )))
}
function paintV(v) {
  context.beginPath()
  context.arc(v.x, v.y, 5, 0, 2 * Math.PI, true)
  context.fill()
}
function paintE(e) {
  context.beginPath()
  context.moveTo(e.u.x, e.u.y)
  context.lineTo(e.v.x, e.v.y)
  context.stroke()
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
  VW = window.innerWidth  * scale
  VH = window.innerHeight * scale
  canvas.width  = VW
  canvas.height = VH
  paint()
}

// ================================================== [50]
//     Key Listener

let key_W = false
let key_A = false
let key_S = false
let key_D = false
let count = -1
let goal = new Vertex(250, 150)

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
  }
}
function key_Down(event) {
  switch (event.key) {
    case 'w': key_W = true; break
    case 'a': key_A = true; break
    case 's': key_S = true; break
    case 'd': key_D = true; break
  }
}
function key_Up(event) {
  switch (event.key) {
    case 'w': key_W = false; break
    case 'a': key_A = false; break
    case 's': key_S = false; break
    case 'd': key_D = false; break
  }
}

let anime = setInterval(time, 50)
function time() {
  fuel -= 0.001
  if (key_W || key_S) fuel -= 0.003
  if (key_A || key_D) fuel -= 0.003
  
  if (fuel < 0) {
    fuel = 0
    key_W = false
    key_A = false
    key_S = false
    key_D = false
  }
  
  if      (key_W) f.y =  0.05
  else if (key_S) f.y = -0.05
  else            f.y = 0
  
  if      (key_A) f.x =  0.05
  else if (key_D) f.x = -0.05
  else            f.x = 0
  
  v.x += f.x / 1
  v.y += f.y / 1
  for (let i = 0; i < vertices.length; i++) {
    vertices[i].x += v.x
    vertices[i].y += v.y
  }
  
  if (Math.sqrt((goal.x - vertices[4].x)**2 +
                (goal.y - vertices[4].y)**2) <= 5) {
    fuel += 0.003
    
    if (1 < fuel) {
      count += 1
      console.log('check', count)
      fuel = 1
      goal.x = (VW - 200) * Math.random() + 100
      goal.y = (VH - 200) * Math.random() + 100
    }
  }
  
  paint()
}

// ================================================== [50]
//     Cancel Listener

canvas.addEventListener('click', function(e) { e.preventDefault() }, false)
canvas.addEventListener('dblclick', function(e) { e.preventDefault() }, false)
