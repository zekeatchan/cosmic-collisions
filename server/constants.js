const GAME = {
    width: 960,
    height: 640,
    centerX: 480,
    centerY: 320,
    frameRate: 60,
    roundDuration: 180 * 1000,
    lobbyDuration: 15 * 1000,
    maxPlayers: 4,
}
const POINTS = {
    asteroids: [100, 50, 20],
    ship: 1000,
}
const ASTEROIDS = {
    countStart: 4,
    countMaximum: 30,
    intervalMinimum: 5,
    intervalMaximum: 10,
    sizeStart: 2,
    angularVelocity: 100,
    accelerationMinimum: 10,
    accelerationMaximum: 100,
    bounds: 32,
    ownerCooldown: 3,
    colliderSize: [8, 16, 32],
}
const SHIELD = {
    colliderSize: 32,
    cooldown: 3 * 1000,
    duration: 1 * 1000,
}
const SHIP = {
    acceleration: 10,
    colliderSize: 16,
    angularVelocity: 300,
    velocityMaximum: 400,
    drag: 0.3,
    spawnDuration: 3 * 1000,
}

module.exports = {
    GAME,
    POINTS,
    ASTEROIDS,
    SHIELD,
    SHIP,
}