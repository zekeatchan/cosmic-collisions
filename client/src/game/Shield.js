import Config from '../config/config';
import Resources from '../config/resources';
const COLLIDER_SIZE = 32;
const COOLDOWN_TIME = 3;

export default class Shield extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, id, isPlayer) {
        super(scene, 0, 0, Resources.spritesheet.shield.key);

        this.texture = Resources.spritesheet.shield.key;
        this.scene = scene;
        this.id = id;
        this.isReady = true;
        this.showIndicator = true;
        this.indicatorBack;
        this.indicatorFront;
        this.cooldownTime;
        this.setDepth(200);
        this.indicatorColor = 0x00d3ff;
        this.indicatorAlpha = 0.1;

        scene.add.existing(this);
        scene.physics.add.existing(this, true);
        this.init();
    }

    init() {
        this.body
            .setCircle(COLLIDER_SIZE, 0, this.body.halfHeight - this.body.halfWidth);

        this.setTint(Config.playerTint[this.id - 1]);
        this.initAnimation();
        this.initUI();
        this.deactivate();
    }

    initAnimation() {
        if (!this.scene.anims.exists(this.texture)) {
            this.scene.anims.create({
                key: this.texture,
                frames: this.scene.anims.generateFrameNumbers(this.texture, { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] }),
                frameRate: 12,
            });
        }

        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.deactivate();
        }, this);
    }

    initUI() {
        this.indicatorBack = this.scene.add.graphics();
        this.indicatorFront = this.scene.add.graphics();
    }

    updateUI() {
        this.indicatorFront.clear();
        this.indicatorBack.clear();

        if (!this.showIndicator) return;

        this.indicatorBack.lineStyle(2, this.indicatorColor, this.indicatorAlpha);
        this.indicatorBack.strokeCircle(this.x, this.y, COLLIDER_SIZE);

        if (!this.isReady) {
            this.indicatorFront.lineStyle(2, this.indicatorColor, this.indicatorAlpha * 5);
            this.indicatorFront.beginPath();
            this.indicatorFront.arc(this.x, this.y, COLLIDER_SIZE, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad((360 * this.cooldownTime.getProgress()) - 90), true);
            this.indicatorFront.strokePath();
        }
    }

    updatePosition(position) {
        this.setPosition(position.x, position.y);
        this.updateUI();

        if (this.active) this.refreshBody();
    }

    activate() {
        if (this.active || !this.isReady) return;

        this.isReady = false;
        this.body.checkCollision.none = false;
        this.setActive(true);
        this.setVisible(true);
        this.play(this.texture);
        this.cooldownTime = this.scene.time.delayedCall(COOLDOWN_TIME * 1000, this.reset, [], this);
    }

    deactivate() {
        this.body.checkCollision.none = true;
        this.setActive(false);
        this.setVisible(false);
    }

    show(status) {
        this.showIndicator = status;
    }

    reset() {
        this.isReady = true;
    }

    makePlayer() {
        this.indicatorColor = 0xffff00;
        this.indicatorAlpha = 0.2;
    }
}
