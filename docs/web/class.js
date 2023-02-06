// ================================================== [50]
//     Definition

'use strict'

class ComplexNumber {
    constructor(...args) {
        if (args.length === 1) {
            // Real Number
            this.r = Math.abs(args[0])
            this.theta = 0 <= args[0] ? 0 : Math.PI
        } else if (args.length === 2) {
            // Complex Number
            this.r = args[0]
            this.theta = args[1]
        } else {
            throw '[Argument number: ERROR]'
        }
    }

    R() {
        const r = this.r * Math.cos(this.theta)
        return Math.abs(r) < 0.0000000001 ? 0 : r
    }

    I() {
        const i = this.r * Math.sin(this.theta)
        return Math.abs(i) < 0.0000000001 ? 0 : i
    }

    t(num) {
        const R = this.R() + num.R()
        const I = this.I() + num.I()
        const r = Math.sqrt(R**2 + I**2)
        const theta = Math.atan2(I, R)
        return new ComplexNumber(r, theta)
    }

    x(num) {
        return new ComplexNumber(this.r * num.r, this.theta + num.theta)
    }

    pow(n) {
        return new ComplexNumber(Math.pow(this.r, n), n * this.theta)
    }

    print() {
        console.log(this.R() + ' + ' + this.I() + 'i')
    }
}

class Quaternion {
    constructor(...args) {
        if (args.length === 1) {
            // Vector
            this.w = 0
            this.x = args[0].x
            this.y = args[0].y
            this.z = args[0].z
        } else if (args.length === 2) {
            // Angle, Axis
            this.w = Math.cos(args[0] / 2)
            this.x = Math.sin(args[0] / 2) * args[1].x
            this.y = Math.sin(args[0] / 2) * args[1].y
            this.z = Math.sin(args[0] / 2) * args[1].z
        } else if (args.length === 3) {
            // x, y, z
            this.w = 0
            this.x = args[0]
            this.y = args[1]
            this.z = args[2]
        } else if (args.length === 4) {
            // w, x, y, z
            this.w = args[0]
            this.x = args[1]
            this.y = args[2]
            this.z = args[3]
        } else {
            throw '[Argument number: ERROR]'
        }
    }

    clone() {
        return new Quaternion(this.w, this.x, this.y, this.z)
    }

    conjugate() {
        return new Quaternion(this.w, -this.x, -this.y, -this.z)
    }

    toVector() {
        return new Vector(this.x, this.y, this.z)
    }
}

class Vertex {
    constructor(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    }

    clone() {
        return new Vertex(this.x, this.y, this.z)
    }

    toVector() {
        return new Vector(this.x, this.y, this.z)
    }
}

class Edge {
    constructor(u, v) {
        this.u = u
        this.v = v
    }

    clone() {
        return new Edge(this.u.clone(), this.v.clone())
    }
}

class Vector {
    constructor(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    }

    clone() {
        return new Vector(this.x, this.y, this.z)
    }

    norm() {
        return Math.sqrt(this.x**2 + this.y**2 + this.z**2)
    }

    scale(s) {
        this.x *= s
        this.y *= s
        this.z *= s
    }

    normalize() {
        this.scale(1 / this.norm())
    }
}

// ================================================== [50]
//     END
// ================================================== [50]