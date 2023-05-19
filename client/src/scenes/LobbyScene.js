import 'phaser';
import Config from '../config/config';
import Resources from '../config/resources';
import IO_MESSAGE from '../helpers/messages';

const COUNTDOWN_TIMER = 30;

export default class LobbyScene extends Phaser.Scene {
    constructor() {
        super(Config.scenes.Lobby);
    }

    create() {
        this.socket = this.scene.get(Config.scenes.Audio).getSocket();
        this.statusText = this.add.text(Config.scale.centerX, Config.scale.centerY, "Waiting for players to join...").setOrigin(.5);
        console.log('LobbyScene', this.socket);
    }

    ready() {
        this.countdown = this.time.addEvent({
            delay: 1000, callback: () => {
                const seconds = this.countdown.repeatCount;
                this.statusText.setText(`Game begins in: ${seconds} seconds`);
                // if (this.countdown.repeatCount === 0) this.gotoGameScene();
            }, callbackScope: this, repeat: COUNTDOWN_TIMER
        });

        const button = this.add.image(Config.scale.centerX, Config.scale.centerY + 200, Resources.image.buttonPlay.key).setInteractive()
            .on(Config.pointer.down, function () {
                this.socket.emit(IO_MESSAGE.PLAYER_READY);
                button.setVisible(false);
            }.bind(this));
    }

    gotoGameScene() {
        this.scene.start(Config.scenes.Game);
    }
};
