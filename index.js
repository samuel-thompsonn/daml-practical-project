const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const ava = require('./server/Avatar')
const SETTINGS = require('./server/server-settings.json')
const PORT = 3001;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET"]
    }
});

const AVATAR_SPEED = SETTINGS.gameSettings.avatarSpeed; //pixels per second
const FRAMES_PER_SECOND = SETTINGS.gameSettings.framesPerSecond;
const MILLIS_PER_FRAME = 1000 / FRAMES_PER_SECOND;
const BOUNDS = {
    MIN_X: SETTINGS.gameSettings.bounds.minX,
    MAX_X: SETTINGS.gameSettings.bounds.maxX,
    MIN_Y: SETTINGS.gameSettings.bounds.minY,
    MAX_Y: SETTINGS.gameSettings.bounds.maxY
};
const VERBOSITY = SETTINGS.debugSettings.verbosity;
const AVATAR_START_POS = SETTINGS.gameSettings.avatarStartPos;

const clientList = [];
var clientCount = 0;

function logDebugMessage(message, verbosityLevel) {
    if (VERBOSITY < verbosityLevel) {
        return;
    }
    console.log(message);
}

app.use(express.static(path.join(__dirname, 'client/build')))

app.get('/api/players', (req, res) => {
    const returnedList = [];
    for (let client of clientList) {
        if (!client.avatar) { continue; }
        returnedList.push({
            id: client.id,
            name: client.name,
            color: client.color
        });
    }
    res.json(returnedList);
});

app.get('/', (req, res) => {
    logDebugMessage("Received a GET request.", 1);
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

io.on('connection', (socket) => {
    const clientId = clientCount;
    logDebugMessage(`A user with id ${clientId} connected.`, 1);
    const newClient = { 
        id: clientId, 
        name: null,
        socket: socket,
        controls_status: { 
            right: false,
            left: false,
            up: false,
            down: false,
        },
        avatar: null,
        color: null,
    };
    clientList.push(newClient);
    sendAllLocations(newClient, clientList);

    socket.on('connect_avatar', (name, color) => {
        newClient.name = name;
        newClient.color = color;
        newClient.avatar = new ava.Avatar(AVATAR_START_POS.x, AVATAR_START_POS.y, color);
        for (let otherClient of clientList) {
            otherClient.socket.emit('avatar_joined', newClient.id);
        }
    });

    socket.on('disconnect_avatar', () => {
        newClient.avatar = null;
        newClient.color = null;
        newClient.name = null;
        newClient.controls_status = { 
            right: false,
            left: false,
            up: false,
            down: false,
        };
        logDebugMessage(`${newClient.id}'s avatar has left.`, 1);
        for (let otherClient of clientList) {
            otherClient.socket.emit('avatar_left', newClient.id);
        }
    });

    socket.on('controls_change', (id, control, newState) => {
        let target_client_idx = clientList.findIndex((client) => client.id === id);
        if (target_client_idx < 0) { return; }
        let target_client = clientList[target_client_idx];
        if (!target_client.avatar) { return; }

        target_client.controls_status[control] = (newState == 'down');
    });

    socket.emit('accepted_connection', clientId, { 
        roomWidth: BOUNDS.MAX_X - BOUNDS.MIN_X,
        roomHeight: BOUNDS.MAX_Y - BOUNDS.MIN_Y
    });
    socket.on('disconnect', () => {
        logDebugMessage("A user disconnected.", 1);
        disconnector_idx = clientList.findIndex((client) => client.id === clientId);
        clientList.splice(disconnector_idx, 1);
        for (let client of clientList) {
            client.socket.emit('client_disconnected', clientId)
        }
    })
    clientCount ++;
});

function sendAllLocations(targetClient, allClients) {
    for (let otherClient of allClients) {
        if (!otherClient.avatar) { continue; }
        targetClient.socket.emit('avatar_moved', otherClient.id, otherClient.name, otherClient.avatar.x, otherClient.avatar.y, otherClient.color);
    }
}

function gameLoop() {    
    for (let client of clientList) {
        if (client.controls_status.right) {
            newX = client.avatar.x + (AVATAR_SPEED / FRAMES_PER_SECOND);
            client.avatar.x = Math.min(newX, BOUNDS.MAX_X)
        }
        if (client.controls_status['left']) {
            newX = client.avatar.x - (AVATAR_SPEED / FRAMES_PER_SECOND);
            client.avatar.x = Math.max(newX, BOUNDS.MIN_X)
        }
        if (client.controls_status['up']) {
            newY = client.avatar.y - (AVATAR_SPEED / FRAMES_PER_SECOND);
            client.avatar.y = Math.max(newY, BOUNDS.MIN_Y);
        }
        if (client.controls_status['down']) {
            newY = client.avatar.y + (AVATAR_SPEED / FRAMES_PER_SECOND);
            client.avatar.y = Math.min(newY, BOUNDS.MAX_Y);
        }
    }
    for (let client of clientList) {
        sendAllLocations(client, clientList);
    }
}

server.listen(PORT, () => {
    logDebugMessage(`server listening on port ${PORT}`, 1);
    setInterval(gameLoop, MILLIS_PER_FRAME);
});