const { ArcadePhysics } = require('arcade-physics');
// const PhaserArcadePhysics = require('./phaser-arcade-physics');
const Constants = require('./constants');
const Ship = require('./gameObjects/Ship');
const Asteroid = require('./gameObjects/Asteroid');
const Shield = require('./gameObjects/Shield');

class Game {
    constructor(io, playerlist) {
        this.io = io;
        this.playerlist = playerlist;
        this.gameState = this.initPlayers();
        this.physics = this.initPhysics();

        this.ships = [];
        this.shields = [];
        this.asteroids = [];
        this.scores = [];
        this.tick = 0;
        this.intervalId;

        this.initGameWorld();
        this.gameStart();
    }

    initPlayers() {
        const players = {};
        for (let id in this.playerlist) {
            players[id] = {
                score: 0,
                shield: 0,
                shieldCooldown: 0,
                shipCooldown: Constants.SHIP.spawnDuration,
                rotation: 0,
                state: Constants.SHIP.INVULNERABLE,
                position: { x: 0, y: 0 },
            }
        }

        return {
            players: players,
            asteroids: {},
        };
    }

    initPhysics() {
        const config = {
            width: Constants.GAME.width,
            height: Constants.GAME.height,
            gravity: { x: 0, y: 0 },
        }

        return new ArcadePhysics(config);
    }

    initGameWorld() {
        const players = this.gameState.players;

        for (let id in players) {
            const ship = new Ship(id, this.physics);
            this.ships.push(ship);
            players[id].position = ship.position;

            const shield = new Shield(id, this.physics, ship.position);
            this.shields.push(shield);

            const removeInvulnerabilityInterval = setInterval(() => {
                this.removeInvulnerability(ship);
                clearInterval(removeInvulnerabilityInterval);
            }, Constants.SHIP.spawnDuration);
        }

        for (let count = 0; count < Constants.ASTEROIDS.countStart; count++) {
            const position = {
                x: Constants.GAME.width * Math.random(),
                y: Constants.GAME.height * Math.random()
            }
            this.addAsteroid(Constants.ASTEROIDS.sizeStart, position);
        }

        this.physics.add.collider(this.ships);
        this.physics.add.collider(this.shields, this.asteroids, this.collideWithShields, null, this);
        this.physics.add.overlap(this.ships, this.asteroids, this.playerAsteroidCollision, null, this);
        this.physics.add.overlap(this.asteroids, null, this.asteroidsCollision, null, this);
    }

    update(delta) {
        this.physics.world.update(this.tick * 1000, 1000 / Constants.GAME.frameRate);
        this.physics.world.postUpdate(this.tick * 1000, 1000 / Constants.GAME.frameRate);
        this.tick++;

        this.updateInput();
        // this.updateCooldown(delta);
        this.updateAsteroids();
        this.wrapObjects();

        this.io.emit(Constants.IO.UPDATE, JSON.stringify(this.gameState));
    }

    updateInput() {
        const players = this.gameState.players;

        for (let id in this.playerlist) {
            const input = this.playerlist[id].input;
            const ship = this.ships.find((ship) => ship.getPlayerId() === id);
            const shield = this.shields.find((shield) => shield.getPlayerId() === id);
            const player = players[id];

            if (!ship || !player || ship.getState() === Constants.SHIP.DEAD) continue;

            if (input.left) ship.rotateCounterClockwise();
            if (input.right) ship.rotateClockwise();
            if ((!input.left && !input.right) || (input.left && input.right)) ship.rotateStop();
            if (input.up) ship.accelerate();
            else ship.idle();

            if (input.space) {
                this.activateShield(shield);
            }

            shield.setPosition(ship.position);
            player.position = ship.position;
            player.rotation = ship.rotation;
            player.angle = ship.angle;
        }
    }

    activateShield(shield) {
        if (shield.isEnabled() || !shield.getReady()) return;
        this.io.emit(Constants.IO.SHIELD, shield.getPlayerId());

        const ship = this.ships.find((ship) => ship.getPlayerId() === shield.getPlayerId());
        shield.enableCollisions(true);
        shield.setReady(false);
        shield.setPosition(ship.position);

        const shieldInterval = setInterval(() => {
            shield.enableCollisions(false);
            clearInterval(shieldInterval);
        }, Constants.SHIELD.duration);

        const readyInterval = setInterval(() => {
            shield.setReady(true);
            clearInterval(shieldInterval);
        }, Constants.SHIELD.cooldown);
    }

    updateCooldown(delta) {
        const players = this.gameState.players;

        for (let id in players) {
            const player = players[id];
            if (!player) continue;
            player.shield = player.shield - delta > 0 ? player.shield - delta : 0;
            player.shieldCooldown = player.shieldCooldown - delta > 0 ? player.shieldCooldown - delta : 0;
            player.shipCooldown = player.shipCooldown - delta > 0 ? player.shipCooldown - delta : 0;

            const shield = this.shields.find((shield) => shield.getPlayerId() === id);
            const ship = this.ships.find((ship) => ship.getPlayerId() === id);
            if (shield && player.shield === 0) {
                shield.enableShield(false);
            }

            if (player.shipCooldown === 0) {
                if (ship.getState() === Constants.SHIP.INVULNERABLE) {
                    ship.setState(Constants.SHIP.LIVE);
                } else if (ship.getState() === Constants.SHIP.DEAD) {
                    ship.setState(Constants.SHIP.INVULNERABLE);
                }
            }
        }
    }

