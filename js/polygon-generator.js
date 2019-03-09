let gridSize;
let stickToGrid;
let polygonName;

let bg = false;
let spritesheet = false;
let backgroundImage;
let isSpritesheet;
let spritesheetData = {};

let undoList = [];

let shapePoints = [];

let gridLines = [];
let pointer;

function setup() {
    ShapeColor = color(51);
    createCanvas(500, 500);

    gridSize = createSlider(1, 20, 15, 1);

    stickToGrid = createCheckbox('Stick to grid?', true);

    (createButton('Undo')).mousePressed(()=>{
        if (points.length > 0) undoList.push(points.pop());
    });

    (createButton('Redo')).mousePressed(()=>{
        if (undoList.length > 0) points.push(undoList.pop());
    });

    polygonName = createInput('polygon-'+round(random(999999)), 'text');

    backgroundImage = createFileInput(file=>{
        let img = createImg(file.data, ()=>{
            bg = createGraphics(img.width, img.height);
            bg.image(img, 0, 0, bg.width, bg.height);
        }).hide();
    }, false);

    isSpritesheet = createCheckbox('Is a spritesheet?', false);
    isSpritesheet.changed(e=>{
        if (isSpritesheet.checked()) {
            for (let i in spritesheetData) spritesheetData[i].show();
        } else {
            for (let i in spritesheetData) spritesheetData[i].hide();
        }
    });

    spritesheetData.hz = createInput('5', 'number').hide();
    spritesheetData.nx = createInput('4', 'number').hide();
    spritesheetData.ny = createInput('2', 'number').hide();
    spritesheetData.n = createInput('8', 'number').hide();

    spritesheetData.apply = createButton('Apply values').hide();
    spritesheetData.apply.mousePressed(e=>{
        if (bg) {
            spritesheet = new Spritesheet(
                bg, 
                parseInt(spritesheetData.hz.value()), 
                parseInt(spritesheetData.nx.value()), 
                parseInt(spritesheetData.ny.value()), 
                parseInt(spritesheetData.n.value())
            );
        }
    });

    const updateN = () => {
        spritesheetData.n.value(parseInt(spritesheetData.nx.value()) * parseInt(spritesheetData.ny.value()));
    }

    spritesheetData.nx.changed(updateN);
    spritesheetData.ny.changed(updateN);

    (createButton('Create new polygon')).mousePressed(()=>{
        let shape = createShape(points);
        if (shape) shapes.push(shape);
        shapePoints = points;
    });

    pointer = new Point(width/2, height/2);
}

function draw() {
    background(220);

    if (spritesheet) {
        spritesheet.render(width/2, height/2, 120,true);
    } else if (bg) {
        imageMode(CENTER);
        image(bg, width/2, height/2);
    }

    showGrid();
    fill(80,80,220);
    stroke(0);
    circle(width/2, height/2, 3);

    pointer.x = findClosest(mouseX, gridLines) || mouseX;
    pointer.y = findClosest(mouseY, gridLines) || mouseY;

    textAlign(LEFT, TOP);
    noStroke();
    fill(220);
    rect(5,5,60,21);
    fill(0);
    text('Grid: ' + gridSize.value(), 10, 10);

    drawShapes();
    if (shapes[0]) {
        noLoop();
        // center points around width/2 height/2
        for (let i in shapePoints) {
            shapePoints[i].x -= width/2;
            shapePoints[i].y -= height/2;
            shapePoints[i].hide = undefined;
        }
        saveJSON(shapePoints, polygonName.value() + '.json');
    }

    pointer.render();
}

function mousePressed() {
    if (mouseX < width && mouseX > 0 &&
        mouseY < height && mouseY > 0) {
        points.push(new Point(pointer.x, pointer.y));
    }
}

function showGrid() {
    gridLines = [];
    if (gridSize.value() > 4) {
        stroke(180);
        for (let i = width/2; i < width; i+=gridSize.value()) {
            line(i,0,i,height);
            gridLines.push(i);
        }
        for (let i = width/2; i > 0; i-=gridSize.value()) {
            line(i,0,i,height);
            gridLines.push(i);
        }
        for (let j = height/2; j < height; j+=gridSize.value()) {
            line(0,j,width,j);
        }
        for (let j = height/2; j > 0; j-=gridSize.value()) {
            line(0,j,width,j);
        }
        gridLines.sort((a,b) => a-b);
    }
}

function findClosest(a, array) {
	let minDist = Infinity;
	let value;
	for(let n of array) {
		if (abs(a-n) < minDist) {
			minDist = abs(a-n);
			value = n;
		}
	}
	return isFinite(minDist) ? value : false;
}