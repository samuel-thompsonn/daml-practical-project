import AvatarVis from './AvatarVis';

export default class GameSketch {
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
            let vis = new AvatarVis(32, 25);
            vis.drawAvatar(p5, player);
        }
    }
}