import 'phaser';
import Config from '../config/config';
import Resources from '../config/resources';

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super(Config.scenes.Title);
    }

    create() {
        this.initBackground();
        this.initUI();
    }

    initBackground() {
        this.add.image(0, 0, Resources.image.titleBackground.key).setOrigin(0, 0).setDisplaySize(Config.scale.width, Config.scale.height);
    }

    initUI() {
        const button = this.add.image(Config.scale.centerX, Config.scale.centerY, Resources.image.buttonPlay.key).setInteractive().on(Config.pointer.down, function () {
            this.gotoLobbyScene();
        }.bind(this));
    }

    gotoLobbyScene() {
        // this.scene.get(Config.scenes.Audio).playMusic();
        this.scene.start(Config.scenes.Lobby);
    }
};