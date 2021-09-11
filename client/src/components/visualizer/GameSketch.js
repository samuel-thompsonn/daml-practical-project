import AvatarVis from './AvatarVis';
import TrailAvatarVis from './TrailAvatarVis';

export default class GameSketch {

    constructor() {
        this.avatarVis = new TrailAvatarVis(32, 25, 5);
    }

    setup(p5, canvasParentRef) {
        // TODO: See if we can scale the canvas size
        // appropriately.
        let canvasWidth = canvasParentRef.offsetWidth;
        let canvasHeight = canvasParentRef.offsetHeight;
        console.log("Canvas Height:")
        p5.createCanvas(500, 450).parent(canvasParentRef);
    }

    draw(p5, gameData) {
        p5.background(255, 200, 0);
        for (let player of Object.values(gameData)) {
            let location = player.location;
            if (!location.x || !location.y) { continue; }
            this.avatarVis.drawAvatar(p5, player);
        }
    }
}