/**
 * Serves as an alternative to AvatarVis. Shows a trail of dots for
 * all previous locations of the avatar.
 */
export default class TrailAvatarVis {
    constructor(textSize, avatarRadius, trailWidth) {
        this.textSize = textSize;
        this.avatarRadius = avatarRadius;
        this.trailWidth = trailWidth;
    }

    drawAvatar(p5, { name, location: { x, y }, oldLocations }) {
        console.log(oldLocations);
        p5.strokeWeight(1);
        p5.stroke(255);
        p5.fill(255);
        p5.ellipse(x, y, this.avatarRadius * 2); 
        for (let i = 1; i < oldLocations.length; i ++) {
            let prevLocation = oldLocations[i-1];
            let currLocation = oldLocations[i]
            p5.stroke(255, 0, 0);
            p5.strokeWeight(this.trailWidth);
            p5.line(prevLocation.x, prevLocation.y, currLocation.x, currLocation.y);
        }
        p5.strokeWeight(1);
        p5.textSize(this.textSize);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.fill(0);
        p5.text(name, x, y - this.avatarRadius - this.textSize);
    }
}