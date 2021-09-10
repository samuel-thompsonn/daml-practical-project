import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Sketch from 'react-p5';
import { io } from 'socket.io-client';
import GameRoom from './components/visualizer/GameRoom';
import NamePrompt from './components/NamePrompt';

const playerData = {
  
};

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

  const [name, setName] = useState("");

  const handleKey = (key, state='down') => {
    if (!keyAssociations[key]) { return; }
    let newPressVals = { ...keyPressVals };
    newPressVals[keyAssociations[key]] = (state == 'down');
    if (socket) { 
      socket.emit('controls_change', userId, keyAssociations[key], state); 
    }
  }

  function initSocketIo() {
    const newSocket = io('http://localhost:3001');
    socket = newSocket;
    
    newSocket.on('accepted_connection', (id) => {
      userId = id;
      console.log(id);
    });

    newSocket.on('avatar_moved', (id, name, newX, newY) => {
      if (!playerData[id]) {
        playerData[id] = { location: { } };
      }
      playerData[id].location.x = newX;
      playerData[id].location.y = newY;
      playerData[id].name = name;
    });

    newSocket.on('client_disconnected', (id) => {
      if (playerData[id]) { delete playerData[id]; }
    });

    return () => newSocket.close();
  }

  useEffect(() => {
    document.addEventListener('keydown', (e) => handleKey(e.key, 'down'));
    document.addEventListener('keyup', (e) => handleKey(e.key, 'up'));

    const closeCallback = initSocketIo();
    return closeCallback;
  }, []);

  const submitName = () => {
    socket.emit('connect_avatar', name);
  }

  return (
    <div className="App">
      <div className='Name-prompt'>
        <NamePrompt
          name={name}
          onNameChange={setName}
          onSubmit={submitName}
          disabled={playerData[userId]}
        />
      </div>
        <GameRoom gameData={playerData}/>
    </div>
  );
}

export default App;
