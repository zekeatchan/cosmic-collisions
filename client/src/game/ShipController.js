import Config from '../config/config';
import Asteroid from './Asteroid';

const STARTING_ASTEROIDS = 3;
const MAX_ASTEROIDS = 30;
const INTERVAL_MINIMUM = 5;
const INTERVAL_MAXIMUM = 10;
const ASTEROID_STARTING_SIZE = 2;

export default class ShipsController {
    constructor(scene) {
        this.scene = scene;
        this.ships = [];
        this.init();
    }

    init() {
        this.setupAsteroids();
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

    }

    spawnStop() {

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
    }

    removeAsteroid(asteroid) {
        for (let index = 0; index < this.asteroids.length; index++) {
            if (this.asteroids[index] === asteroid) {
                const asteroidToRemove = this.asteroids.splice(index, 1);
                asteroidToRemove.destroy();
            }
        }
    }

    getAsteroidsList() {
        return this.asteroids;
    }
}