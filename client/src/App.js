import './App.css';
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import GameRoom from './components/visualizer/GameRoom';
import NamePrompt from './components/NamePrompt';
import { keyMappings } from './controls';

function App() {

  const initSocket = () => {
    console.log("initializing socket!");
    return io('http://localhost:3001');
  }

  const [name, setName] = useState("");
  const [keyPressVals] = useState({
    right: false,
    left: false,
    up: false,
    down: false,
  });
  const [playerData] = useState({ });
  const [userId, setUserId] = useState();
  const socket = useRef(null);

  const handleKey = (key, state='down', userId) => {
    key = key.toLowerCase();
    if (!keyMappings[key]) { return; }
    let newPressVals = { ...keyPressVals };
    newPressVals[keyMappings[key]] = (state == 'down');
    if (!userId) {
      console.log("No user ID!");
      console.log(userId);
    }
    if (socket.current && userId) { 
      socket.current.emit('controls_change', userId, keyMappings[key], state); 
    }
  }

  useEffect(() => {
    console.log("User ID set has been finalized as:");
    console.log(userId);
    const downListener = (e) => handleKey(e.key, 'down', userId);
    const upListener = (e) => handleKey(e.key, 'up', userId);
    document.addEventListener('keydown', downListener);
    document.addEventListener('keyup', upListener);
    return () => {
      document.removeEventListener('keydown', downListener);
      document.removeEventListener('keyup', upListener);
    }
  }, [userId]);

  function initSocketIo(newSocket) {    
    newSocket.on('accepted_connection', (id) => {
      setUserId(id);
      console.log(`ID: ${id}`);
    });

    newSocket.on('avatar_moved', (id, name, newX, newY) => {
      if (!playerData[id]) {
        playerData[id] = { 
          location: { },
          oldLocations: [],
        };
      }
      else {
        playerData[id].oldLocations.push({...playerData[id].location});
        if (playerData[id].oldLocations.length > 50) {
          playerData[id].oldLocations.splice(0,1);
        }
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
    socket.current = initSocket();
    initSocketIo(socket.current);

  }, []);

  const submitName = () => {
    socket.current.emit('connect_avatar', name);
  }

  return (
    <div className="App">
      <p>{userId}</p>
      <div className='Name-prompt'>
        <NamePrompt
          name={name}
          onNameChange={setName}
          onSubmit={submitName}
          disabled={userId && playerData[userId] && true}
        />
      </div>
        <GameRoom gameData={playerData}/>
    </div>
  );
}

export default App;
