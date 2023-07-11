import { v4 } from "uuid";
import { getGameById } from "./game";
import { WebSocket } from "ws";

const clients: Map<WebSocket, string> = new Map();

export function getClients(): Map<WebSocket, string> {
    return clients;
}

export function getClientId(socket: WebSocket): string {
    return clients.get(socket);
}

export function setClient(socket: WebSocket): void {
    const id = v4();

    if (!clients.has(socket)) {
        clients.set(socket, id);
    }
}

export function sendDataToPlayers(data: any, gameId: string) {
    const game = getGameById(gameId);
    const usersIds = game.users.map(user => user.index);

    clients.forEach((userId, socket) => {
        if (usersIds.includes(userId)) {
            socket.send(data);
        }
    });
}

export function sendDataToAllPlayers(data: any): void {
    clients.forEach((_, socket) => {
        socket.send(data);
    });
}
