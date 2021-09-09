import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Sketch from 'react-p5';
import { io } from 'socket.io-client';

var locations = { };

var keyPressVals = {
  right: false,
  left: false,
  up: false,
  down: false,
}

var keyAssociations = {
  d: 'right',
  a: 'left',
  w: 'up',
  s: 'down'
}

var socket;
var userId;

function App() {

  const handleKey = (key, state='down') => {
    if (!keyAssociations[key]) { return; }
    let newPressVals = { ...keyPressVals };
    newPressVals[keyAssociations[key]] = (state == 'down');
    if (socket) { 
      socket.emit('controls_change', userId, keyAssociations[key], state); 
    }
  }

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(500, 400).parent(canvasParentRef);
    const getVal = (vals, attr) => { return vals[attr]; }
  }

  const draw = (p5) => {
    p5.background(255, 130, 20);
    for (let location of Object.values(locations)) {
      if (!location.x || !location.y) { continue; }
      p5.ellipse(location.x, location.y, 100);
    }
  }

  function initSocketIo() {
    const newSocket = io('http://localhost:3001');
    socket = newSocket;
    
    newSocket.on('accepted_connection', (id) => {
      userId = id;
      console.log(id);
    });

    newSocket.on('avatar_moved', (id, newX, newY) => {
      if (!locations[id]) {
        locations[id] = { };
      }
      locations[id].x = newX;
      locations[id].y = newY;
    });

    newSocket.on('client_disconnected', (id) => {
      if (locations[id]) { delete locations[id]; }
    });

    return () => newSocket.close();
  }

  useEffect(() => {
    document.addEventListener('keydown', (e) => handleKey(e.key, 'down'));
    document.addEventListener('keyup', (e) => handleKey(e.key, 'up'));

    const closeCallback = initSocketIo();
    return closeCallback;
  }, []);

  return (
    <div className="App">
      <header className="App-header">0
        <p>
          Edit <code>src/App.js</code> and save to reload, if you like.
        </p>
        <Sketch setup={setup} draw={draw}/>
      </header>
    </div>
  );
}

export default App;
