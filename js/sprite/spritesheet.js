class Spritesheet {
    constructor (texture, Hz, wN, hN, n) {
        this.n = n || wN * hN;
        n = this.n;

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

        let width;
        let height;
        if (size.default) {width = this.w; height = this.h}
        else if (size.width && size.height) {width = size.width; height = size.height}
        else if (size.width) {
            width = size.width;
            height = this.h/this.w * width;
        } else if (size.height) {
            height = size.height;
            width = this.w/this.h * height;
        }
        
        push()
        imageMode(CENTER);
        let img = this.texture.get(this.sheet[i].x, this.sheet[i].y, this.w, this.h);
        if (!direction) {
            translate(x, y);
            scale(-1,1);
            image(img, 0, 0, width, height);
        } else {
            image(img, x, y, width, height);
        }
        pop();

    }
}