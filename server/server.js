const GameConfig = require('../client/src/config/config');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);

const players = {};
const asteroids = {};

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('a user connected: ', socket.id);
  // create a new player and add it to our players object
  players[socket.id] = {
    rotation: 0,
    x: 480,
    y: 320,
    playerId: socket.id,
    score: 0,
    hasShield: true,
  };
  // send the players object to the new player
  socket.emit('currentPlayers', players);
  // send the current scores
  socket.emit('scoreUpdate', scores);
  // update all other players of the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);

  // when a player disconnects, remove them from our players object
  socket.on('disconnect', function () {
    console.log('user disconnected: ', socket.id);
    delete players[socket.id];
    // emit a message to all players to remove this player
    io.emit('disconnect', socket.id);
  });

  // when a player moves, update the player data
  socket.on('playerMovement', function (movementData) {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    players[socket.id].rotation = movementData.rotation;
    // emit a message to all players about the player that moved
    socket.broadcast.emit('playerMoved', players[socket.id]);
  });

  socket.on('playerActivate', function () {
    socket.broadcast.emit('playerActivate', players[socket.id]);
    if (players[socket.id].team === 'red') {
      scores.red += 10;
    } else {
      scores.blue += 10;
    }
    star.x = Math.floor(Math.random() * 700) + 50;
    star.y = Math.floor(Math.random() * 500) + 50;
    io.emit('playerFired', star);
    io.emit('scoreUpdate', scores);
  });
  
  socket.on('playerDeactivate', function () {
    socket.broadcast.emit('playerDeactivate', players[socket.id]);
  });

  socket.on('playerDestroyed', function (owner) {
    players[socket.id].score += 10;
    io.emit('scoreUpdate', players[socket.id]);
  });

});

server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});
