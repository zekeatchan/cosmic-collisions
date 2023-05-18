import Config from '../config/config';
import Asteroid from './Asteroid';

const STARTING_ASTEROIDS = 4;
const MAX_ASTEROIDS = 30;
const INTERVAL_MINIMUM = 5;
const INTERVAL_MAXIMUM = 10;
const ASTEROID_STARTING_SIZE = 2;

export default class AsteroidsController {
    constructor(scene) {
        this.scene = scene;
        this.asteroids = [];
        this.spawnTimer;
        this.init();
    }

    init() {
        this.setupAsteroids();
        this.spawnStart();
    }

    setupAsteroids() {
        for (let count = 0; count < STARTING_ASTEROIDS; count++) {
            const position = {
                x: Phaser.Math.Between(0, Config.scale.width),
                y: Phaser.Math.Between(0, Config.scale.height)
            }
            this.addAsteroid(ASTEROID_STARTING_SIZE, position);
        }
    }

    spawnStart() {
        if (this.asteroids.length > MAX_ASTEROIDS) {
            this.spawnStop();
            return;
        }

        const delay = Phaser.Math.Between(INTERVAL_MINIMUM * 1000, INTERVAL_MAXIMUM * 1000);
        this.spawnTimer = this.scene.time.delayedCall(delay, () => {
            this.addAsteroid(ASTEROID_STARTING_SIZE);
            this.spawnStart();
        }, [], this);
    }

    spawnStop() {
        this.spawnTimer?.remove();
        this.spawnTimer = undefined;
    }

    addAsteroid(size, position = null) {
        const asteroid = new Asteroid(this.scene, size, position)
        this.asteroids.push(asteroid);
    }

    destroyAsteroid(asteroid) {
        const position = asteroid.getPosition();
        const size = asteroid.getSize();

        if (size > 0) {
            this.addAsteroid(size - 1, position);
            this.addAsteroid(size - 1, position);
        }

        this.removeAsteroid(asteroid);
    }

    removeAsteroid(asteroid) {
        for (let index = 0; index < this.asteroids.length; index++) {
            if (this.asteroids[index] === asteroid) {
                const asteroidToRemove = this.asteroids.splice(index, 1);
            }
        }

        asteroid.destroyAsteroid();
        if (!this.spawnTimer) this.spawnStart();
    }

    getAsteroidsList() {
        return this.asteroids;
    }
}