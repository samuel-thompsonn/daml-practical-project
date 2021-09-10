const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const ava = require('./server/Avatar')
const PORT = 3001;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const VEHICLE_SPEED = 200; //pixels per second
const FRAMES_PER_SECOND = 60;

const clientList = [];
var clientCount = 0;

app.use(express.static(path.join(__dirname, 'client/build')))

app.get('/', (req, res) => {
    console.log("Received a GET request.");
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

io.on('connection', (socket) => {
    console.log("A user connected.");
    clientId = clientCount;
    newClient = { 
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
    };
    clientList.push(newClient);
    sendAllLocations(newClient, clientList);

    socket.on('connect_avatar', (name) => {
        newClient.name = name;
        newClient.avatar = new ava.Avatar(250, 100);
    });

    socket.on('controls_change', (id, control, newState) => {
        let target_client_idx = clientList.findIndex((client) => client.id === id);
        if (target_client_idx < 0) { return; }
        let target_client = clientList[target_client_idx];
        if (!target_client.avatar) { return; }

        target_client.controls_status[control] = (newState == 'down');
    });

    socket.emit('accepted_connection', clientId);
    socket.on('disconnect', () => {
        console.log("A user disconnected.");
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
        targetClient.socket.emit('avatar_moved', otherClient.id, otherClient.name, otherClient.avatar.x, otherClient.avatar.y);
    }
}

function gameLoop() {    
    for (let client of clientList) {
        if (client.controls_status.right) {
            client.avatar.x += VEHICLE_SPEED / FRAMES_PER_SECOND;
        }
        if (client.controls_status['left']) {
            client.avatar.x -= VEHICLE_SPEED / FRAMES_PER_SECOND;
        }
        if (client.controls_status['up']) {
            client.avatar.y -= VEHICLE_SPEED / FRAMES_PER_SECOND;
        }
        if (client.controls_status['down']) {
            client.avatar.y += VEHICLE_SPEED / FRAMES_PER_SECOND;
        }
    }
    for (let client of clientList) {
        sendAllLocations(client, clientList);
    }
}

server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
    setInterval(gameLoop, 1000 / FRAMES_PER_SECOND);
});