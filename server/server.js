const GameConfig = require('../client/src/config/config');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);

const CONSTANTS = require('./constants');
const KeyCodes = require(Phaser.Input.Keyboard.KeyCodes);

const players = {};
const asteroids = {};
const state = {};
const clientRooms = {};
const defaultRoomName = "ABC12";

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
    console.log('a user connected: ', socket.id);

    socket.on('keyInput', onInput);
    socket.on('newGame', onNewGame);
    socket.on('joinGame', onJoinGame);
    socket.on('disconnect', onDisconnect);

    function onNewGame(key) {
        let roomName = defaultRoomName;
        // let roomName = randomRoomId(5);
        clientRooms[socket.id] = roomName;
        socket.emit('gameId', roomName);

        state[roomName] = initGame();

        socket.join(roomName);
        socket.playerId = 1;
        socket.emit('init', socket.playerId);
    }

    function onJoinGame(roomName) {
        roomName = defaultRoomName;
        const room = io.sockets.adapter.rooms[roomName];

        let allUsers;
        if (room) allUsers = room.sockets;

        let numClients = 0;
        if (allUsers) numClients = Object.keys(allUsers).length;

        if (numClients === 0) {
            socket.emit('unknownCode');
            return;
        } else if (numClients >= CONSTANTS.GAME.maxPlayers) {
            socket.emit('tooManyPlayers');
            return;
        }

        clientRooms[socket.id] = roomName;

        socket.join(roomName);
        socket.playerId = numClients;
        socket.emit('init', socket.playerId);

        startGameInterval(roomName);
    }

    function onDisconnect(key) {
        console.log('user disconnected: ', socket.playerId);
        io.emit('disconnect', socket.playerId);
    }

    function onInput(key) {
        const roomName = clientRooms[socket.id];
        if (!roomName) {
            return;
        }

        if (key.keyCode === KeyCodes.LEFT && key.isDown) {
            this.player.rotateCounterClockwise();
        } else if (key.keyCode === KeyCodes.RIGHT && key.isDown) {
            this.player.rotateClockwise();
        } else {
            this.player.rotateStop();
        }

        if (key.keyCode === KeyCodes.UP && key.isDown) {
            this.player.thrust();
        } else {
            this.player.idle();
        }

        if (this.cursors.space.isDown) {
            this.player.activateShield();
        }
    }
});

function randomRoomId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var index = 0; index < length; index++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function startGameInterval(roomName) {
    const intervalId = setInterval(() => {
        const inPlay = gameLoop(state[roomName]);

        if (inPlay) {
            update(roomName, state[roomName])
        } else {
            gameOver(roomName, winner);
            state[roomName] = null;
            clearInterval(intervalId);
        }
    }, 1000 / CONSTANTS.GAME.frameRate);
}

function update(room, gameState) {
    server.sockets.in(room).emit('update', JSON.stringify(gameState));
}

function gameOver(room) {
    server.sockets.in(room).emit('gameOver');
}

server.listen(8081, function () {
    console.log(`Listening on ${server.address().port}`);
});
