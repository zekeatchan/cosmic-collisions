const { createGameState, game } = require('./game');
const express = require("express");
const { createServer } = require("http");
const cors = require('cors');

const app = express();
const server = createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8081;

const { GAME, IO } = require('./constants');

const players = {};
const clientRooms = {};
const defaultRoomName = "ABC12";

let gameState;
let gameWorld;

app.use(cors());
// app.use(serveStatic(__dirname + "/client/dist"));
app.use(express.static(__dirname + '/dist'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
    // res.sendFile(__dirname + '/index.html');
});

io.on(IO.CONNECTION, (socket) => {
    console.log('a user connected: ', socket.id);
    console.log('Users: ', io.engine.clientsCount);

    socket.on(IO.KEY_INPUT, (input) => {
        players[socket.id].input = input;
    });

    socket.on(IO.DISCONNECT, () => {
        console.log('user disconnected: ', socket.id);
        console.log('Users: ', io.engine.clientsCount);
        io.emit(IO.DISCONNECT, socket.id);
        delete players[socket.id];
    });

    socket.on(IO.PLAYER_READY, () => {
        players[socket.id].ready = true;

        let playersReady = true;

        for (index in players) {
            const player = players[index];
            if (!player.ready) playersReady = false;
        }

        if (playersReady) startGame(players);
    });

    if (io.engine.clientsCount > GAME.maxPlayers) {
        socket.emit(IO.MAX_PLAYERS);
        return;
    };

    players[socket.id] = {
        input: {
            space: false,
            up: false,
            left: false,
            right: false,
        },
        ready: false,
    };

    socket.emit(IO.INIT, socket.id);
    
    if (io.engine.clientsCount > 1) io.emit(IO.LOBBY_READY);

    function startGame(playerlist) {
        gameState = createGameState(playerlist);
        gameWorld = game(io, gameState, playerlist);
        // io.emit(IO.NEW_PLAYER, gameState.players);
        io.emit(IO.GAME_START, gameState.players);
    }

    function onDisconnect() {

    }

    function onInput(input) {
        // const roomName = clientRooms[socket.id];
        // if (!roomName) return;

        // if (key.keyCode === KeyCodes.LEFT && key.isDown) {
        //     this.player.rotateCounterClockwise();
        // } else if (key.keyCode === KeyCodes.RIGHT && key.isDown) {
        //     this.player.rotateClockwise();
        // } else {
        //     this.player.rotateStop();
        // }

        // if (key.keyCode === KeyCodes.UP && key.isDown) {
        //     this.player.thrust();
        // } else {
        //     this.player.idle();
        // }

        // if (this.cursors.space.isDown) {
        //     this.player.activateShield();
        // }
    }
});

function startGameInterval(roomName) {
    // let lastUpdate = Date.now();

    const intervalId = setInterval(() => {
        // const now = Date.now();
        // const delta = now - lastUpdate;

        const inPlay = game();
        // const inPlay = gameUpdate(delta);

        if (!inPlay) {
            gameOver();
            clearInterval(intervalId);
        }
    }, 1000 / GAME.frameRate);
}

// function update(room, gameState) {
//     server.sockets.in(room).emit('update', JSON.stringify(gameState));
// }

function gameOver() {
    server.sockets.in(room).emit(IO.GAME_OVER);
}

server.listen(port, function () {
    console.log(`Listening on ${server.address().port}`);
});
