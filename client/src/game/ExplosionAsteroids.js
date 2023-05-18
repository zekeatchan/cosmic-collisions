import Config from '../config/config';
import Resources from '../config/resources';

const EXPLOSION_SIZES = [
    Resources.spritesheet.explosionSmall.key,
    Resources.spritesheet.explosionMedium.key,
    Resources.spritesheet.explosionLarge.key
];

export default class ExplosionAsteroids extends Phaser.GameObjects.Sprite {
    constructor(scene, size, position) {
        super(scene, position.x, position.y, EXPLOSION_SIZES[size]);

        this.size = size;
        this.texture = EXPLOSION_SIZES[size];
        this.scene = scene;
        this.setDepth(100);

        scene.add.existing(this);

        this.init();
    }

    init() {
        if (!this.scene.anims.exists(this.texture)) {
            this.scene.anims.create({
                key: this.texture,
                frames: this.scene.anims.generateFrameNumbers(this.texture, { frames: [0, 1, 2, 3, 4, 5, 6, 7] }),
                frameRate: 12,
            });
        }
        
        this.play(this.texture);

        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.destroy(true);
        }, this);
    }
}
