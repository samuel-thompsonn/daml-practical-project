import AvatarVis from './AvatarVis';
import TrailAvatarVis from './TrailAvatarVis';

const MARGIN_SIZE = 10;

export default class GameSketch {

    constructor() {
        this.avatarVis = new TrailAvatarVis(32, 10, 5, { r: 0, g: 255, b: 0});
    }

    setup(p5, canvasParentRef, roomDims) {
        p5.createCanvas(
            roomDims.roomWidth + (2 * MARGIN_SIZE), 
            roomDims.roomHeight + (2 * MARGIN_SIZE)
        ).parent(canvasParentRef);
    }

    draw(p5, roomColor, gameData, { offsetWidth, offsetHeight }, roomDims) {
        p5.resizeCanvas(offsetWidth, offsetHeight);
        p5.background(roomColor.r, roomColor.g, roomColor.b);
        for (let player of Object.values(gameData)) {
            let location = player.location;
            if (!('x' in location)|| !('y' in location)) { continue; }
            let offset = { xMargin: MARGIN_SIZE, yMargin: MARGIN_SIZE }
            this.avatarVis.drawAvatar(p5, player, offset, roomDims, { offsetWidth, offsetHeight });
        }
    }
}