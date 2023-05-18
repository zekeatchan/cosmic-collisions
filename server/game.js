const { ArcadePhysics } = require('arcade-physics');
const CONSTANTS = require('./constants');
const { Ship, Shield, Asteroid } = require('./gameObjects');

module.exports = {
    initGame,
    update,
}

function initGame() {
    const config = {
        width: CONSTANTS.width,
        height: CONSTANTS.height,
        gravity: {
            x: 0,
            y: 0
        }
    }

    const physics = new ArcadePhysics(config);
    return physics;
}

function initGameObjects() {
    const config = {
        width: CONSTANTS.width,
        height: CONSTANTS.height,
        gravity: {
            x: 0,
            y: 0
        }
    }

    const physics = new ArcadePhysics(config);
    return physics;
}

function update() {

}