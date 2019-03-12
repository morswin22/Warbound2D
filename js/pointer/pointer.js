let PointerSize = 32;
let PointerOffset = -11;

class Pointer {
    constructor (textures) {
        this.hovered = [];
        this.held = undefined;
        this.offset = [];
        let obj = Object.values(textures);
        this.textures = {
            default: obj[0],
            grab: obj[1],
            grabbing: obj[2]
        }
        noCursor();
    }

    update(clickableShapes) {
        this.hovered = [];
        if (!this.held) {
            for (let shape of clickableShapes) {
                if (testPointInShape(new Point(mouseX, mouseY), shape)) {
                    this.hovered.push(shape);
                    if (mouseIsPressed) {
                        this.held = shape;
                        this.offset = [shape.x - mouseX, shape.y - mouseY];
                    }
                }
            }
        } else {
            if (!mouseIsPressed) {
                this.held = undefined;
                this.offset = [];
            } else {
                this.held.x = mouseX + this.offset[0];
                this.held.y = mouseY + this.offset[1];
            }
        }
        if (this.held) {
            this.render(this.textures.grabbing);
        } else if (this.hovered.length == 0) {
            this.render(this.textures.default);
        } else if (this.hovered.length > 0) {
            this.render(this.textures.grab);
        } 
    }

    render(texture) {
        image(texture, mouseX + PointerOffset, mouseY, PointerSize, PointerSize);
    }
}