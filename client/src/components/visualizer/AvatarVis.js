export default class AvatarVis {
    constructor(textSize, avatarRadius) {
        this.textSize = textSize;
        this.avatarRadius = avatarRadius;
    }

    drawAvatar(p5, { name, location: { x, y } }) {
        p5.fill(255);
        p5.ellipse(x, y, this.avatarRadius * 2); 
        p5.textSize(this.textSize);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.fill(0);
        p5.text(name, x, y - this.avatarRadius - this.textSize);
    }
}