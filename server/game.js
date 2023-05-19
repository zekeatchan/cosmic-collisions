const { ArcadePhysics } = require('arcade-physics');
const { GAME, ASTEROIDS, SHIP, SHIELD, IO } = require('./constants');

module.exports = {
    createGameState, game,
}

function createGameState(players) {
    const playerList = {};

    for (id in players) {
        playerList[id] = {
            shield: 0,
            shieldCooldown: 0,
            shipCooldown: SHIP.spawnDuration,
            rotation: 0,
            state: SHIP.INVULNERABLE,
            position: { x: 0, y: 0 },
        }
    }

    return {
        players: playerList,
        asteroids: {}, // position, size
    };
}

function game(io, gameState, playerInput) {
    const config = {
        width: GAME.width,
        height: GAME.height,
        gravity: {
            x: 0,
            y: 0
        }
    }

    const players = gameState.players;
    const physics = new ArcadePhysics(config);

    const ships = [];
    const shields = [];
    const asteroids = [];
    const scores = [];
    let tick = 0;
    let intervalId;

    function init() {
        for (id in players) {
            const ship = Ship(id, physics);
            ships.push(ship);
            players[id].position = ship.body.position;
        }

        for (let count = 0; count < ASTEROIDS.countStart; count++) {
            const position = {
                x: GAME.width * Math.random(),
                y: GAME.height * Math.random()
            }
            addAsteroid(ASTEROIDS.sizeStart, position);
        }
    }

    function update(delta) {
        physics.world.update(tick * 1000, 1000 / GAME.frameRate);
        physics.world.postUpdate(tick * 1000, 1000 / GAME.frameRate);
        tick++;

        updateInput();
        updateCooldown(delta);
        updateAsteroids();
        wrapObjects();

        // if (tick < 100) console.log(JSON.stringify(gameState));
        io.emit(IO.UPDATE, JSON.stringify(gameState));
    }

    function updateInput() {
        for (let id in playerInput) {
            const input = playerInput[id].input;
            const ship = ships.find((ship) => ship.id === id);
            const player = players[id];

            if (!ship || !player) return;

            if (input.left) {
                ship.rotateCounterClockwise();
            } else if (input.left) {
                ship.rotateClockwise();
            } else {
                ship.rotateStop();
            }

            if (input.up) {
                ship.thrust();
            } else {
                ship.idle();
            }

            if (input.space) {
                if (player.shieldCooldown === 0) {
                    player.shield = SHIELD.duration;
                    player.shieldCooldown = SHIELD.cooldown;
                    io.emit(IO.SHIELD, id);
                }
            }

            player.position = ship.body.position;
            player.rotation = ship.body.rotation;
            console.log(player.position);
        }
    }

    function updateCooldown(delta) {
        for (let id in players) {
            const player = players[id];
            if (!player) continue;
            player.shield = player.shield - delta > 0 ? player.shield - delta : 0;
            player.shieldCooldown = player.shieldCooldown - delta > 0 ? player.shieldCooldown - delta : 0;
        }
    }

    function updateAsteroids() {
        for (let index = 0; index < asteroids.length; index++) {
            const asteroid = asteroids[index];
            gameState.asteroids[asteroid.id] = {
                size: asteroid.size,
                position: asteroid.body.position,
            }
        }
    }

    function wrapObjects() {
        const bounds = physics.world.bounds;
        wrapArray(ships, 16);
        wrapArray(asteroids, 32);

        // added wrapArray, wrapObject and Wrap functions
        // the server-side arcade physics implementation does not work
        function wrapArray(objects, padding) {
            for (let i = 0; i < objects.length; i++) {
                wrapObject(objects[i], padding)
            }
        }

        function wrapObject(object, padding) {
            if (object === undefined || object.body === undefined) return;

            if (padding === undefined) {
                padding = 0
            }

            object.body.position.x = Wrap(object.body.position.x, bounds.left - padding, bounds.right + padding);
            object.body.position.y = Wrap(object.body.position.y, bounds.top - padding, bounds.bottom + padding);
        }

        function Wrap(value, min, max) {
            const range = max - min;
            return min + ((((value - min) % range) + range) % range);
        }
    }

    function addAsteroid(size, position = null) {
        const asteroid = new Asteroid(physics, size, position);
        asteroids.push(asteroid);
    }

    function gameStart() {
        let lastUpdate = Date.now();

        intervalId = setInterval(() => {
            const now = Date.now();
            const delta = now - lastUpdate;

            update(delta);
        }, 1000 / GAME.frameRate);
    }

    function gameStop() {
        clearInterval(intervalId);
    }

    init();
    gameStart();

    return {
        world: physics,
        gameStart: gameStart,
        gameStop: gameStop,
    };
}

function Ship(playerId, world) {
    let currentState;

    const id = playerId;
    const ship = world.add.body(GAME.width * Math.random(), GAME.height * Math.random());
    ship.setCircle(SHIP.colliderSize);
    ship.setDamping(true);
    ship.setDrag(SHIP.drag, SHIP.drag);
    ship.setBounce(SHIP.bounce, SHIP.bounce);
    ship.setMaxVelocity(SHIP.velocityMaximum);

    function rotateClockwise() {
        ship.setAngularVelocity(SHIP.angularVelocity);
    }

    function rotateCounterClockwise() {
        ship.setAngularVelocity(-SHIP.angularVelocity);
    }

    function rotateStop() {
        ship.setAngularVelocity(0);
    }

    function thrust() {
        const direction = world.velocityFromRotation(ship.rotation, 1);;
        const velocity = ship.velocity;

        velocity.x += direction.x * SHIP.acceleration;
        velocity.y += direction.y * SHIP.acceleration;

        ship.setVelocity(velocity.x, velocity.y);
    }

    function idle() {
        ship.setAcceleration(0);
    }

    function getState() {
        return state;
    }

    function setState(state) {
        currentState = state;
        if (state === SHIP.DEAD) {
            ship.checkCollision.none = true;
        } else if (state === SHIP.INVULNERABLE) {
            ship.checkCollision.none = true;
        } else if (state === SHIP.LIVE) {
            ship.checkCollision.none = false;
        }
    }

    function reset() {
        setState(SHIP.INVULNERABLE);
    }

    setState(SHIP.INVULNERABLE);

    return {
        id: id,
        body: ship,
        rotateClockwise: rotateClockwise,
        rotateCounterClockwise: rotateCounterClockwise,
        rotateStop: rotateStop,
        thrust: thrust,
        idle: idle,
        setState: setState,
        getState: getState,
        reset: reset,
    };
}

function Shield(world) {

}

function Asteroid(world, size, position) {
    if (!position) {
        position = {
            x: Math.round(Math.random()) ? Config.scale.width + ASTEROIDS.bounds : -ASTEROIDS.bounds,
            y: Math.round(Math.random()) ? Config.scale.height + ASTEROIDS.bounds : -ASTEROIDS.bounds
        }
    }

    const id = randomId(10);
    const asteroid = world.add.body(position.x, position.y);
    asteroid.setCircle(ASTEROIDS.colliderSize[size]);
    asteroid.setBounce(ASTEROIDS.bounce);

    return {
        body: asteroid,
        id: id,
        size: size,
    };
}

function randomId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var index = 0; index < length; index++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}