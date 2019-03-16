let p;
let fps;

let border;

let assets = [];
let textures = [];

let player;
let pointer;

let placePoints = false;

function preload() {
    textures.push(loadImage('/assets/image/pointer_default.png'));
    textures.push(loadImage('/assets/image/pointer_grab.png'));
    textures.push(loadImage('/assets/image/pointer_grabbing.png'));

    assets.push(loadJSON('/assets/polygons/rect.json'));
    assets.push(loadJSON('/assets/polygons/BlueBird.json'));
    assets.push(loadJSON('/assets/polygons/birdy.json'));
    textures.push(loadImage('/assets/image/bird-sprite.png'));
    textures.push(loadImage('/assets/image/bird-sprite2.png'));
}

function setup() {
    ShapeColor = color(51);
    createCanvas(800, 600);
    (createButton('Create new shape')).mousePressed(()=>{
        let shape = createShape(points);
        if (shape) shapes.push(shape);
        points = [];
    });
    shapes.push(new Ngon('dynamic', 80, 200, {width:60}, 6));
    shapes.push(new Polygon('dynamic', 122, 480, [new Point(50, -100), new Point(50, 25), new Point(-10, 10), new Point(-25, -50)]));
    shapes.push(new Ngon('dynamic', 80, 200, {width:60}, 4));

    shapes[0].setColor(color(80,220,80));

    p = createP();
    fps = createP();

    border = new Polygon('static', 0,0,[new Point(1,1),new Point(width-1,1),new Point(width-1,height-1),new Point(1,height-1)]);
    border.render();

    shapes.push(new Polygon('dynamic', 80, 80, assets[0]));

    shapes.push(new Ngon('dynamic', 670, 470, {width: 70}, 8));

    // player = new Player(width/2, height*3/4, 120, new Spritesheet(textures[0], 5, 5, 3, 14), new Ngon(!!0, !!0, {width: 120}, 5), true);
    
    PlayerDetectCollisionsWith.push(shapes);

    // player = new Player(width/2, height*3/4, 120, new Spritesheet(textures[1], 5, 4, 2), new Ngon(!!0, !!0, {width: 120}, 6), true);
    player = new Player(width/2, height*3/4, 120, new Spritesheet(textures[4], 5, 4, 2), new Polygon('dynamic', !!0, !!0, assets[2]), true);
    pointer = new Pointer([textures[0],textures[1],textures[2]]);
}

function draw() {
    background(220);

    shapes[0].vel.x = 1.5;
    shapes[0].theta += cos(frameCount/25)/10;

    shapes[1].y += sin(frameCount/40);

    updateShapes();
    renderShapes();

    testAllCollisions(shapes);
    p.html('Number of collisions: ' + countCollisions);

    player.update();
    player.render();

    pointer.update(shapes);

    if (!(frameCount % 8)) fps.html('FPS: ' + floor(frameRate()));
}

function mousePressed() {
    if (mouseX < width && mouseX > 0 &&
        mouseY < height && mouseY > 0) {
        if (placePoints) points.push(new Point(mouseX, mouseY));
    }
  }

function keyPressed(e) {
    let key = keyboardDict[e.keyCode];
    if (key) {
        keyboard[key] = true;
    }
}

function keyReleased(e) {
    let key = keyboardDict[e.keyCode];
    if (key) {
        keyboard[key] = false;
    }
}