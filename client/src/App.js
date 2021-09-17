import './App.css';
import SETTINGS from './app-settings.json'
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import GameRoom from './components/visualizer/GameRoom';
import ConnectionPrompt from './components/ConnectionPrompt';
import { Paper } from '@material-ui/core';

function App() {

  const initSocket = () => {
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
  const [color, setColor] = useState('red');
  const [roomDims, setRoomDims] = useState();
  const [joined, setJoined] = useState(false);
  const socket = useRef(null);

  const handleKey = (key, state='down', userId) => {
    key = key.toLowerCase();
    if (!SETTINGS.controls[key]) { return; }
    let newPressVals = { ...keyPressVals };
    newPressVals[SETTINGS.controls[key]] = (state === 'down');
    if (socket.current) { 
      socket.current.emit('controls_change', userId, SETTINGS.controls[key], state); 
    }
  }

  useEffect(() => {
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
    newSocket.on('accepted_connection', (id, roomDims) => {
      setUserId(id);
      setRoomDims(roomDims);
      newSocket.on('avatar_joined', (avatarId) => {
        if (avatarId===id) {
        }
      });
    });

    newSocket.on('avatar_moved', (id, name, newX, newY, color) => {
      if (!playerData[id]) {
        playerData[id] = { 
          location: { },
          oldLocations: [],
          color: SETTINGS.colorSettings.colors[color],
        };
      }
      else {
        playerData[id].oldLocations.push({...playerData[id].location});
        if (playerData[id].oldLocations.length > SETTINGS.globals.maxTrailRecord) {
          playerData[id].oldLocations.splice(0,1);
        }
      }
      playerData[id].location.x = newX;
      playerData[id].location.y = newY;
      playerData[id].name = name;
      playerData[id].color = SETTINGS.colorSettings.colors[color];
    });

    newSocket.on('client_disconnected', (id) => {
      if (playerData[id]) { delete playerData[id]; }
    });

    newSocket.on('avatar_left', (id) => {
      if (playerData[id]) { delete playerData[id]; }
    });

    newSocket.on('avatar_joined', (id) => {
      if (id === userId) {
        setJoined(true);
      }
    });

    return () => newSocket.close();
  }

  useEffect(() => {
    socket.current = initSocket();
    initSocketIo(socket.current);

  }, []);

  const submitConnect = () => {
    socket.current.emit('connect_avatar', name, color);
    setJoined(true);
  }

  const submitDisconnect = () => {
    socket.current.emit('disconnect_avatar');
    setJoined(false);
  }

  return (
    <div className='App'>
      <p>{userId}</p>
      <Paper className='Interface-container' style={{background: '#444444'}}>
        <Paper className='Name-prompt' style={{background: '#aaaaaa'}}>
          <ConnectionPrompt
            name={name}
            onNameChange={setName}
            colorOptions={SETTINGS.colorSettings.colorOptions}
            color={color}
            onColorChange={(color) => { setColor(color); }}
            onConnect={submitConnect}
            onDisconnect={submitDisconnect}
            connected={joined}
          />
        </Paper>
        <Paper 
          style={{
            width: '95%',
            height: '71%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#aaaaaa'
          }}
        >
          {(roomDims)? 
            <GameRoom 
              roomDims={roomDims}
              roomColor={SETTINGS.colorSettings.colors[SETTINGS.colorSettings.roomColor]}
              gameData={playerData}
            /> :
            null
          }
        </Paper>
      </Paper>
    </div>
  );
}

export default App;
