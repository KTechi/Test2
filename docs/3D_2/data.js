// ================================================== [50]
//     Definition

'use strict'

const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
const scale = 1.0
const aln = 300 // Axis Length
const axisX = new Edge(new Vertex(-aln, 0, 0), new Vertex(aln, 0, 0))
const axisY = new Edge(new Vertex(0, -aln, 0), new Vertex(0, aln, 0))
const axisZ = new Edge(new Vertex(0, 0, -aln), new Vertex(0, 0, aln))
const zero = new Vector(0, 0, 0)
let vertices = []
let edges = []
let R = 300
let VW = window.innerWidth
let VH = window.innerHeight
let imageData = context.getImageData(0, 0, VW, VH)
let data = imageData.data
let pitch = 0
let roll  = 0
let yaw   = 0

function subdivSphere(sub_div) {
    // Vertex (ICOSA Sphere)
    const ICOSA_V = [
        new Vertex( 100.0, -173.2, -261.8),
        new Vertex( 100.0,  173.2, -261.8),
        new Vertex(-200.0,      0, -261.8),
        new Vertex(-161.8, -280.3,  -61.8),
        new Vertex( 161.8, -280.3,   61.8),
        new Vertex( 323.6,      0,  -61.8),
        new Vertex(-161.8,  280.3,  -61.8),
        new Vertex(-323.6,      0,   61.8),
        new Vertex(-100.0, -173.2,  261.8),
        new Vertex( 200.0,      0,  261.8),
        new Vertex( 161.8,  280.3,   61.8),
        new Vertex(-100.0,  173.2,  261.8),
    ]
    // Edge (Vertex Index)
    const ICOSA_E = [
        [ 0,  1],
        [ 0,  2],
        [ 0,  3],
        [ 0,  4],
        [ 0,  5],
        [ 1,  2],
        [ 2,  3],
        [ 3,  4],
        [ 4,  5],
        [ 5,  1],
        
        [ 1,  6],
        [ 6,  2],
        [ 2,  7],
        [ 7,  3],
        [ 3,  8],
        [ 8,  4],
        [ 4,  9],
        [ 9,  5],
        [ 5, 10],
        [10,  1],
        
        [ 6,  7],
        [ 7,  8],
        [ 8,  9],
        [ 9, 10],
        [10,  6],
        [ 6, 11],
        [ 7, 11],
        [ 8, 11],
        [ 9, 11],
        [10, 11],
    ]
    // Face (Edge Index)
    const ICOSA_F = [
        [ 0,  1,  5],
        [ 1,  2,  6],
        [ 2,  3,  7],
        [ 3,  4,  8],
        [ 4,  0,  9],

        [10,  5, 11],
        [11, 20, 12],
        [12,  6, 13],
        [13, 21, 14],
        [14,  7, 15],
        [15, 22, 16],
        [16,  8, 17],
        [17, 23, 18],
        [18,  9, 19],
        [19, 24, 10],

        [20, 25, 26],
        [21, 26, 27],
        [22, 27, 28],
        [23, 28, 29],
        [24, 29, 25],
    ]
    vertices = []
    edges = []

    for (const v of ICOSA_V) {
        const vec = genVector(zero, v)
        vec.normalize()
        vec.scale(R)
        vertices.push(vec)
    }

    let prev
    function subdivEdge(e, div) {
        if (div <= 0) return
        const m = add(0.5, e.u, 0.5, e.v)
        m.normalize()
        m.scale(R)
        subdivEdge(new Edge(e.u, m), div-1)
        vertices.push(m)
        edges.push(new Edge(prev, m))
        prev = m
        subdivEdge(new Edge(m, e.v), div-1)
    }
    for (const e of ICOSA_E) {
        e.push(vertices.length)
        const u = vertices[ e[0] ]
        const v = vertices[ e[1] ]
        prev = u
        subdivEdge(new Edge(u, v), sub_div)
        edges.push(new Edge(prev, v))
    }

    function subdivFace(e1, e2, e3, div) {
        if (div <= 0) return
        const half = 2**(div-1) - 1
        const u = e1[half]
        const v = e2[half]
        const w = e3[half]
        function connect(v1, v2) {
            const len = vertices.length
            prev = v1
            subdivEdge(new Edge(v1, v2), div-1)
            edges.push(new Edge(prev, v2))
            return len
        }
        const v1_index = connect(u, v)
        const v2_index = connect(v, w)
        const v3_index = connect(w, u)
        const e4 = []
        const e5 = []
        const e6 = []
        for (let i = 0; i < half; i++) {
            e4.push(vertices[v1_index + i])
            e5.push(vertices[v2_index + i])
            e6.push(vertices[v3_index + i])
        }
        for (const e of [e4, e5, e6]) e.reverse()
        subdivFace(e1.slice(half + 1, 2**div - 1), e2.slice(0, half), e4, div-1)
        subdivFace(e2.slice(half + 1, 2**div - 1), e3.slice(0, half), e5, div-1)
        subdivFace(e3.slice(half + 1, 2**div - 1), e1.slice(0, half), e6, div-1)
        subdivFace(e6, e5, e4, div-1)
    }
    for (const f of ICOSA_F) {
        const edge1 = ICOSA_E[ f[0] ]
        const edge2 = ICOSA_E[ f[1] ]
        const edge3 = ICOSA_E[ f[2] ]
        const e1_array = []
        const e2_array = []
        const e3_array = []
        for (let i = 0; i < (2**sub_div) - 1; i++) {
            e1_array.push(vertices[edge1[2]+i])
            e2_array.push(vertices[edge3[2]+i])
            e3_array.push(vertices[edge2[2]+(2**sub_div)-2-i])
        }
        subdivFace(e1_array, e2_array, e3_array, sub_div)
    }
}

subdivSphere(2)

// ================================================== [50]
//     END
// ================================================== [50]