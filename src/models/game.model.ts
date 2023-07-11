import { UsersModel } from "./user.model";

export interface GameModel {
    gameId: string;
    users: UsersModel[],
    ships?: Map<string, ShipPositionModel[][]>,
    shipsForClient?: Map<string, ShipForClientModel[]>
}

export interface PositionModel {
    x: number;
    y: number;
}

export interface ShipPositionModel extends PositionModel {
    hit: boolean;
}

export interface ShipForClientModel {
    position: PositionModel;
    direction: boolean;
    type: string;
    length: number;
}

export interface AttackModel {
    gameId: string;
    x: number;
    y: number;
    indexPlayer: string;
}

export interface AttackForClientModel {
    position: PositionModel;
    status: string;
    currentPlayer: string;
}