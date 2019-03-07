let keyboard = {w:false,a:false,s:false,d:false};
let keyboardDict = {87:"w",65:"a",83:"s",68:"d"};

let PlayerSpeed = 5;
let showPlayerShape = false;

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

        this.x = this.x + this.speed.x;
        this.y = this.y + this.speed.y;

        this.speed.x *= .9;
        this.speed.y *= .9;

        this.shape.x = this.x;
        this.shape.y = this.y;
    }

    render() {
        if (this.speed.x > 0) this.facingRight = true;
        if (this.speed.x < 0) this.facingRight = false;

        this.texture.render(this.x, this.y, this.size, this.facingRight);
        if (showPlayerShape) this.shape.render();
    }
}