import 'phaser';
import Config from '../config/config';
import Ship from '../game/Ship';
import AsteroidsController from '../game/AsteroidsController';
import ExplosionAsteroids from '../game/ExplosionAsteroids';
import ExplosionShips from '../game/ExplosionShips';
import Shield from '../game/Shield';
import Resources from '../config/resources';

const GAME_TIME = 120;

export default class GameScene extends Phaser.Scene {
    constructor() {
        super(Config.scenes.Game);
    }

    create() {
        this.player;
        this.players = [];
        this.shields = [];
        this.asteroids = [];
        this.scores = [];

        this.initBackground();
        this.initPlayers();
        this.initAsteroids();
        this.initGameUI();
        this.initCollisions();
        this.initControls();
        this.initClock();
        this.initScores();
    }

    update(time, delta) {
        this.updateInput();
        this.updatePlayers();
        this.wrapGameObjects();
    }

    initBackground() {
        this.add.image(0, 0, Resources.image.background.key).setOrigin(0, 0).setDisplaySize(Config.scale.width, Config.scale.height);
    }

    initGameUI() {

    }

    initControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    initPlayers() {
        this.addPlayer(1);
        this.addPlayer(2);
        this.addPlayer(3);
        this.addPlayer(4);

        this.makePlayer(1);
    }

    initAsteroids() {
        this.asteroidController = new AsteroidsController(this);
    }

    initCollisions() {
        this.physics.add.collider(this.players);
        this.physics.add.collider(this.shields, this.asteroidController.getAsteroidsList(), this.collideWithShields, null, this);
        this.physics.add.overlap(this.players, this.asteroidController.getAsteroidsList(), this.playerAsteroidCollision, null, this);
        this.physics.add.overlap(this.asteroidController.getAsteroidsList(), null, this.asteroidsCollision, null, this);
    }

    initClock() {
        this.countdownText = this.add.text(Config.scale.centerX, 32);
        this.countdown = this.time.addEvent({
            delay: 1000, callback: () => {
                const minutes = Math.floor(this.countdown.repeatCount / 60);
                let seconds = String(this.countdown.repeatCount - (minutes * 60));
                if (seconds.length === 1) seconds = "0" + seconds;
                this.countdownText.setText(`${minutes}:${seconds}`);
                if (this.countdown.repeatCount === 0) this.gameOver();
            }, callbackScope: this, repeat: GAME_TIME
        });
    }

    initScores() {
        for (let count = 0; count < 4; count++) {
            const scoreObject = {
                score: 0,
                player: count + 1,
                textField: this.add.text(20, 20 + (20 * count), `Player ${count + 1}: 0`)
            }
            this.scores.push(scoreObject);
        }
    }

    asteroidsCollision(asteroid1, asteroid2) {
        const ownerId = asteroid1.ownerId || asteroid2.ownerId;
        if (ownerId) {
            if (asteroid1.ownerId === asteroid2.ownerId) return;

            const score1 = asteroid1.points;
            const score2 = asteroid2.points;
            this.destroyAsteroid(asteroid1);
            this.destroyAsteroid(asteroid2);

            this.updateScore(ownerId, score1);
            this.updateScore(ownerId, score2);
        }
    }

    playerAsteroidCollision(ship, asteroid) {
        const score = asteroid.points;
        const asteroidOwnerId = asteroid.ownerId;

        if (asteroidOwnerId) {
            this.updateScore(asteroidOwnerId, score);
            this.updateScore(asteroidOwnerId, ship.points);
        } else {
            this.updateScore(ship.id, score);
        }

        this.destroyAsteroid(asteroid);
        this.destroyPlayer(ship);
    }

    collideWithShields(shield, asteroid) {
        asteroid.setOwnerId(shield.id);
    }

    wrapGameObjects() {
        this.physics.world.wrap(this.players, 16);
        this.physics.world.wrap(this.asteroidController.getAsteroidsList(), 32);
    }

    updateInput() {
        if (!this.player || !this.player.active) return;

        let direction = (this.cursors.left.isDown ? -1 : 0) + (this.cursors.right.isDown ? 1 : 0);

        if (direction === -1) {
            this.player.rotateCounterClockwise();
        } else if (direction === 1) {
            this.player.rotateClockwise();
        } else {
            this.player.rotateStop();
        }

        // if (this.cursors.left.isDown) {
        //     this.player.rotateCounterClockwise();
        // } else if (this.cursors.right.isDown) {
        //     this.player.rotateClockwise();
        // } else {
        //     this.player.rotateStop();
        // }

        if (this.cursors.up.isDown) {
            this.player.thrust();
        } else {
            this.player.idle();
        }

        if (this.cursors.space.isDown) {
            this.player.activateShield();
        }
    }

    destroyAsteroid(asteroid) {
        new ExplosionAsteroids(this, asteroid.size, asteroid.getPosition());
        this.asteroidController.destroyAsteroid(asteroid);
    }

    addPlayer(id) {
        const shield = new Shield(this, id);
        this.shields.push(shield);
        this.players.push(new Ship(this, id, shield));
    }

    destroyPlayer(ship) {
        new ExplosionShips(this, ship.id, ship.getPosition());
        ship.destroyShip();
    }

    updateScore(playerId, points) {
        const playerScore = this.scores[playerId - 1];
        playerScore.score += points;
        playerScore.textField.setText(`Player ${playerId}: ${playerScore.score}`);
    }

    updatePlayers() {
        for (let index = 0; index < this.players.length; index++) {
            const player = this.players[index];
            player.update();
        }
    }

    gameOver() {
        Config.game.scores = this.scores;
        this.gotoScoreBoardScene();
    }

    makePlayer(id) {
        this.player = this.players[id - 1];
        this.shields[id - 1].makePlayer();
    }

    gotoScoreBoardScene() {
        this.scene.start(Config.scenes.Scoreboard);
    }
};
