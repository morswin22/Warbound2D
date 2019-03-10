let keyboard = {w:false,a:false,s:false,d:false};
let keyboardDict = {87:"w",65:"a",83:"s",68:"d"};

let PlayerSpeed = 5;
let showPlayerShape = false;

let PlayerDetectCollisionsWith = [];

class Player {
    constructor(x,y, size, texture, shape, facingRight) {
        this.x = x;
        this.y = y;

        this.texture = texture;
        this.size = size;

        this.shape = shape;
        this.shape.x = x;
        this.shape.y = y;

        this.speed = {x:0, y:0};
        this.facingRight = facingRight || true;
    }

    update() {
        if (keyboard.w) this.speed.y = -PlayerSpeed;
        if (keyboard.a) this.speed.x = -PlayerSpeed;
        if (keyboard.s) this.speed.y = PlayerSpeed;
        if (keyboard.d) this.speed.x = PlayerSpeed;

        this.x += this.speed.x;
        if (this.detectCollisions()) {
            // TODO: prevent collisions
            // this.x -= this.speed.x*1.01;
            // this.speed.x *= -2;
        }
        this.y += this.speed.y;
        if (this.detectCollisions()) {
            // this.y -= this.speed.y*1.01;
            // this.speed.y = 0
        }

        this.speed.x *= .9;
        this.speed.y *= .9;

        this.shape.x = this.x;
        this.shape.y = this.y;
    }

    detectCollisions() {
        this.detectedCollisions = 0;
        this.shape.getLines();
        for (let item of PlayerDetectCollisionsWith) {
            if (Array.isArray(item)) {
                for (let i of item) {
                    this.detectCollision(i);
                }
            } else {
                this.detectCollision(item);
            }
        }
        return !!this.detectedCollisions;
    }

    detectCollision(shape) { // test if this is a shape
        if (testCollision(this.shape, shape)) {
            this.detectedCollisions++;
        }
    }

    render() {
        if (this.speed.x > 0) this.facingRight = true;
        if (this.speed.x < 0) this.facingRight = false;

        this.texture.render(this.x, this.y, {width: this.size}, this.facingRight);
        if (showPlayerShape) this.shape.render();
    }
}