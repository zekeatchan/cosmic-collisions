const { Body } = require('arcade-physics/lib/physics/arcade/Body');
const { SHIELD } = require('../constants');

class Shield extends Body {
    constructor(playerId, phsyics, position) {
        super(phsyics.world, position.x, position.y);
        phsyics.world.add(this);
        this.playerId = playerId;
        this.isReady = true;
        // this.setEnable(false);

        this.setCircle(SHIELD.colliderSize);
        this.setBounce(SHIELD.bounce);
        this.checkCollision.none = true;
    }

    getBody() {
        return this;
    }

    getPlayerId() {
        return this.playerId;
    }

    getSize() {
        return this.size;
    }

    setPosition(position) {
        this.position.x = position.x;
        this.position.y = position.y;
    }

    getReady() {
        return this.isReady;
    }

    setReady(status) {
        this.isReady = status;
    }

    isEnabled() {
        return !this.checkCollision.none;
    }

    enableCollisions(value) {
        this.checkCollision.none = !value;
    }

    // enableShield(value) {
    //     this.checkCollision.none = !value;
    // }
}
module.exports = Shield;