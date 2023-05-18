import 'phaser';
import Config from '../config/config';
import Resources from '../config/resources';
// import UI from '../Ui/UiElements.js';

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
};
