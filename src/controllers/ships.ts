import { ShipForClientModel, ShipPositionModel } from "../models/game.model";
import { getGames } from "./game";

export function addShips(ship: {
    gameId: string;
    indexPlayer: string;
    ships: ShipForClientModel[];
}): void {

    const expandedShipInfo = getExpandedShipInfo(ship.ships);
    const games = getGames();
    const gameIndex = games.findIndex(game => game.gameId === ship.gameId);

    games[gameIndex].ships.set(ship.indexPlayer, expandedShipInfo);
    games[gameIndex].shipsForClient.set(ship.indexPlayer, ship.ships);
}

function getExpandedShipInfo(ships: ShipForClientModel[]): ShipPositionModel[][] {
    const positions: ShipPositionModel[][] = [];

    ships.forEach((ship, index) => {
        positions[index] = [{
            ...ship.position,
            hit: false
        }]

        for (let i = 0; i < ship.length - 1; i++) {
            if (ship.direction) {
                positions[index].push({
                    x: ship.position.x,
                    y: ship.position.y + (i + 1),
                    hit: false
                });
            }

            else {
                positions[index].push({
                    x: ship.position.x + (i + 1),
                    y: ship.position.y,
                    hit: false
                });
            }
        }
    });

    return positions;
}