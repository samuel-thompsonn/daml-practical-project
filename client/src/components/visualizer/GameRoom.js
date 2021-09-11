import { useState } from 'react';
import Sketch from 'react-p5';
import GameSketch from './GameSketch';

export default function GameRoom({ gameData }) {

    const [gameSketch, setGameSketch] = useState(new GameSketch());
    
    return (
        <div>
            <Sketch 
                setup={gameSketch.setup} 
                draw={(p5) => gameSketch.draw(p5, gameData)}
            />
        </div>
    )
}