import { WebSocket, WebSocketServer } from "ws";
import { httpServer } from "./http_server";
import { Message } from "./models/user.model";
import { ActionType, AttackStatus } from "./constants/constants";
import { getUserAfterRegistration } from "./controllers/user";
import { addUserToRoom, createRoom, deleteRoom, getUpdatedRooms } from "./controllers/room";
import { getUpdatedWinners, setWinner } from "./controllers/winner";
import { sendDataToAllPlayers, sendDataToPlayers } from "./controllers/client";
import { createGame, deleteGame, getCreatedGame, getFinishedGame, getStartedGame, isGameOver, isUsersReadyToStartGame } from "./controllers/game";
import { addShips } from "./controllers/ships";
import { AttackModel, ShipForClientModel } from "./models/game.model";
import { getAttack, getTurn, getTurnAfterAttack } from "./controllers/attack";
import { getPositions } from "./controllers/positions";

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const websocket = new WebSocketServer({
    port: 3000
});

websocket.on('connection', (socket: WebSocket) => {
    console.log('connected to websocket');

    socket.on('message', (data) => {

        const message: Message = JSON.parse(data.toString('utf-8'));

        switch(message.type) {
            case ActionType.REG:
                const user = getUserAfterRegistration(message, socket);
                socket.send(user);
                socket.send(getUpdatedRooms());
                socket.send(getUpdatedWinners());
                break;
            case ActionType.CREATE_ROOM:
                createRoom(socket);
                sendDataToAllPlayers(getUpdatedRooms());
                break;
            case ActionType.ADD_USER_TO_ROOM:
                const room: {
                    indexRoom: string;
                } = JSON.parse(message.data);

                addUserToRoom(room.indexRoom, socket);

                const createdGameId = createGame(room.indexRoom);
                const [firstPlayer, secondPlayer] = getCreatedGame(createdGameId);

                firstPlayer.socket.send(firstPlayer.game);
                secondPlayer.socket.send(secondPlayer.game);

                deleteRoom(room.indexRoom);
                sendDataToAllPlayers(getUpdatedRooms());
                break;

            case ActionType.ADD_SHIPS:
                const ship: {
                    gameId: string;
                    indexPlayer: string;
                    ships: ShipForClientModel[];
                } = JSON.parse(message.data);

                addShips(ship);

                if(isUsersReadyToStartGame(ship.gameId)) {
                    const [firstPlayer, secondPlayer] = getStartedGame(ship.gameId);
                    firstPlayer.socket.send(firstPlayer.game);
                    secondPlayer.socket.send(secondPlayer.game);

                    const turn = getTurn(socket);

                    firstPlayer.socket.send(turn);
                    secondPlayer.socket.send(turn);
                }
                break;
            case ActionType.ATTACK:
            case ActionType.RANDOM_ATTACK:
                const { gameId, indexPlayer }: AttackModel = JSON.parse(message.data);
                const attack = getAttack(message, message.type);

                if(attack.status === AttackStatus.KILLED) {
                    const { missedPositions, killedPositions } = getPositions(indexPlayer);
                    missedPositions.forEach(missedPosition => {
                        sendDataToPlayers(missedPosition, gameId);
                    });

                    killedPositions.forEach(killedPosition => {
                        sendDataToPlayers(killedPosition, gameId);
                    });
                } else {
                    sendDataToPlayers(attack.attack, gameId);
                }

                const finishGame = isGameOver(gameId, indexPlayer);
                
                if(finishGame) {
                    const game = getFinishedGame(indexPlayer);
                    sendDataToPlayers(game, gameId);
                    setWinner(indexPlayer);
                    const winners = getUpdatedWinners();
                    sendDataToAllPlayers(winners);
                    deleteGame(gameId);
                } else {
                    const turn = getTurnAfterAttack(gameId, socket, attack.status);
                    sendDataToPlayers(turn, gameId);
                }
                break;
        }
    });
});

process.on('SIGINT', () => {
    console.log('close websocket connection');
    websocket.close();
    process.exit();
})