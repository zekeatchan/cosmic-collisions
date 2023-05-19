import 'phaser';

export default {
    LOCAL_STORAGE_KEY: 'TestGameApp',
    VERSION: '0.0.1',
    demo: false,
    type: Phaser.AUTO,
    parent: 'testGame',
    dom: {
        createContainer: true
    },
    pixelArt: true,
    roundPixels: true,
    antialias: false,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 960,
        height: 640,
        centerX: 480,
        centerY: 320,
        isIOS: false,
        orientation: ''
    },
    orientation: {
        current: 'landscape',
        mode: {
            PORTRAIT: 'portrait',
            LANDSCAPE: 'landscape',
        },
        portrait: {
            width: 640,
            height: 960,
            centerX: 320,
            centerY: 480,
        },
        landscape: {
            width: 960,
            height: 640,
            centerX: 480,
            centerY: 320,
        }
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scenes: {
        Audio: 'Audio',
        Boot: 'Boot',
        GameController: 'GameController',
        Preloader: 'Preloader',
        Title: 'Title',
        Lobby: 'Lobby',
        HowToPlay: 'HowToPlay',
        Scoreboard: 'Scoreboard',
        Game: 'Game',
    },
    backgroundColor: 0x131a2a,
    pointer: {
        move: 'pointermove',
        down: 'pointerdown',
        out: 'pointerout',
        up: 'pointerup',
        upOutside: 'pointerupoutside',
    },
    hostName: 'localhost',
    playerTint: [0xff0000, 0xffff00, 0x0000ff, 0x00ff00],
    fx: {
        glow: {
            distance: 32,
            quality: 0.1
        }
    },
    game: {
        scores: [],
        playerId: '',
        players: []
    }
};