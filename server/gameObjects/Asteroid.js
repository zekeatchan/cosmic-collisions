const { Body } = require('arcade-physics/lib/physics/arcade/Body');
const { ASTEROIDS } = require('../constants');

class Asteroid extends Body {
    constructor(id, phsyics, size, position) {
        super(phsyics.world, position.x, position.y);
        phsyics.world.add(this);

        this.id = id;
        this.size = size;
        this.playerId;

        if (!position) {
            position = {
                x: Math.round(Math.random()) ? Config.scale.width + ASTEROIDS.bounds : -ASTEROIDS.bounds,
                y: Math.round(Math.random()) ? Config.scale.height + ASTEROIDS.bounds : -ASTEROIDS.bounds
            }
            setPosition(position);
        }

        this.setCircle(ASTEROIDS.colliderSize[size]);
        this.setBounce(ASTEROIDS.bounce);
        this.id = id;
        
        const direction = phsyics.velocityFromAngle(Math.random() * 360, 1);
        const acceleration = ((Math.random() * (ASTEROIDS.accelerationMaximum - ASTEROIDS.accelerationMinimum)) + ASTEROIDS.accelerationMinimum) * (3 - this.size);

        const velocity = this.velocity;
        velocity.x += direction.x * acceleration;
        velocity.y += direction.y * acceleration;

        this.setVelocity(velocity.x, velocity.y);
    }

    getBody() {
        return this;
    }

    getId() {
        return this.id;
    }

    getSize() {
        return this.size;
    }

    getPosition() {
        return this.position;
    }

    getPlayerId() {
        return this.playerId;
    }

    setPlayerId(value) {
        this.playerId = value;
    }

    setPosition(position) {
        this.position.x = position.x;
        this.position.y = position.y;
    }
}
module.exports = Asteroid;