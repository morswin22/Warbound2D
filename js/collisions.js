let p;
let fps;

let border;

let assets = [];
let textures = [];

let player;
let pointer;

function preload() {
    textures.push(loadImage('/assets/image/pointer_default.png'));
    textures.push(loadImage('/assets/image/pointer_grab.png'));
    textures.push(loadImage('/assets/image/pointer_grabbing.png'));

    assets.push(loadJSON('/assets/polygons/birdy.json'));
    assets.push(loadJSON('/assets/polygons/knot.json'));
    assets.push(loadJSON('/assets/polygons/simpleRect.json'));
    assets.push(loadJSON('/assets/polygons/simpleStar.json'));
    assets.push(loadJSON('/assets/polygons/rect2.json'));
    textures.push(loadImage('/assets/image/bird-sprite2.png'));
}

function setup() {
    ShapeColor = color(51);
    createCanvas(800, 600);

    shapes.push(new Polygon('dynamic', 45, 200, assets[2]));
    shapes.push(new Polygon('dynamic', 500, 45, assets[2]));
    shapes.push(new Polygon('static', 550, 270, assets[3]));
    shapes.push(new Polygon('dynamic', 200, 90, assets[1]));
    shapes.push(new Polygon('dynamic', 300, 200, assets[4]));
    // shapes.push(new Polygon(, , assets[]));

    p = createP();
    fps = createP();

    border = new Polygon('static', 0,0,[new Point(1,1),new Point(width-1,1),new Point(width-1,height-1),new Point(1,height-1)]);
    border.render();
    
    PlayerDetectCollisionsWith.push(shapes);

    player = new Player(width/2, height*3/4, 120, new Spritesheet(textures[3], 5, 4, 2), new Polygon('dynamic', !!0, !!0, assets[0]), true);
    pointer = new Pointer([textures[0],textures[1],textures[2]]);

    shapes[0].vel.x = 1;
    shapes[0].m = 2;
}

function draw() {
    background(220);

    updateShapes();
    renderShapes();

    player.update();
    player.render();

    pointer.update(shapes);

    if (!(frameCount % 8)) fps.html('FPS: ' + floor(frameRate()));
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