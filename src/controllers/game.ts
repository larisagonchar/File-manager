import { v4 } from "uuid";
import { GameModel, ShipPositionModel } from "../models/game.model";
import { UsersModel } from "../models/user.model";
import { getClientId, getClients } from "./client";
import { ActionType, AttackStatus } from "../constants/constants";
import { getRooms, getUsersInRoom } from "./room";
import { WebSocket } from "ws";

let games: GameModel[] = [];

export function getCreatedGame(gameId: string): {
    socket: WebSocket;
    game: string;
}[] {
    const game = getGameById(gameId);
    const userIds = game.users.map(user => user.index);
    const clients = getClients();

    const createdGame: {
        socket: WebSocket;
        game: string;
    }[] = [];

    clients.forEach((userId, socket) => {
        if (userIds.includes(userId)) {
            const game = JSON.stringify({
                type: ActionType.CREATE_GAME,
                data: JSON.stringify({
                    idGame: gameId,
                    idPlayer: userId
                }),
                id: 0
            });

            createdGame.push({
                socket,
                game
            });
        }
    });

    return createdGame;
}

export function createGame(roomId: string): string {
    const gameId = v4();
    const usersInRoom = getUsersInRoom(roomId);

    setGame(usersInRoom, gameId);

    return gameId;
}

export function isUsersReadyToStartGame(gameId: string): boolean {
    const game = getGameById(gameId);
    return game.ships.size === 2;
}

export function getStartedGame(gameId: string): {
    socket: WebSocket;
    game: string;
}[] {
    const game = getGameById(gameId);
    const userIds = game.users.map(user => user.index);
    const clients = getClients();

    const startedGame: {
        socket: WebSocket;
        game: string;
    }[] = [];

    clients.forEach((userId, socket) => {
        if (userIds.includes(userId)) {
            const startGame = JSON.stringify({
                type: ActionType.START_GAME,
                data: JSON.stringify({
                        ships: game.shipsForClient.get(userId),
                        currentPlayerIndex: userId
                    }),
                id: 0
            });

            startedGame.push({
                socket,
                game: startGame
            });
        }
    });

    return startedGame;
}

export function getFinishedGame(winPlayer: string): string {
    return JSON.stringify({
        type: ActionType.FINISH,
        data: JSON.stringify({
            winPlayer
        }),
        id: 0
    });
}

export function getGameById(gameId: string): GameModel {
    return games.find(room => room.gameId === gameId);
}

export function getGames(): GameModel[] {
    return games;
}

export function deleteGame(gameId: string): void {
    games = games.filter(game => game.gameId !== gameId);
}

export function isGameOver(gameId: string, currentPlayerId: string): boolean {
    const game = getGameById(gameId);
    const opponentId = game.users.find(user => user.index !== currentPlayerId);
    const ships = game.ships.get(opponentId.index);

    let notKilledPosition: ShipPositionModel;

    for (let i = 0; i < ships.length; i++) {
        notKilledPosition = ships[i].find(position => !position.hit);
        if (notKilledPosition) break;
    }

    return !notKilledPosition;
}

function setGame(usersInRoom: UsersModel[], gameId: string): void {
    games.push({
        gameId,
        users: usersInRoom,
        ships: new Map(),
        shipsForClient: new Map()
    });
}