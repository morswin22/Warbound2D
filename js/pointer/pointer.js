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
        this.lastPos = [mouseX, mouseY];
    }

    update(clickableShapes) {
        this.velocity = [mouseX - this.lastPos[0], mouseY - this.lastPos[1]];
        this.lastPos = [mouseX, mouseY];
        this.hovered = [];
        if (!this.held) {
            for (let shape of clickableShapes) {
                if (shape.type == 'dynamic' && testPointInShape(new Point(mouseX, mouseY), shape)) {
                    this.hovered.push(shape);
                    if (mouseIsPressed) {
                        this.held = shape;
                        this.held.isHeld = true;
                        this.offset = [shape.x - mouseX, shape.y - mouseY];
                    }
                }
            }
        } else {
            if (!mouseIsPressed) {
                this.held.isHeld = false;
                this.held = undefined;
                this.offset = [];
            } else {
                this.held.x = mouseX + this.offset[0];
                this.held.y = mouseY + this.offset[1];

                this.held.vel.x = this.velocity[0];
                this.held.vel.y = this.velocity[1];
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