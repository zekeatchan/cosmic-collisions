import 'phaser';
import Config from '../config/config';
import Resources from '../config/resources';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super(Config.scenes.Boot);
    }

    preload() {
        // this.load.image(Resources.image.backgroundMenu.key, Resources.image.backgroundMenu.args);
        // this.load.image(Resources.image.backgroundMenuBottom.key, Resources.image.backgroundMenuBottom.args);
    }

    create() {
        this.scene.start(Config.scenes.Preloader);
    }
};
