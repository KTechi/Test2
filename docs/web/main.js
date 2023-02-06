// ================================================== [50]
//     Main

'use strict'

let coordinates = []
function paint() {
    context.clearRect(0, 0, VW, VH)

    // Axis
    // context.fillStyle = 'rgb(255, 255, 255, 1)'
    // paintVertex(new Vertex(g_x, 0, -g_y))
    console.log('>', socket.id, coordinates)
    for (let i = 0; i < coordinates.length; i++) {
        if (i == socket.id)
            context.fillStyle = 'rgb(255, 0, 255, 1)'
        else
            context.fillStyle = 'rgb(0, 255, 255, 1)'
        // console.log(coordinate)
        paintVertex(new Vertex(parseInt(coordinates[i][0]), 0, parseInt(-coordinates[i][1])))
    }

    // context.font = '20px sans-serif';
    // context.fillText('Hello world', 0, 20);
}
function paintVertex(v) {
    context.beginPath()
    context.arc(VW/2 + v.x, VH/2 - v.z, 3, 0, 2*Math.PI, true)
    context.fill()
}

// var connection = new WebSocket('ws://echo.websocket.org')
// let socket = new WebSocket('ws://localhost:8081')
let socket = new WebSocket('wss://192.168.11.4:8081')

// socket.send('')
socket.onopen = function(e) {
    console.log('Client: Open')
    console.log(e)
    socket.send('get id')
}
socket.onerror = function(error) {
    console.log('Client: Error')
    console.log(error)
}
socket.onmessage = function(e) {
    // console.log('Client: Recieve message')
    // console.log(e)

    if (e.data.slice(0, 5) === 'meta ') {
//         const cookieValue = document.cookie
//   .split('; ')
//   .find(row => row.startsWith('test2'))
//   .split('=')[1];

        socket.id = e.data.slice(5)
        document.cookie = 'id=0'
        console.log('Socket ID:', socket.id)
        return
    }

    // console.log(e.data)
    coordinates = e.data.split(',')
    for (let i = 0; i < coordinates.length; i++) {
        if (coordinates[i] === '') continue
        coordinates[i] = coordinates[i].split(' ')
    }
    coordinates.pop()
    // console.log(coordinates)
    paint()
}
socket.onclose = function() {
    console.log('Client: Close')
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
