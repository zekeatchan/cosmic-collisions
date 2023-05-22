const { Body } = require('arcade-physics/lib/physics/arcade/Body');
const { GAME, SHIP } = require('../constants');

class Ship extends Body {
    constructor (playerId, phsyics) {
        super(phsyics.world, GAME.width * Math.random(), GAME.height * Math.random());
        phsyics.world.add(this);
        this.phsyics = phsyics;
        this.playerId = playerId;
        this.currentState = SHIP.INVULNERABLE;

        // this = world.add.body(GAME.width * Math.random(), GAME.height * Math.random());
        // this.setCircle(SHIP.colliderSize);
        // this.setDamping(true);
        // this.setDrag(SHIP.drag, SHIP.drag);
        // this.setBounce(SHIP.bounce, SHIP.bounce);
        // this.setMaxVelocity(SHIP.velocityMaximum);

        this.setCircle(SHIP.colliderSize);
        this.setDamping(true);
        this.setDrag(SHIP.drag, SHIP.drag);
        this.setBounce(SHIP.bounce, SHIP.bounce);
        this.setMaxVelocity(SHIP.velocityMaximum);
    }

    rotateClockwise() {
        this.setAngularVelocity(SHIP.angularVelocity);
    }
    
    rotateCounterClockwise() {
        this.setAngularVelocity(-SHIP.angularVelocity);
    }

    rotateStop() {
        this.setAngularVelocity(0);
    }

    accelerate() {
        const direction = this.phsyics.velocityFromAngle(this.rotation, 1);
        const velocity = this.velocity;

        velocity.x += direction.x * SHIP.acceleration;
        velocity.y += direction.y * SHIP.acceleration;

        this.setVelocity(velocity.x, velocity.y);
    }

    idle() {
        // this.setAcceleration(0);
        this.setAcceleration(0);
    }

    getPlayerId() {
        return this.playerId;
    }

    getState() {
        return this.currentState;
    }

    setState(state) {
        this.currentState = state;
    }

    // destroyShip() {
    //     this.body.checkCollision.none = true;
    //     this.setActive(false);
    //     this.setVisible(false);
    //     this.shieldObject.show(false);
    //     // this.respawn();
    // }

    // respawn() {
    //     this.body.checkCollision.none = false;
    //     this.setPosition(Config.scale.width * Math.random(), Config.scale.height * Math.random());
    //     this.setActive(true);
    //     this.setVisible(true);
    //     this.shieldObject.show(true);
    //     this.invulnerable(true);
    // }

    reset() {
        setState(SHIP.INVULNERABLE);
    }

    // return {
    //     id: id,
    //     this: ship,
    //     rotateClockwise: rotateClockwise,
    //     rotateCounterClockwise: rotateCounterClockwise,
    //     rotateStop: rotateStop,
    //     accelerate: accelerate,
    //     idle: idle,
    //     setState: setState,
    //     getState: getState,
    //     reset: reset,
    // };
}

module.exports = Ship;