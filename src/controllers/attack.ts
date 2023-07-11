import { WebSocket } from "ws";
import { ActionType, AttackStatus } from "../constants/constants";
import { AttackModel, ShipPositionModel } from "../models/game.model";
import { Message } from "../models/user.model";
import { getClientId } from "./client";
import { getGameById } from "./game";
import { setPositions } from "./positions";

export function getAttack(message: Message, actionType: string): {
    attack: string;
    status: string;
} {
    const attackMessage: AttackModel = JSON.parse(message.data);

    if (actionType === ActionType.RANDOM_ATTACK) {
        attackMessage.x = Math.ceil(Math.random() * 10);
        attackMessage.y = Math.ceil(Math.random() * 10);
    }

    const status = getStatusOfAttack(attackMessage);

    const attack = JSON.stringify({
        type: ActionType.ATTACK,
        data: JSON.stringify({
                position:
                {
                    x: attackMessage.x,
                    y: attackMessage.y
                },
                currentPlayer: attackMessage.indexPlayer,
                status
            }),
        id: 0
    });

    return {
        attack,
        status
    }
}

export function getTurn(socket: WebSocket, idPlayer?: string): string {
    return JSON.stringify({
        type: ActionType.TURN,
        data: JSON.stringify({
                currentPlayer: idPlayer ?? getClientId(socket)
            }),
        id: 0
    });
}

export function getTurnAfterAttack(gameId: string, socket: WebSocket, status: string): string {
    const game = getGameById(gameId);
    const userId = getClientId(socket);
    const opponentId = game.users.find(user => user.index !== userId).index;
    
    switch(status) {
        case AttackStatus.MISS:
            return getTurn(null, opponentId);
        case AttackStatus.SHOT:
        case AttackStatus.KILLED:
            return getTurn(null, userId);
    }
}

function getStatusOfAttack(attack: AttackModel): string {
    const game = getGameById(attack.gameId);
    
    let positions: ShipPositionModel[][];

    game.ships.forEach((value, key) => {
        if (key !== attack.indexPlayer) {
            positions = value;
        }
    });

    let status: string = null;

    positions.forEach(shipsPositions => {
        const attackedTargetIdx = shipsPositions.findIndex(position => position.x === attack.x && position.y === attack.y);
        if (attackedTargetIdx !== -1) {
            
            shipsPositions[attackedTargetIdx].hit = true;
            const noAttackedTarget = shipsPositions.find(position => !position.hit);

            if (noAttackedTarget) {
                status = AttackStatus.SHOT;
            } else {
                status = AttackStatus.KILLED;
                setPositions(shipsPositions);
            }
        }
    });

    return status ?? AttackStatus.MISS;
}