    updateAsteroids() {
        for (let index = 0; index < this.asteroids.length; index++) {
            const asteroid = this.asteroids[index];
            this.gameState.asteroids[asteroid.getId()] = {
                size: asteroid.getSize(),
                position: asteroid.getPosition(),
            }
        }
    }

    updateScore(playerId, score) {
        const players = this.gameState.players;
        const player = players[playerId];
        player.score += score;
    }

    asteroidsCollision(asteroid1, asteroid2) {
        const playerId = asteroid1.getPlayerId() || asteroid2.getPlayerId();
        if (playerId) {
            if (asteroid1.getPlayerId() === asteroid2.getPlayerId()) return;

            const score1 = Constants.POINTS.asteroids[asteroid1.getSize()];
            const score2 = Constants.POINTS.asteroids[asteroid2.getSize()];
            this.destroyAsteroid(asteroid1);
            this.destroyAsteroid(asteroid2);

            this.updateScore(playerId, score1);
            this.updateScore(playerId, score2);
        }
    }

    playerAsteroidCollision(ship, asteroid) {
        const players = this.gameState.players;
        const player = players[ship.getPlayerId()];
        if (!player || ship.getState() !== Constants.SHIP.LIVE) return;

        const score = Constants.POINTS.asteroids[asteroid.getSize()];
        const asteroidOwnerId = asteroid.getPlayerId();

        if (asteroidOwnerId) {
            this.updateScore(asteroidOwnerId, score);
            this.updateScore(asteroidOwnerId, Constants.POINTS.ship);
        } else {
            this.updateScore(ship.getPlayerId(), score);
        }

        this.destroyAsteroid(asteroid);
        this.destroyPlayer(ship);
    }

    collideWithShields(shield, asteroid) {
        asteroid.setPlayerId(shield.getPlayerId());
        this.io.emit(Constants.IO.ASTEROID_OWNED, asteroid.getId(), asteroid.getPlayerId());

        const removeAsteroidOwnerInterval = setInterval(() => {
            asteroid.setPlayerId(undefined);
            clearInterval(removeAsteroidOwnerInterval);
        }, Constants.ASTEROIDS.ownerCooldown);
    }

    destroyAsteroid(asteroid) {
        const id = asteroid.getId();
        this.io.emit(Constants.IO.DESTROY_ASTEROID, id);

        const position = asteroid.getPosition();
        const size = asteroid.getSize();

        const asteroidIndex = this.asteroids.findIndex((asteroidObject) => asteroidObject.id === id);

        this.asteroids.splice(asteroidIndex, 1);
        
        asteroid.destroy();
        
        if (size > 0) {
            this.addAsteroid(size - 1, position);
            this.addAsteroid(size - 1, position);
        }
    }
    
    destroyPlayer(ship) {
        ship.setState(Constants.SHIP.DEAD);
        const id = ship.getPlayerId();
        this.io.emit(Constants.IO.DESTROY_PLAYER, id);

        const respawnInterval = setInterval(() => {
            this.respawnPlayer(ship);
            clearInterval(respawnInterval);
        }, Constants.SHIP.spawnDuration);
    }
    
    respawnPlayer(ship) {
        ship.setState(Constants.SHIP.INVULNERABLE);
        const id = ship.getPlayerId();
        this.io.emit(Constants.IO.RESPAWN_PLAYER, ship.getPlayerId());

        const removeInvulnerabilityInterval = setInterval(() => {
            this.removeInvulnerability(ship);
            clearInterval(removeInvulnerabilityInterval);
        }, Constants.SHIP.spawnDuration);
    }

    removeInvulnerability(ship) {
        ship.setState(Constants.SHIP.LIVE);
    }

    wrapObjects() {
        this.physics.world.wrap(this.ships, 16)
        this.physics.world.wrap(this.asteroids, 32)
    }

    addAsteroid(size, position = null) {
        const asteroid = new Asteroid(this.randomId(10), this.physics, size, position);
        this.asteroids.push(asteroid);
    }

    gameStart() {
        let lastUpdate = Date.now();

        this.intervalId = setInterval(() => {
            const now = Date.now();
            const delta = now - lastUpdate;

            this.update(delta);
        }, 1000 / Constants.GAME.frameRate);
    }

    gameStop() {
        clearInterval(this.intervalId);
        this.cleanUp();
    }

    reset() {
        this.ships = [];
        this.shields = [];
        this.asteroids = [];
        this.scores = [];
        this.tick = 0;
        this.intervalId;
    }

    randomId(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var index = 0; index < length; index++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    getPlayers() {
        return this.gameState.players;
    }

    cleanUp() {
        for (let index = 0; index < this.asteroids.length; index++) {
            const asteroid = this.asteroids[index];
            asteroid.destroy();
        }

        for (let index = 0; index < this.ships.length; index++) {
            const ship = this.ships[index];
            ship.destroy();
        }

        for (let index = 0; index < this.shields.length; index++) {
            const shield = this.shields[index];
            shield.destroy();
        }
    }
}

module.exports = Game;