import Config from '../config/config';
import Resources from '../config/resources';

const EXPLOSION_SIZES = [
    Resources.spritesheet.explosionSmall.key,
    Resources.spritesheet.explosionMedium.key,
    Resources.spritesheet.explosionLarge.key
];

export default class ExplosionShips extends Phaser.GameObjects.Sprite {
    constructor(scene, id, position) {
        super(scene, position.x, position.y, Resources.spritesheet.explosionShips);

        this.id = id;
        this.texture = Resources.spritesheet.explosionShips.key;
        this.key = `explosionShips${id}`;
        this.scene = scene;
        this.setDepth(100);

        scene.add.existing(this);

        this.init();
    }

    init() {
        const totalFrames = 8;
        const frames = [];
        for (let index = 0; index < 8; index++) {
            frames.push(index + (totalFrames * this.id));
        }

        if (!this.scene.anims.exists(this.key)) {
            this.scene.anims.create({
                key: this.key,
                frames: this.scene.anims.generateFrameNumbers(this.texture, { frames: frames }),
                frameRate: 12,
            });
        }

        this.play(this.key);

        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.destroy(true);
        }, this);
    }
}
