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
        this.audioCollide = this.sound.add(Resources.audio.collide.key);
        this.audioExplosion = this.sound.add(Resources.audio.explosion.key);
        this.audioShield = this.sound.add(Resources.audio.shield.key);
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

    asteroidOwned(asteroidId, playerId) {
        this.scene.get(Config.scenes.Game).asteroidOwned(asteroidId, playerId);
    }

    destroyAsteroid(asteroidId) {
        this.scene.get(Config.scenes.Game).destroyAsteroid(asteroidId);
        this.audioExplosion.play();
    }

    destroyPlayer(playerId) {
        this.scene.get(Config.scenes.Game).destroyPlayer(playerId);
        // this.audioExplosion.play();
    };

    respawnPlayer(playerId) {
        this.scene.get(Config.scenes.Game).respawnPlayer(playerId);
    }

    activateShield(playerId) {
        this.scene.get(Config.scenes.Game).activateShield(playerId);
        this.audioShield.play();
    }
};
