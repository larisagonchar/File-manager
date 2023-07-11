import { ActionType } from "../constants/constants";
import { WinnerClientModel, WinnerModel } from "../models/winner.model";
import { getUsers } from "./user";

const winners: WinnerModel[] = [];

export function getUpdatedWinners(): string {
    const dataWinners = mapWinners(winners);
    
    return JSON.stringify({
        type: ActionType.UPDATE_WINNERS,
        data: JSON.stringify(dataWinners),
        id: 0
    });
}

export function setWinner(winnerId: string): void {
    const users = getUsers();
    const name = users.find(user => user.index === winnerId).login;
    const winnerIndex = winners.findIndex(winner => winner.idPlayer === winnerId);

    if(winnerIndex === -1) {
        winners.push({
            idPlayer: winnerId,
            numberOfWins: 1,
            name
        })
    } else {
        winners[winnerIndex].numberOfWins++;
    }
}

function mapWinners(winnerServer: WinnerModel[]): WinnerClientModel[] {
    return winnerServer.map(winner => {
        return {
            name: winner.name,
            wins: winner.numberOfWins
        };
    });
}