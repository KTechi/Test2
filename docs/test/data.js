// ================================================== [50]
//     Definition

'use strict'

const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
let scale = 1.0
let VW = window.innerWidth
let VH = window.innerHeight
let imageData = context.getImageData(0, 0, VW, VH)
let data = imageData.data
const peer = new Peer()
const connections = []

// ================================================== [50]
//     END
// ================================================== [50]