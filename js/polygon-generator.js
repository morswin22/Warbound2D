let gridSize;
let stickToGrid;
let polygonName;

let bg = false;
let spritesheet = false;
let backgroundImage;
let backgroundSizeWidth; 
let backgroundSizeHeight;
let isSpritesheet;
let spritesheetData = {};

let undoList = [];

let shapePoints = [];

let gridLines = [];
let pointer;

// css 
let view = '#view';
let controls = '#controls';
let gridGroup = '#grid-control';
let doGroup = '#undo-redo-control';
let uploadGroup = '#upload-control';
let sizeGroup = '#size-control';
let spritesheetGroup = '#spritesheet-control';
let downloadGroup = '#download-control';

// todo:
let uploadShape;

function setup() {
    ShapeColor = color(51);

    view = select(view);
    controls = select(controls);
    gridGroup = select(gridGroup);
    doGroup = select(doGroup);
    uploadGroup = select(uploadGroup);
    sizeGroup = select(sizeGroup);
    spritesheetGroup = select(spritesheetGroup);
    downloadGroup = select(downloadGroup);

    let canvas = createCanvas(500, 500);
    canvas.parent(view);
    
    stickToGrid = createCheckbox('Stick to grid?', true).parent(gridGroup);

    gridSize = createSlider(1, 20, 15, 1).parent(gridGroup);

    (createButton('Undo')).parent(doGroup).mousePressed(()=>{
        if (points.length > 0) undoList.push(points.pop());
    });

    (createButton('Redo')).parent(doGroup).mousePressed(()=>{
        if (undoList.length > 0) points.push(undoList.pop());
    });

    backgroundImage = createFileInput(file=>{
        let img = createImg(file.data, ()=>{
            bg = createGraphics(img.width, img.height);
            bg.image(img, 0, 0, bg.width, bg.height);
        }).hide();
    }).parent(uploadGroup);

    backgroundSizeWidth = createInput('', 'number').parent(sizeGroup);
    backgroundSizeWidth.elt.placeholder = 'width';
    backgroundSizeHeight = createInput('', 'number').parent(sizeGroup);
    backgroundSizeHeight.elt.placeholder = 'height';

    isSpritesheet = createCheckbox('Is a spritesheet?', false).parent(spritesheetGroup);
    isSpritesheet.changed(e=>{
        if (isSpritesheet.checked()) {
            for (let i in spritesheetData) spritesheetData[i].show();
        } else {
            for (let i in spritesheetData) spritesheetData[i].hide();
            spritesheet = false;
        }
    });

    spritesheetData.hz = createInput('5', 'number').hide().parent(spritesheetGroup);
    spritesheetData.nx = createInput('4', 'number').hide().parent(spritesheetGroup);
    spritesheetData.ny = createInput('2', 'number').hide().parent(spritesheetGroup);
    spritesheetData.n = createInput('8', 'number').hide().parent(spritesheetGroup);

    spritesheetData.apply = createButton('Apply values').hide().parent(spritesheetGroup);
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

    polygonName = createInput('polygon-'+round(random(999999)), 'text').parent(downloadGroup);

    (createButton('Create new polygon')).parent(downloadGroup).mousePressed(()=>{
        let shape = createShape(points);
        if (shape) shapes.push(shape);
        shapePoints = points;
    });

    pointer = new Point(width/2, height/2);
}

function draw() {
    background(220);

    if (spritesheet) { // size control

        if (backgroundSizeWidth.value() == "" && backgroundSizeHeight.value() == "") {
            spritesheet.render(width/2, height/2, {default: true},true);
        } else if (backgroundSizeHeight.value() == "") {
            spritesheet.render(width/2, height/2, {width: parseInt(backgroundSizeWidth.value())},true);
        } else if (backgroundSizeWidth.value() == "") {
            spritesheet.render(width/2, height/2, {height: parseInt(backgroundSizeHeight.value())},true);
        } else {
            spritesheet.render(width/2, height/2, {width: parseInt(backgroundSizeWidth.value()), height: parseInt(backgroundSizeHeight.value())},true);
        }

    } else if (bg) {

        imageMode(CENTER);
        if (backgroundSizeWidth.value() == "" && backgroundSizeHeight.value() == "") {
            image(bg, width/2, height/2);
        } else if (backgroundSizeHeight.value() == "") {
            image(bg, width/2, height/2, parseInt(backgroundSizeWidth.value()), bg.height/bg.width * parseInt(backgroundSizeWidth.value()));
        } else if (backgroundSizeWidth.value() == "") {
            image(bg, width/2, height/2, bg.width/bg.height * parseInt(backgroundSizeHeight.value()), parseInt(backgroundSizeHeight.value()));
        } else {
            image(bg, width/2, height/2, parseInt(backgroundSizeWidth.value()), parseInt(backgroundSizeHeight.value()));
        }

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