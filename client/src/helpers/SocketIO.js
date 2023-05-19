import io from 'socket.io-client';
import IO_MESSAGE from './messages';
import Config from '../config/config';

export default class SocketIO {
    constructor(scene, url) {
        scene.socket = io.connect('http://localhost:8081/');
        // scene.socket = io(url || '');

        scene.socket.on(IO_MESSAGE.CONNECT, () => {
            console.log(IO_MESSAGE.CONNECT);
        });

        scene.socket.on(IO_MESSAGE.INIT, (myId) => {
            Config.game.playerId = myId;
            console.log(IO_MESSAGE.INIT, myId)
        })

        // scene.socket.on(IO_MESSAGE.NEW_PLAYER, (players) => {
        //     Config.game.players = players;
        //     console.log(IO_MESSAGE.NEW_PLAYER, players)
        // })

        scene.socket.on(IO_MESSAGE.LOBBY_READY, () => {
            console.log(IO_MESSAGE.LOBBY_READY);
            scene.setLobbyReady();
        });
        
        scene.socket.on(IO_MESSAGE.GAME_START, (players) => {
            console.log(IO_MESSAGE.GAME_START, players);
            Config.game.players = players;
            scene.gameStart();
        });

        scene.socket.on(IO_MESSAGE.GAME_OVER, () => {
            console.log(IO_MESSAGE.GAME_OVER);
        });

        scene.socket.on(IO_MESSAGE.UPDATE, (gameState) => {
            gameState = JSON.parse(gameState);
            scene.gameUpdate(gameState);
        });

    }
}