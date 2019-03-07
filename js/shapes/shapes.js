// TODO: allow making lines instead of shapes

let PointSize = 3;
let alwaysShowPoints = false;

let Density = 1;

let ShapesTheta = [0,0,0,Math.PI/2,Math.PI/4,Math.PI/10,0,Math.PI/2,Math.PI/8,Math.PI/2];; // ShapesTheta = [0,0,0,PI/2,PI/4,PI/10,0,PI/2,PI/8,PI/2];
let ShapeColor;  // ShapeColor = color(0,0,0);

let points = [];
let shapes = [];

class Point {
	constructor(x,y) {
        this.x = x;
        this.y = y;
        this.hide = false;
    }

    get coords () {
        return [this.x, this.y];
    }
  
    render() {
        if (!this.hide || alwaysShowPoints) {
            stroke(25);
            fill(210,80,80);
            circle(this.x, this.y, PointSize);
        }
    }
}

class Line {
	constructor(point1, point2) {
        this.points = [point1, point2];
        this.func = new Func(this.points); // lines can be described as functions 
        this.hasColor = false;
    }

    setColor(color) {
        this.hasColor = color;
    }
  
    render() {
        for (let point of this.points) {
            point.render();
        }
        stroke(this.hasColor || ShapeColor);
        line(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y);
    }
}

class Func {
	constructor(points) {
        this.a = (points[1].y - points[0].y) / (points[1].x - points[0].x);
        this.b = points[0].y - this.a*points[0].x;

        if (points[1].x == points[0].x) this.x = points[0].x
    }
  
    y(x) {
        return this.a * x + this.b;
    }
}

class Shape {
	constructor() {
        this.lines = [];
        this.hasColor = false;
    }
    addLine(line) {
        if (this.hasColor && !line.hasColor) line.setColor(this.hasColor);
        this.lines.push(line);
    }
    setColor(color) {
        this.hasColor = color;
    }
    render() {
        for (let line of this.lines) {
            line.render();
        }
    }
}

class PhysicsBody {
    // ?
}

class Ngon {
    constructor(x, y, length, n, theta) {
        // length = {side: ?, width: ?}
        let a;
        if (length.side) {
            a = length.side;
        } else if (length.width) {
            a = length.width*sin(PI/n);
        } else {
            throw new Error("E#001");
        }
        this.a = a;
        this.n = n;
        this.x = x;
        this.y = y;
        
        this.theta = theta || ShapesTheta[n] || 0;

        // formulas:
        this.r = a / (2 * sin(PI/n)); //outer ring
        this.angle = PI - TWO_PI/n;
        if (this.n % 2 == 0) {
            this.h = a * (a / (2 * tan(PI/n)));
        } else {
            this.h = a / (2 * tan(PI/2/n));
        }

        // physics
        this.vel = createVector(0,0);
        this.acc = createVector(0,0);

        // color update
        this.hasColor = false;
    }
    setColor(color) {
        this.hasColor = color;
    }

    applyForce(f) {
        this.acc.add(f);
    }

    update() {
        let pos = createVector(this.x, this.y);
        pos.add(this.vel);
        this.x = pos.x; this.y = pos.y;
        if (testCollision(this, border)) {
            this.vel.mult(-1);
            pos.add(this.vel);
            pos.add(this.vel);
            this.x = pos.x; this.y = pos.y;

            // console.log('?');
        }
        this.vel.add(this.acc);
        this.acc.mult(0);

        // console.log(this.vel.x);
    }
    //     // physics
    //     this.force = createVector(0,0);
    //     this.area = n * a**2 / ( 4 * tan(PI/n) );
    //     this.mass = this.area * Density;
    //     this.velocity = createVector(0,0);
    //     this.acceleration = createVector(0,0);
    // }

    // applyForce(f) {
    //     this.force.add(f);
    // }

    // applyAcceleration(acc) {
    //     this.force = createVector(acc.x * this.mass, acc.y * this.mass);
    // }

    // update() {
    //     let pos = createVector(this.x, this.y);
    //     pos.add(this.velocity);
    //     this.x = pos.x; this.y = pos.y;
    //     this.velocity.add(this.acceleration);
    //     this.acceleration = createVector(this.force.x / this.mass, this.force.y / this.mass);

    //     this.force.mult(.98);
    // }

    render() {
        let points = [];
        for (let n = 0; n<this.n; n++) {
            let x = this.x + cos(TWO_PI*n/this.n + this.angle + this.theta) * this.r;
            let y = this.y + sin(TWO_PI*n/this.n + this.angle + this.theta) * this.r;
            points.push(new Point(x, y));
        }
        let shape = createShape(points, (this.hasColor) ? this.hasColor : false);
        this.lines = shape.lines;
        shape.render();
    }
}

class Polygon {
    constructor(x,y,points) { // points are just offsets from x,y
        this.x = x;
        this.y = y;
        this.points = Object.values(points); // to make sure it works

        this.hasColor = false;
    }
    setColor(color) {
        this.hasColor = color;
    }

    render() {
        let points = [];
        for(let point of this.points) {
            points.push(new Point(this.x + point.x, this.y + point.y));
        }
        let shape = createShape(points, (this.hasColor) ? this.hasColor : undefined);
        this.lines = shape.lines;
        shape.render();
    }
}

function drawShapes() {
    for (let point of points) {
        point.render();
    }
    for (let shape of shapes) {
        shape.render();
    }
}

function createShape(points, color) {
    if (points.length > 1) {
        if (points.length == 2) {
            // create a Line
            let shape = new Shape();
            if (color) shape.setColor(color);
            points[0].hide = true; points[1].hide = true;
            shape.addLine(new Line(points[0], points[1]));
            return shape;
        } else {
            // create a Shape
            let shape = new Shape();
            if (color) shape.setColor(color);
            for (let i in points) {
                i = parseInt(i);
                let j = 0;
                if (points[i+1]) j = i+1;
                points[i].hide = true; points[j].hide = true;
                shape.addLine(new Line(points[i], points[j]));
            }
            return shape;
        }
    } else {
        logError('Not enough points to create a shape');
    }
}