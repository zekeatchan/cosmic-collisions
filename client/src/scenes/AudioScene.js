import 'phaser';
import Config from '../config/config';
import Resources from '../config/resources';
import SocketIO from '../helpers/SocketIO';

export default class AudioScene extends Phaser.Scene {
    constructor() {
        super(Config.scenes.Audio);
    }

    create() {
        // this.music = this.sound.add(Resources.audio.music.key, { loop: true });
    }

    playMusic() {
        if (this.music.isPlaying) return;
        
        this.music.play();
    }

    enableSounds() {
        if (this.music.isPlaying) {
            this.music.stop();
        } else {
            this.music.play();
        }
    }

    connectSocket() {
        this.SocketHandler = new SocketIO(this);
    }

    getSocket() {
        return this.socket;
    }

    setLobbyReady() {
        this.scene.get(Config.scenes.Lobby).ready();
    }

    gameStart() {
        this.scene.get(Config.scenes.Lobby).gotoGameScene();
    }

    gameUpdate(state) {
        this.scene.get(Config.scenes.Game).updateGameState(state);
    }
};
