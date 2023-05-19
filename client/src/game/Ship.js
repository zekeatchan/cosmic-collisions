import Config from '../config/config';
import Resources from '../config/resources';

const ACCELERATION = 10;
const IMPACT = 200;
const COLLIDER_SIZE = 16;
const ANGULAR_VELOCITY = 300;
const MAX_VELOCITY = 400;
const DRAG = 0.3;
const SPAWN_DURATION = 3;
const POINTS = 1000;

export default class Ship extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, position, id, shieldObject) {

        super(scene, position.x, position.y, Resources.spritesheet["ship" + id].key);

        this.texture = Resources.spritesheet["ship" + id].key;
        this.id = id;
        this.scene = scene;
        this.points = POINTS;
        this.shieldObject = shieldObject;
        this.rotation = 0;
        this.oldPosition = {
            x: this.x,
            y: this.y,
            rotation: this.rotation
        };

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
    }

    init() {
        this.body
            .setCircle(COLLIDER_SIZE, 0, this.body.halfHeight - this.body.halfWidth)
            .setDamping(true)
            .setDrag(DRAG, DRAG)
            .setBounce(1, 1)
            .setMaxVelocity(MAX_VELOCITY);

        this.initAnimation();
        this.invulnerable(true);
    }

    initAnimation() {
        this.scene.anims.create({
            key: this.texture + 'animate',
            frames: this.scene.anims.generateFrameNumbers(this.texture, { frames: [0, 1, 2, 3] }),
            frameRate: 8,
            repeat: -1
        });
        this.play(this.texture + 'animate');
    }

    update(time, delta) {
        this.shieldObject?.updatePosition(this.getPosition());

        if (!this.active) return;
        this.updatePosition();

        this.scene.physics.world.wrap(this.scene, 5);
    }

    rotateClockwise() {
        this.setAngularVelocity(ANGULAR_VELOCITY);
    }

    rotateCounterClockwise() {
        this.setAngularVelocity(-ANGULAR_VELOCITY);
    }

    rotateStop() {
        this.setAngularVelocity(0);
    }

    thrust() {
        const direction = this.getDirection();
        const velocity = this.getVelocity();

        velocity.x += direction.x * ACCELERATION;
        velocity.y += direction.y * ACCELERATION;

        this.setVelocity(velocity.x, velocity.y);
    }

    idle() {
        this.setAcceleration(0);
    }

    getDirection() {
        return this.scene.physics.velocityFromRotation(this.rotation, 1);
    }

    getVelocity() {
        return this.body.velocity;
    }

    setImpact(direction, velocity) {
        const newVelocity = velocity;

        newVelocity.x += direction.x * IMPACT;
        newVelocity.y += direction.y * IMPACT;

        this.setVelocity(newVelocity.x, newVelocity.y);
    }

    destroyShip() {
        this.body.checkCollision.none = true;
        this.setActive(false);
        this.setVisible(false);
        this.shieldObject.show(false);
        this.respawn();
    }

    activateShield() {
        this.shieldObject.activate();
    }

    respawn() {
        const timer = this.scene.time.delayedCall(SPAWN_DURATION * 1000, this.reset, [], this);
    }

    reset() {
        this.body.checkCollision.none = false;
        this.setPosition(Config.scale.width * Math.random(), Config.scale.height * Math.random());
        this.setActive(true);
        this.setVisible(true);
        this.shieldObject.show(true);
        this.invulnerable(true);
    }

    updatePosition() {
        var x = this.x;
        var y = this.y;
        var r = this.rotation;
        if (this.oldPosition && (x !== this.oldPosition.x || y !== this.oldPosition.y || r !== this.oldPosition.rotation)) {
            // this.socket.emit('playerMovement', { x: this.x, y: this.y, rotation: this.rotation });
        }
        this.oldPosition.x = this.x;
        this.oldPosition.y = this.y;
        this.oldPosition.rotation = this.rotation;
    }

    getPosition() {
        return {
            x: this.x,
            y: this.y
        }
    }

    invulnerable(status) {
        this.body.checkCollision.none = status;

        if (status) {
            this.preFX.setPadding(32);
            const fx = this.preFX.addGlow();
            fx.outerStrength = 0;
            this.scene.tweens.add({
                targets: fx,
                duration: SPAWN_DURATION * 1000 * .5,
                outerStrength: 5,
                yoyo: true,
                ease: 'sine.inout'
            });

            this.scene.time.delayedCall(SPAWN_DURATION * 1000, this.invulnerable, [false], this);
        }
    }
}
