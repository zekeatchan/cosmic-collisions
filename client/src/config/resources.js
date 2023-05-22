import 'phaser';
// import ship1 from './assets/images/ship1.png';

export default {
    'audio': {
        collide: 
        {
            key: 'collide',
            args: ['assets/audio/collide.ogg']
        },
        explosion: 
        {
            key: 'explosion',
            args: ['assets/audio/explosion.ogg']
        },
        shield: 
        {
            key: 'shield',
            args: ['assets/audio/shield.ogg']
        },
    },
    'image': {
        buttonPlay:
        {
            key: 'buttonPlay',
            args: ['assets/images/buttonPlay.png']
        },
        titleBackground:
        {
            key: 'titleBackground',
            args: ['assets/images/titleBackground.png']
        },
        background:
        {
            key: 'background',
            args: ['assets/images/background.png']
        },
        asteroidLarge:
        {
            key: 'asteroidLarge',
            args: ['assets/images/asteroidLarge.png']
        },
        asteroidMedium:
        {
            key: 'asteroidMedium',
            args: ['assets/images/asteroidMedium.png']
        },
        asteroidSmall:
        {
            key: 'asteroidSmall',
            args: ['assets/images/asteroidSmall.png']
        },
    },
    'spritesheet': {
        ship1: {
            key: 'ship1',
            args: ['assets/images/ship1.png', 
            {
                frameWidth: 32,
                frameHeight: 32
            }]
        },
        ship2: {
            key: 'ship2',
            args: ['assets/images/ship2.png', 
            {
                frameWidth: 32,
                frameHeight: 32
            }]
        },
        ship3: {
            key: 'ship3',
            args: ['assets/images/ship3.png', 
            {
                frameWidth: 32,
                frameHeight: 32
            }]
        },
        ship4: {
            key: 'ship4',
            args: ['assets/images/ship4.png', 
            {
                frameWidth: 32,
                frameHeight: 32
            }]
        },
        explosionLarge: {
            key: 'explosionLarge',
            args: ['assets/images/explosionLarge.png', 
            {
                frameWidth: 64,
                frameHeight: 64
            }]
        },
        explosionMedium: {
            key: 'explosionMedium',
            args: ['assets/images/explosionMedium.png', 
            {
                frameWidth: 58,
                frameHeight: 58
            }]
        },
        explosionSmall: {
            key: 'explosionSmall',
            args: ['assets/images/explosionSmall.png', 
            {
                frameWidth: 41,
                frameHeight: 41
            }]
        },
        explosionShips: {
            key: 'explosionShips',
            args: ['assets/images/explosionShips.png', 
            {
                frameWidth: 64,
                frameHeight: 64
            }]
        },
        shield: {
            key: 'shield',
            args: ['assets/images/shield.png', 
            {
                frameWidth: 64,
                frameHeight: 64
            }]
        },
    }
    // 'plugin': {
    //     rexscrollerplugin: {
    //         key: 'rexscrollerplugin',
    //         args: ['https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexscrollerplugin.min.js', true]
    //     }
    // },
};
