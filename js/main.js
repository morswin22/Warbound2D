let p;

let border;

let assets = [];

function preload() {
    assets.push(loadJSON('/assets/polygons/rect.json'));
}

function setup() {
    ShapesTheta = [0,0,0,PI/2,PI/4,PI/10,0,PI/2,PI/8,PI/2];
    ShapeColor = color(51);
    createCanvas(400, 400);
    (createButton('Create new shape')).mousePressed(()=>{
        let shape = createShape(points);
        if (shape) shapes.push(shape);
        points = [];
    });
    shapes.push(new Ngon(80, 200, {width:60}, 6));
    shapes.push(new Polygon(200, 200, [new Point(50, -100), new Point(50, 25), new Point(-10, 10), new Point(-25, -50)]));
    shapes.push(new Ngon(80, 200, {width:60}, 4));

    shapes[0].applyForce(createVector(1.5,0));
    shapes[0].setColor(color(80,220,80));

    p = createP();

    border = new Polygon(0,0,[new Point(1,1),new Point(width-1,1),new Point(width-1,height-1),new Point(1,height-1)]);
    border.render();

    shapes.push(new Polygon(80, 80, assets[0]));
}

function draw() {
    background(220);

    shapes[0].theta += cos(frameCount/25)/10;

    shapes[1].y += sin(frameCount/40);

    drawShapes();
    shapes[0].update();

    testAllCollisions(shapes);
    p.html('Number of collisions: ' + countCollisions);
}

function mousePressed() {
    if (mouseX < width && mouseX > 0 &&
        mouseY < height && mouseY > 0) {
        points.push(new Point(mouseX, mouseY));
    }
  }