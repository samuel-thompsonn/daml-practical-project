/**
 * Serves as an alternative to AvatarVis. Shows a line trail for
 * all previous locations of the avatar.
 */
export default class TrailAvatarVis {
    constructor(textSize, avatarRadius, trailWidth) {
        this.textSize = textSize;
        this.avatarRadius = avatarRadius;
        this.trailWidth = trailWidth;
    }

    drawAvatar(p5, { name, location: { x, y }, oldLocations, color }, offset, roomDims, {offsetWidth, offsetHeight}) {
        const xScale = offsetWidth / (roomDims.roomWidth + (2 * offset.xMargin));
        const yScale = offsetHeight / (roomDims.roomHeight + (2 * offset.yMargin));
        const ellipseDims = {
            x: (x + offset.xMargin) * xScale,
            y: (y + offset.yMargin) * yScale,
            width: (this.avatarRadius * 2) * xScale,
            height: (this.avatarRadius * 2) * yScale
        }

        p5.noStroke()
        p5.fill(color.r, color.g, color.b);
        p5.ellipse(ellipseDims.x, ellipseDims.y, ellipseDims.width, ellipseDims.height); 
        for (let i = 1; i < oldLocations.length; i ++) {
            let prevLocation = oldLocations[i-1];
            let currLocation = oldLocations[i]
            p5.stroke(color.r, color.g, color.b);
            p5.strokeWeight(this.trailWidth);
            const lineDims = {
                startX: (prevLocation.x + offset.xMargin) * xScale,
                startY: (prevLocation.y + offset.yMargin) * yScale,
                endX: (currLocation.x + offset.xMargin) * xScale,
                endY: (currLocation.y + offset.yMargin) * yScale
            }
            p5.line(lineDims.startX, lineDims.startY, lineDims.endX, lineDims.endY);
        }
        p5.stroke(0);
        p5.strokeWeight(5);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.fill(color.r, color.g, color.b);
        
        const textDims = {
            textSize: this.textSize * yScale,
            x: (x + offset.xMargin) * xScale,
            y: (y + offset.yMargin - this.avatarRadius - this.textSize) * yScale
        }
        p5.textSize(textDims.textSize);
        p5.text(name, textDims.x, textDims.y);
    }
}