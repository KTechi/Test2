// ================================================== [50]
//     Main

'use strict'

// Open
peer.on('open', function(id) {
    console.log('This peer ID [' + id + ']')
    document.getElementById('connection_id').innerHTML = id
    input.value = id
})

// Receive
peer.on('connection', function(connection) {
    connection.on('data', function(data) {
        // console.log('from:', connection.peer)
        // console.log(data)
        const tmp = data.split(' ')
        g_x2 = parseInt(tmp[0])
        g_y2 = parseInt(tmp[1])
        paint()
    })
})

// Connect
function add_connection(connection_id) {
    const connection = peer.connect(connection_id)
    connections.push(connection)
    connection.on('open', function() {
        console.log('Connect with [' + connection_id + ']')
        console.log(connection.peer)
    })
}

function paint() {
    context.clearRect(0, 0, VW, VH)
    context.fillStyle = 'rgb(255, 0, 255, 1)'
    context.beginPath()
    context.arc(VW/2 + g_x, VH/2 + g_y, 3, 0, 2*Math.PI, true)
    context.fill()
    context.fillStyle = 'rgb(255, 255, 0, 1)'
    context.beginPath()
    context.arc(VW/2 + g_x2, VH/2 + g_y2, 3, 0, 2*Math.PI, true)
    context.fill()
}

document.addEventListener('mousewheel', mousewheel, { passive: false })
let g_x = 0
let g_y = 0
let g_x2 = 0
let g_y2 = 0
function mousewheel(event) {
    // Disable scroll event
    event.preventDefault()
    
    g_x -= .1 * event.deltaX
    g_y -= .1 * event.deltaY
    if (g_x < -VW/2) g_x = -VW/2
    if (g_y < -VH/2) g_y = -VH/2
    if ( VW/2 < g_x) g_x =  VW/2
    if ( VH/2 < g_y) g_y =  VH/2
    // yaw   = (yaw   - 0.01 * event.deltaX) % (2*Math.PI)
    // pitch = (pitch - 0.01 * event.deltaY)
    // if (pitch < -Math.PI / 2) pitch = -Math.PI / 2
    // if ( Math.PI / 2 < pitch) pitch =  Math.PI / 2
    
    paint()
    connections[0].send(g_x + ' ' + g_y)
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
function isMobile() {
    const regexp = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    return window.navigator.userAgent.search(regexp) !== -1
}

// ================================================== [50]
//     END
// ================================================== [50]