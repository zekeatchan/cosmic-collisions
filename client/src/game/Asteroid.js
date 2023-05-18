import Config from '../config/config';
import Resources from '../config/resources';

const ASTEROID_SIZES = [
    { texture: Resources.image.asteroidSmall.key, colliderSize: 8, points: 100 },
    { texture: Resources.image.asteroidMedium.key, colliderSize: 16, points: 50 },
    { texture: Resources.image.asteroidLarge.key, colliderSize: 32, points: 20 }
];
const ANGULAR_VELOCITY = 100;
const ACCELERATION_MINIMUM = 10;
const ACCELERATION_MAXIMUM = 100;
const BOUNDS = 50;
const OWNER_COOLDOWN = 3;

export default class Asteroid extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, size, position) {
        if (!position) {
            position = {
                x: Math.round(Math.random()) ? Config.scale.width + BOUNDS : -BOUNDS,
                y: Math.round(Math.random()) ? Config.scale.height + BOUNDS : -BOUNDS
            }
        }
        super(scene, position.x, position.y, ASTEROID_SIZES[size].texture);

        this.size = size;
        this.points = ASTEROID_SIZES[size].points;
        this.scene = scene;
        this.rotation = 0;
        this.ownerId;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.init();
    }

    init() {
        this.body
            .setCircle(ASTEROID_SIZES[this.size].colliderSize, 0, this.body.halfHeight - this.body.halfWidth)
            .setBounce(1, 1);

        const angularVelocity = Phaser.Math.Between(-ANGULAR_VELOCITY, ANGULAR_VELOCITY);

        this.angle = Phaser.Math.Between(0, 359);
        const direction = this.scene.physics.velocityFromRotation(this.rotation, 1)
        const acceleration = Phaser.Math.Between(ACCELERATION_MINIMUM, ACCELERATION_MAXIMUM) * (3-this.size);
        const velocity = this.body.velocity;
        velocity.x += direction.x * acceleration;
        velocity.y += direction.y * acceleration;

        this.setAngularVelocity(angularVelocity);
        this.setVelocity(velocity.x, velocity.y);
    }

    update() {
        if (!this.active) return;
        this.rotation += Config.game.FLOATER_SPEED;

        const range = Config.game.FLOATER_Y + (Math.sin(this.rotation) * Config.game.FLOATER_RANGE);
        this.y = Config.scale.centerY + (range * this.side);
        if (this.x < -150) this.sleep();
    }

    getSize() {
        return this.size;
    }

    getPosition() {
        return {
            x: this.x,
            y: this.y
        }
    }

    destroyAsteroid() {
        this.destroy(true);
    }

    setOwnerId(id) {
        this.ownerId = id;
        this.setTint(Config.playerTint[id - 1]);
        this.scene.time.delayedCall(OWNER_COOLDOWN * 1000, this.removeOwner, [], this);
    }

    removeOwner() {
        this.ownerId = undefined;
        this.clearTint();
    }
}
