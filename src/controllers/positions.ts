import { ActionType, AttackStatus } from "../constants/constants";
import { PositionModel, ShipPositionModel } from "../models/game.model";

let positions: {
    missedPositions: PositionModel[],
    killedPositions: ShipPositionModel[]
};

export function getPositions(indexPlayer: string): {
    missedPositions: string[],
    killedPositions: string[]
} {
    return {
        missedPositions: getPositionsForClient(positions.missedPositions, indexPlayer, AttackStatus.MISS),
        killedPositions: getPositionsForClient(positions.killedPositions, indexPlayer, AttackStatus.KILLED)
    }
}

export function setPositions(killedPositions: ShipPositionModel[]): void {
    positions = {
        killedPositions,
        missedPositions: getMissedPositions(killedPositions)
    }
}

function getPositionsForClient(positions: {
    x: number;
    y: number;
}[], indexPlayer: string, status: string): string[] {
    return positions.map(position => {
        return JSON.stringify({
            type: ActionType.ATTACK,
            data: JSON.stringify({
                    position:
                    {
                        x: position.x,
                        y: position.y
                    },
                    currentPlayer: indexPlayer,
                    status
                }),
            id: 0
        });
    })
}

function getMissedPositions(killedPositions: ShipPositionModel[]): PositionModel[] {
    const missedPositions: PositionModel[] = [];
    killedPositions.sort((a, b) => a.x - b.x);
    killedPositions.sort((a, b) => a.y - b.y);

    if (killedPositions.length === 1) {
        missedPositions.push(
            {
                x: killedPositions[0].x - 1,
                y: killedPositions[0].y 
            },
            {
                x: killedPositions[0].x + 1,
                y: killedPositions[0].y 
            },
            {
                x: killedPositions[0].x,
                y: killedPositions[0].y - 1
            },
            {
                x: killedPositions[0].x,
                y: killedPositions[0].y + 1
            },
            {
                x: killedPositions[0].x + 1,
                y: killedPositions[0].y + 1
            },
            {
                x: killedPositions[0].x + 1,
                y: killedPositions[0].y - 1
            },
            {
                x: killedPositions[0].x - 1,
                y: killedPositions[0].y + 1
            },
            {
                x: killedPositions[0].x - 1,
                y: killedPositions[0].y - 1
            }
        );
    }

    else {
        for (let i = 0; i < killedPositions.length; i++) {

            if (killedPositions[0].x === killedPositions[1].x) {
                missedPositions.push(
                    {
                        x: killedPositions[i].x + 1,
                        y: killedPositions[i].y
                    },
                    {
                        x: killedPositions[i].x - 1,
                        y: killedPositions[i].y
                    }
                );

                if (i === 0) {
                    missedPositions.push(
                        {
                            x: killedPositions[i].x - 1,
                            y: killedPositions[i].y
                        },
                        {
                            x: killedPositions[i].x,
                            y: killedPositions[i].y
                        },
                        {
                            x: killedPositions[i].x + 1,
                            y: killedPositions[i].y
                        }
                    );
                }

                if (i === killedPositions.length - 1) {
                    missedPositions.push(
                        {
                            x: killedPositions[i].x - 1,
                            y: killedPositions[i].y + 1
                        },
                        {
                            x: killedPositions[i].x,
                            y: killedPositions[i].y + 1
                        },
                        {
                            x: killedPositions[i].x + 1,
                            y: killedPositions[i].y + 1
                        }
                    );
                }
            } 
            
            else {
                missedPositions.push(
                    {
                        x: killedPositions[i].x,
                        y: killedPositions[i].y - 1
                    },
                    {
                        x: killedPositions[i].x,
                        y: killedPositions[i].y + 1
                    }
                );

                if (i === 0) {
                    missedPositions.push(
                        {
                            x: killedPositions[i].x - 1,
                            y: killedPositions[i].y - 1
                        },
                        {
                            x: killedPositions[i].x - 1,
                            y: killedPositions[i].y
                        },
                        {
                            x: killedPositions[i].x - 1,
                            y: killedPositions[i].y + 1
                        }
                    );
                }

                if (i === killedPositions.length - 1) {
                    missedPositions.push(
                        {
                            x: killedPositions[i].x + 1,
                            y: killedPositions[i].y - 1
                        },
                        {
                            x: killedPositions[i].x + 1,
                            y: killedPositions[i].y
                        },
                        {
                            x: killedPositions[i].x + 1,
                            y: killedPositions[i].y + 1
                        }
                    );
                }

            }
        }
    }

    return missedPositions;
}
