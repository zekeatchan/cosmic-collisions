import 'phaser';
import Config from './config/config';
import BootScene from './scenes/BootScene';
import AudioScene from './scenes/AudioScene';
import GameScene from './scenes/GameScene';
import PreloaderScene from './scenes/PreloaderScene';
import TitleScene from './scenes/TitleScene';
import LobbyScene from './scenes/LobbyScene';
import ScoreboardScene from './scenes/ScoreboardScene';

class Game extends Phaser.Game {
    constructor() {
        super(Config);

        Config.hostName = window.location.hostname;

        if (Config.hostName === 'localhost') {
            Config.demo = true;
        } else {
            Config.demo = false;
        }

        this.scene.add(Config.scenes.Boot, BootScene);
        this.scene.add(Config.scenes.Preloader, PreloaderScene);
        this.scene.add(Config.scenes.Title, TitleScene);
        this.scene.add(Config.scenes.Game, GameScene);
        this.scene.add(Config.scenes.Audio, AudioScene);
        this.scene.add(Config.scenes.Lobby, LobbyScene);
        this.scene.add(Config.scenes.Scoreboard, ScoreboardScene);
        this.scene.start(Config.scenes.Boot);
    }
}

window.game = new Game();