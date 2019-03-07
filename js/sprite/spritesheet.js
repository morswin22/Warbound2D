class Spritesheet {
    constructor (texture, Hz, wN, hN, n) {
        this.n = n || wN * hN;

        this.texture = texture;
        this.w = texture.width / wN;
        this.h = texture.height / hN;
        this.wN = wN;
        this.hN = hN;

        this.i = 0;
        this.hz = Hz;

        this.sheet = [];
        let j = -1;
        for (let i = 0; i<n; i++) {
            if (i % wN == 0) {
                j++;
            }
            this.sheet.push({x:(i%wN)*this.w, y:j*this.h});
        }
    }

    render(x, y, size, direction) {
        let i = parseInt(this.i / this.hz);
        this.i++;
        if (i >= this.n-1) {
            this.i = 0;
            i = 0;
        }
        
        push()
        imageMode(CENTER);
        let img = this.texture.get(this.sheet[i].x, this.sheet[i].y, this.w, this.h);
        if (!direction) {
            translate(x, y);
            scale(-1,1);
            image(img, 0, 0, size, this.h/this.w * size);
        } else {
            image(img, x, y, size, this.h/this.w * size);
        }
        pop();

    }
}