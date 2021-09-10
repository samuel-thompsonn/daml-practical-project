import { useState } from 'react';
import Sketch from 'react-p5';
import GameSketch from './GameSketch';

export default function GameRoom({ gameData }) {

    const [gameSketch, setGameSketch] = useState(new GameSketch());

    // const setup = (p5, canvasParentRef) => {
    //     // console.log(canvasParentRef);
    //     let canvasWidth = canvasParentRef.offsetWidth;
    //     let canvasHeight = canvasParentRef.offsetHeight;
    //     console.log("Canvas Height:")
    //     // console.log(canvasParentRef.style);
    //     p5.createCanvas(500, 450).parent(canvasParentRef);
    // }

    // const draw = (p5) => {
    //     p5.background(255, 200, 0);
    //     for (let player of Object.values(gameData)) {
    //         let location = player.location;
    //         if (!location.x || !location.y) { continue; }
    //         let vis = new AvatarVis(location.x, location.y, player.name);
    //         vis.drawSelf(p5);
    //     }
    // }

    return (
        <div>
            <Sketch 
                setup={gameSketch.setup} 
                draw={(p5) => gameSketch.draw(p5, gameData)}
            />
        </div>
    )
}