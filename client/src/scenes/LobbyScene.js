import 'phaser';
import Config from '../config/config';
import Resources from '../config/resources';

const COUNTDOWN_TIMER = 30;

export default class LobbyScene extends Phaser.Scene {
    constructor() {
        super(Config.scenes.Lobby);
    }

    create() {
        this.statusText = this.add.text(Config.scale.centerX, Config.scale.centerY, "Waiting for players to join...").setOrigin(.5);

        this.startCountdown();
    }

    startCountdown() {
        this.countdown = this.time.addEvent({
            delay: 1000, callback: () => {
                const seconds = this.countdown.repeatCount;
                this.statusText.setText(`Game begins in: ${seconds} seconds`);
                if (this.countdown.repeatCount === 0) this.gotoGameScene();
            }, callbackScope: this, repeat: COUNTDOWN_TIMER
        });

        const button = this.add.image(Config.scale.centerX, Config.scale.centerY + 200, Resources.image.buttonPlay.key).setInteractive()
            .on(Config.pointer.down, function () {
                this.gotoGameScene();
            }.bind(this));
    }

    gotoGameScene() {
        this.scene.start(Config.scenes.Game);
    }
};
