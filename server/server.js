const express = require("express");
const { createServer } = require("http");
const cors = require('cors');

const app = express();
const server = createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8081;

const { GAME, IO } = require('./constants');
const Game = require('./game');

const players = {};

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

        if (io.engine.clientsCount === 0) {
            // gameWorld.gameStop();
            for (index in players) {
                delete players[index];
            }

            gameWorld = undefined;
            players = {};
        }
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
        gameWorld = new Game(io, playerlist);
        io.emit(IO.GAME_START, gameWorld.getPlayers());
    }
});

server.listen(port, function () {
    console.log(`Listening on ${server.address().port}`);
});
