import 'phaser';
import Config from '../config/config';
import Resources from '../config/resources';

export default class ScoreboardScene extends Phaser.Scene {
    constructor() {
        super(Config.scenes.Scoreboard);
    }

    create() {
        this.showScores();
        this.initUI();
    }

    initUI() {
        const button = this.add.image(Config.scale.centerX, Config.scale.centerY + 200, Resources.image.buttonPlay.key).setInteractive()
            .on(Config.pointer.down, function () {
                this.gotoLobbyScene();
            }.bind(this));
    }

    showScores() {
        const scores = Config.game.scores.sort(
            function (a, b) {
                return b.score - a.score;
            }
        )

        const startY = Config.scale.centerY - 100;
        const lineDistance = 50;

        for (let index = 0; index < scores.length; index++) {
            const positionY = startY + (lineDistance * index);
            const user = scores[index];
            const ship = this.add.sprite(Config.scale.centerX - 20, positionY, Resources.spritesheet["ship" + user.player].key);
            this.add.text(Config.scale.centerX + 10, positionY, user.score).setOrigin(0, .5);
        }
    }

    gotoLobbyScene() {
        this.scene.start(Config.scenes.Lobby);
    }
};
