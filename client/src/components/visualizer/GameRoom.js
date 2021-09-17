import { useState, useRef } from 'react';
import Sketch from 'react-p5';
import GameSketch from './GameSketch';
import { Paper } from '@material-ui/core'

export default function GameRoom({ roomColor, roomDims, gameData }) {

    const [gameSketch] = useState(new GameSketch());
    const canvasDivRef = useRef();
    
    return (
        <Paper 
            style={{
                width: '67%', 
                height: '90%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#999999'
            }}
        >
            <div ref={canvasDivRef}
                style={{
                    width: '95%',
                    height: '95%'
                }}
            >
                <Sketch 
                    setup={(p5, canvasParentRef) => gameSketch.setup(p5, canvasParentRef, roomDims)} 
                    draw={(p5) => gameSketch.draw(p5, roomColor, gameData, canvasDivRef.current, roomDims)}
                />
            </div>
        </Paper>
    )
}