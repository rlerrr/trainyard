import { Coordinate, Game, GameCell } from "./Game";

export type CellDefinition = GameCell & Coordinate;

export type Puzzle = {
    readonly name: string;
    readonly difficulty: number;
    readonly cells: ReadonlyArray<Readonly<CellDefinition>>;
};

export type PuzzleGroup = {
    readonly name: string;
    readonly difficulty?: number;
    readonly puzzles: ReadonlyArray<Puzzle>;
};

function getEmptyGrid(): GameCell[][] {
    const grid = [];
    for (let i = 0; i < 7; i++) {
        const array = [];
        for (let j = 0; j < 7; j++) {
            const cell: GameCell = { type: "Empty" };
            array.push(cell);
        }
        grid.push(array);
    }
    return grid;
}

export function buildGame(level: string, cells: readonly Readonly<CellDefinition>[]): Game {
    const newGrid = getEmptyGrid();
    for (const { col, row, ...cell } of cells) {
        newGrid[row][col] = cell;
    }
    return new Game(level, newGrid);
}

export function findLevelByName(level: string): Puzzle | undefined {
    return puzzleGroups.flatMap(g => g.puzzles).find(p => p.name === level);
}

//Level data for all levels
export const puzzleGroups: ReadonlyArray<PuzzleGroup> = [
    {
        name: "Abbotsford",
        puzzles: [
            {
                name: "Red Line",
                difficulty: 1,
                cells: [
                    { type: "Source", trains: ["Red"], direction: "right", col: 1, row: 3 },
                    { type: "Target", trains: ["Red"], direction: "left", col: 5, row: 3 }
                ]
            },
            {
                name: "Grorange lines",
                difficulty: 1,
                cells: [
                    { type: "Source", trains: ["Green"], direction: "bottom", col: 1, row: 1 },
                    { type: "Target", trains: ["Green"], direction: "top", col: 1, row: 5 },
                    { type: "Source", trains: ["Orange"], direction: "right", col: 2, row: 5 },
                    { type: "Target", trains: ["Orange"], direction: "left", col: 5, row: 5 }
                ]
            },
            {
                name: "Yorple lines",
                difficulty: 1,
                cells: [
                    { type: "Target", trains: ["Purple"], direction: "right", col: 0, row: 0 },
                    { type: "Source", trains: ["Purple"], direction: "left", col: 6, row: 0 },
                    { type: "Source", trains: ["Yellow"], direction: "bottom", col: 1, row: 2 },
                    { type: "Target", trains: ["Yellow"], direction: "bottom", col: 5, row: 2 },
                    { type: "Target", trains: ["Yellow"], direction: "top", col: 1, row: 4 },
                    { type: "Source", trains: ["Yellow"], direction: "top", col: 5, row: 4 },
                    { type: "Source", trains: ["Purple"], direction: "right", col: 0, row: 6 },
                    { type: "Target", trains: ["Purple"], direction: "left", col: 6, row: 6 }
                ]
            },
            {
                name: "Magical Trains",
                difficulty: 1,
                cells: [
                    { type: "Source", trains: ["Purple"], direction: "right", col: 0, row: 3 },
                    { type: "Target", trains: ["Purple"], direction: "bottom", col: 3, row: 0 },
                    { type: "Source", trains: ["Purple"], direction: "top", col: 3, row: 6 },
                    { type: "Target", trains: ["Purple"], direction: "left", col: 6, row: 3 }
                ]
            },
            {
                name: "The Red Corner",
                difficulty: 1,
                cells: [
                    { type: "Source", trains: ["Red"], direction: "bottom", col: 1, row: 1 },
                    { type: "Target", trains: ["Red"], direction: "left", col: 5, row: 5 }
                ]
            },
            {
                name: "Purpablu",
                difficulty: 1,
                cells: [
                    { type: "Source", trains: ["Purple"], direction: "left", col: 1, row: 1 },
                    { type: "Target", trains: ["Purple"], direction: "right", col: 5, row: 1 },
                    { type: "Source", trains: ["Blue"], direction: "bottom", col: 1, row: 5 },
                    { type: "Target", trains: ["Blue"], direction: "top", col: 5, row: 5 }
                ]
            }
        ]
    },
    {
        name: "Brampton",
        puzzles: [
            {
                name: "A Rock in the Way",
                difficulty: 1,
                cells: [
                    { type: "Source", trains: ["Green"], direction: "bottom", col: 3, row: 0 },
                    { type: "Rock", col: 3, row: 3 },
                    { type: "Target", trains: ["Green"], direction: "top", col: 3, row: 6 }
                ]
            },
            {
                name: "Green Wally",
                difficulty: 1,
                cells: [
                    { type: "Target", trains: ["Green"], direction: "bottom", col: 1, row: 1 },
                    { type: "Rock", col: 3, row: 1 },
                    { type: "Rock", col: 3, row: 2 },
                    { type: "Rock", col: 3, row: 3 },
                    { type: "Rock", col: 3, row: 4 },
                    { type: "Rock", col: 3, row: 5 },
                    { type: "Rock", col: 3, row: 6 },
                    { type: "Source", trains: ["Green"], direction: "bottom", col: 5, row: 1 }
                ]
            },
            {
                name: "Yellow Snake",
                difficulty: 1,
                cells: [
                    { type: "Source", trains: ["Yellow"], direction: "left", col: 6, row: 0 },
                    { type: "Rock", col: 1, row: 1 },
                    { type: "Rock", col: 2, row: 1 },
                    { type: "Rock", col: 3, row: 1 },
                    { type: "Rock", col: 4, row: 1 },
                    { type: "Rock", col: 5, row: 1 },
                    { type: "Rock", col: 6, row: 1 },
                    { type: "Rock", col: 0, row: 3 },
                    { type: "Rock", col: 1, row: 3 },
                    { type: "Rock", col: 2, row: 3 },
                    { type: "Rock", col: 3, row: 3 },
                    { type: "Rock", col: 4, row: 3 },
                    { type: "Rock", col: 5, row: 3 },
                    { type: "Target", trains: ["Yellow"], direction: "right", col: 0, row: 6 }
                ]
            },
            {
                name: "U-Turn",
                difficulty: 1,
                cells: [
                    { type: "Source", trains: ["Purple"], direction: "bottom", col: 0, row: 0 },
                    { type: "Rock", col: 1, row: 0 },
                    { type: "Rock", col: 1, row: 1 },
                    { type: "Rock", col: 1, row: 2 },
                    { type: "Rock", col: 1, row: 3 },
                    { type: "Rock", col: 1, row: 4 },
                    { type: "Rock", col: 1, row: 5 },
                    { type: "Target", trains: ["Purple"], direction: "bottom", col: 2, row: 0 },
                    { type: "Target", trains: ["Red"], direction: "bottom", col: 4, row: 0 },
                    { type: "Rock", col: 5, row: 0 },
                    { type: "Rock", col: 5, row: 1 },
                    { type: "Rock", col: 5, row: 2 },
                    { type: "Rock", col: 5, row: 3 },
                    { type: "Rock", col: 5, row: 4 },
                    { type: "Rock", col: 5, row: 5 },
                    { type: "Source", trains: ["Red"], direction: "bottom", col: 6, row: 0 }
                ]
            },
            {
                name: "Journey",
                difficulty: 1,
                cells: [
                    { type: "Target", trains: ["Orange"], direction: "bottom", col: 6, row: 0 },
                    { type: "Rock", col: 0, row: 0 },
                    { type: "Rock", col: 3, row: 1 },
                    { type: "Rock", col: 1, row: 2 },
                    { type: "Rock", col: 4, row: 3 },
                    { type: "Rock", col: 6, row: 4 },
                    { type: "Rock", col: 2, row: 5 },
                    { type: "Rock", col: 5, row: 6 },
                    { type: "Source", trains: ["Orange"], direction: "top", col: 0, row: 6 }
                ]
            }
        ]
    },
    {
        name: "Calgary",
        puzzles: [
            {
                name: "Rainbow",
                difficulty: 1,
                cells: [
                    { type: "Target", trains: ["Red"], direction: "bottom", col: 0, row: 0 },
                    { type: "Source", trains: ["Purple"], direction: "bottom", col: 1, row: 0 },
                    { type: "Target", trains: ["Blue"], direction: "bottom", col: 2, row: 0 },
                    { type: "Source", trains: ["Green"], direction: "bottom", col: 3, row: 0 },
                    { type: "Target", trains: ["Yellow"], direction: "bottom", col: 4, row: 0 },
                    { type: "Source", trains: ["Orange"], direction: "bottom", col: 5, row: 0 },
                    { type: "Target", trains: ["Red"], direction: "bottom", col: 6, row: 0 },
                    { type: "Source", trains: ["Red"], direction: "top", col: 0, row: 6 },
                    { type: "Target", trains: ["Purple"], direction: "top", col: 1, row: 6 },
                    { type: "Source", trains: ["Blue"], direction: "top", col: 2, row: 6 },
                    { type: "Target", trains: ["Green"], direction: "top", col: 3, row: 6 },
                    { type: "Source", trains: ["Yellow"], direction: "top", col: 4, row: 6 },
                    { type: "Target", trains: ["Orange"], direction: "top", col: 5, row: 6 },
                    { type: "Source", trains: ["Red"], direction: "top", col: 6, row: 6 }
                ]
            },
            {
                name: "Innie Outie",
                difficulty: 1,
                cells: [
                    { type: "Source", trains: ["Red"], direction: "right", col: 5, row: 1 },
                    { type: "Source", trains: ["Blue"], direction: "right", col: 4, row: 2 },
                    { type: "Target", trains: ["Blue"], direction: "left", col: 2, row: 4 },
                    { type: "Target", trains: ["Red"], direction: "left", col: 1, row: 5 }
                ]
            },
            {
                name: "Around the Back",
                difficulty: 2,
                cells: [
                    { type: "Source", trains: ["Red"], direction: "right", col: 1, row: 1 },
                    { type: "Source", trains: ["Yellow"], direction: "right", col: 1, row: 3 },
                    { type: "Source", trains: ["Blue"], direction: "right", col: 1, row: 5 },
                    { type: "Target", trains: ["Blue"], direction: "left", col: 5, row: 1 },
                    { type: "Target", trains: ["Red"], direction: "left", col: 5, row: 3 },
                    { type: "Target", trains: ["Yellow"], direction: "left", col: 5, row: 5 }
                ]
            },
            {
                name: "Multicolor",
                difficulty: 1,
                cells: [
                    { type: "Source", trains: ["Blue"], direction: "bottom", col: 3, row: 0 },
                    { type: "Source", trains: ["Green"], direction: "right", col: 0, row: 3 },
                    { type: "Source", trains: ["Yellow"], direction: "left", col: 6, row: 3 },
                    { type: "Source", trains: ["Red"], direction: "top", col: 3, row: 6 },
                    { type: "Target", trains: ["Green", "Blue", "Red", "Yellow"], direction: ["left", "right", "top", "bottom"], col: 3, row: 3 }
                ]
            },
            {
                name: "Squiggle",
                difficulty: 1,
                cells: [
                    { type: "Source", trains: ["Orange"], direction: "top", col: 3, row: 2 },
                    { type: "Target", trains: ["Green", "Orange"], direction: ["left", "right"], col: 3, row: 3 },
                    { type: "Source", trains: ["Green"], direction: "bottom", col: 3, row: 4 }
                ]
            },
            {
                name: "Two Two",
                difficulty: 1,
                cells: [
                    { type: "Target", trains: ["Red", "Red"], direction: "bottom", col: 3, row: 0 },
                    { type: "Source", trains: ["Red", "Red"], direction: "top", col: 3, row: 6 }
                ]
            },
            {
                name: "Crossover",
                difficulty: 2,
                cells: [
                    { type: "Source", trains: ["Blue"], direction: "bottom", col: 3, row: 0 },
                    { type: "Source", trains: ["Red"], direction: "right", col: 0, row: 3 },
                    { type: "Target", trains: ["Red"], direction: "left", col: 6, row: 3 },
                    { type: "Target", trains: ["Blue"], direction: "top", col: 3, row: 6 }
                ]
            }
        ]
    },
    {
        name: "Delson",
        puzzles: [
            {
                name: "Mellow Yellow",
                difficulty: 2,
                cells: [

                    { type: "Target", trains: ["Yellow"], direction: "bottom", col: 3, row: 1 },
                    { type: "Target", trains: ["Yellow"], direction: "right", col: 1, row: 5 },
                    { type: "Source", trains: ["Yellow", "Yellow"], direction: "left", col: 5, row: 5 }
                ]
            },
            {
                name: "Delivering Oranges",
                difficulty: 2,
                cells: [
                    { type: "Source", trains: ["Orange", "Orange"], direction: "top", col: 3, row: 3 },
                    { type: "Target", trains: ["Orange"], direction: "bottom", col: 3, row: 4 },
                    { type: "Target", trains: ["Orange"], direction: "top", col: 3, row: 6 }
                ]
            },
            {
                name: "Purple Parcels",
                difficulty: 2,
                cells: [
                    { type: "Source", trains: ["Purple", "Purple", "Purple"], direction: "bottom", col: 0, row: 0 },
                    { type: "Target", trains: ["Purple"], direction: ["left", "bottom"], col: 6, row: 0 },
                    { type: "Target", trains: ["Purple"], direction: ["top", "right"], col: 0, row: 6 },
                    { type: "Target", trains: ["Purple"], direction: ["left", "top"], col: 6, row: 6 },
                    { type: "Rock", col: 3, row: 1 },
                    { type: "Rock", col: 1, row: 3 },
                    { type: "Rock", col: 3, row: 3 },
                    { type: "Rock", col: 5, row: 3 },
                    { type: "Rock", col: 3, row: 5 }
                ]
            },
            {
                name: "Prellow",
                difficulty: 2,
                cells: [
                    { type: "Target", trains: ["Purple"], direction: "right", col: 1, row: 1 },
                    { type: "Target", trains: ["Yellow"], direction: "left", col: 5, row: 1 },
                    { type: "Source", trains: ["Purple", "Yellow"], direction: "top", col: 3, row: 5 }
                ]
            },
            {
                name: "Around the Bend",
                difficulty: 2,
                cells: [
                    { type: "Rock", col: 1, row: 3 },
                    { type: "Rock", col: 2, row: 3 },
                    { type: "Rock", col: 3, row: 3 },
                    { type: "Target", trains: ["Orange"], direction: "bottom", col: 4, row: 3 },
                    { type: "Source", trains: ["Orange", "Blue"], direction: "top", col: 5, row: 3 },
                    { type: "Target", trains: ["Blue"], direction: "bottom", col: 6, row: 3 },
                    { type: "Rock", col: 5, row: 4 },
                    { type: "Rock", col: 5, row: 5 }
                ]
            },
            {
                name: "Preenies",
                difficulty: 2,
                cells: [
                    { type: "Source", trains: ["Purple", "Green", "Purple", "Green", "Purple", "Green", "Purple", "Green", "Purple"], direction: "right", col: 0, row: 0 },
                    { type: "Rock", col: 0, row: 1 },
                    { type: "Rock", col: 1, row: 1 },
                    { type: "Rock", col: 2, row: 1 },
                    { type: "Rock", col: 3, row: 1 },
                    { type: "Rock", col: 4, row: 1 },
                    { type: "Rock", col: 5, row: 1 },
                    { type: "Rock", col: 1, row: 3 },
                    { type: "Rock", col: 2, row: 3 },
                    { type: "Rock", col: 3, row: 3 },
                    { type: "Rock", col: 4, row: 3 },
                    { type: "Rock", col: 5, row: 3 },
                    { type: "Rock", col: 6, row: 3 },
                    { type: "Rock", col: 3, row: 4 },
                    { type: "Rock", col: 3, row: 5 },
                    { type: "Target", trains: ["Green", "Green", "Green", "Green"], direction: ["top", "right"], col: 0, row: 6 },
                    { type: "Target", trains: ["Purple", "Purple", "Purple", "Purple", "Purple"], direction: ["top", "left"], col: 6, row: 6 }
                ]
            },
            {
                name: "Too Many",
                difficulty: 3,
                cells: [
                    { type: "Target", trains: ["Green", "Green", "Green", "Green", "Blue", "Blue", "Blue", "Blue", "Orange", "Orange", "Orange", "Orange"], direction: "bottom", col: 3, row: 0 },
                    { type: "Rock", col: 0, row: 2 },
                    { type: "Rock", col: 1, row: 2 },
                    { type: "Rock", col: 2, row: 2 },

                    { type: "Rock", col: 4, row: 2 },
                    { type: "Rock", col: 5, row: 2 },
                    { type: "Rock", col: 6, row: 2 },

                    { type: "Rock", col: 0, row: 3 },
                    { type: "Rock", col: 1, row: 3 },
                    { type: "Rock", col: 2, row: 3 },

                    { type: "Rock", col: 4, row: 3 },
                    { type: "Rock", col: 5, row: 3 },
                    { type: "Rock", col: 6, row: 3 },

                    { type: "Source", trains: ["Green", "Green", "Green", "Green"], direction: "left", col: 1, row: 5 },
                    { type: "Source", trains: ["Blue", "Blue", "Blue", "Blue"], direction: "top", col: 3, row: 5 },
                    { type: "Source", trains: ["Orange", "Orange", "Orange", "Orange"], direction: "right", col: 5, row: 5 }
                ]
            },
        ]
    },
    {
        name: "Edmonton",
        difficulty: 5,
        puzzles: [
            {
                name: "Yield",
                difficulty: 3,
                cells: [
                    { type: "Source", trains: ["Yellow"], direction: "right", col: 1, row: 1 },
                    { type: "Target", trains: ["Yellow"], direction: "left", col: 5, row: 3 },
                    { type: "Source", trains: ["Yellow"], direction: "right", col: 1, row: 5 }
                ]
            },
            {
                name: "Blue Boys",
                difficulty: 3,
                cells: [
                    { type: "Source", trains: ["Blue"], direction: "bottom", col: 3, row: 1 },
                    { type: "Source", trains: ["Blue"], direction: "left", col: 5, row: 3 },
                    { type: "Target", trains: ["Blue"], direction: "top", col: 3, row: 5 }
                ]
            },
            {
                name: "Timing Test",
                difficulty: 3,
                cells: [
                    { type: "Source", trains: ["Red"], direction: "right", col: 1, row: 1 },
                    { type: "Source", trains: ["Red"], direction: "right", col: 5, row: 1 },
                    { type: "Target", trains: ["Red"], direction: "left", col: 3, row: 6 }
                ]
            },
            {
                name: "Grimace Town",
                difficulty: 3,
                cells: [

                    { type: "Target", trains: ["Purple"], direction: "bottom", col: 3, row: 0 },
                    { type: "Target", trains: ["Purple"], direction: "right", col: 0, row: 3 },
                    { type: "Target", trains: ["Purple"], direction: "left", col: 6, row: 3 },
                    { type: "Source", trains: ["Purple", "Purple", "Purple"], direction: "top", col: 3, row: 6 }
                ]
            },
            {
                name: "Lemon Latency",
                difficulty: 3,
                cells: [
                    { type: "Target", trains: ["Yellow"], direction: "bottom", col: 0, row: 0 },
                    { type: "Source", trains: ["Yellow"], direction: "bottom", col: 1, row: 0 },
                    { type: "Source", trains: ["Yellow"], direction: "left", col: 5, row: 6 }
                ]
            },
            {
                name: "Three Reds",
                difficulty: 3,
                cells: [
                    { type: "Source", trains: ["Red"], direction: "bottom", col: 0, row: 0 },
                    { type: "Source", trains: ["Red"], direction: "bottom", col: 2, row: 0 },
                    { type: "Source", trains: ["Red"], direction: "bottom", col: 6, row: 0 },
                    { type: "Target", trains: ["Red"], direction: "top", col: 3, row: 6 }
                ]
            },
            {
                name: "Colour Theory",
                difficulty: 3,
                cells: [

                    { type: "Source", trains: ["Blue"], direction: "right", col: 1, row: 2 },
                    { type: "Source", trains: ["Yellow"], direction: "left", col: 5, row: 2 },
                    { type: "Target", trains: ["Green"], direction: "top", col: 3, row: 5 }
                ]
            },
            {
                name: "Secondary",
                difficulty: 3,
                cells: [
                    { type: "Source", trains: ["Red"], direction: "bottom", col: 0, row: 0 },
                    { type: "Source", trains: ["Yellow"], direction: "bottom", col: 6, row: 0 },
                    { type: "Target", trains: ["Orange"], direction: "top", col: 6, row: 6 }
                ]
            },
            {
                name: "Nurple",
                difficulty: 3,
                cells: [
                    { type: "Source", trains: ["Red"], direction: "bottom", col: 1, row: 1 },
                    { type: "Target", trains: ["Purple"], direction: ["top", "right", "bottom", "left"], col: 3, row: 3 },
                    { type: "Source", trains: ["Blue"], direction: "top", col: 5, row: 5 }
                ]
            }
        ]
    },
    {
        name: "Fredericton",
        difficulty: 32,
        puzzles: [
            {
                name: "Micro Mix",
                difficulty: 3,
                cells: [
                    { type: "Source", trains: ["Blue"], direction: "right", col: 1, row: 1 },
                    { type: "Source", trains: ["Yellow"], direction: "left", col: 1, row: 5 },
                    { type: "Target", trains: ["Green"], direction: "right", col: 2, row: 5 }
                ]
            },
            {
                name: "The First",
                difficulty: 3,
                cells: [
                    { type: "Source", trains: ["Blue"], direction: "bottom", col: 3, row: 1 },
                    { type: "Target", trains: ["Purple"], direction: "right", col: 1, row: 3 },
                    { type: "Target", trains: ["Purple"], direction: "left", col: 5, row: 3 },
                    { type: "Source", trains: ["Red"], direction: "top", col: 3, row: 5 }
                ]
            },
            {
                name: "Wait Outside",
                difficulty: 3,
                cells: [
                    { type: "Source", trains: ["Red"], direction: "bottom", col: 1, row: 1 },
                    { type: "Rock", col: 3, row: 1 },
                    { type: "Rock", col: 3, row: 2 },
                    { type: "Rock", col: 0, row: 3 },
                    { type: "Rock", col: 1, row: 3 },
                    { type: "Rock", col: 2, row: 3 },
                    { type: "Rock", col: 3, row: 3 },

                    { type: "Rock", col: 5, row: 1 },
                    { type: "Rock", col: 5, row: 2 },
                    { type: "Rock", col: 5, row: 3 },
                    { type: "Rock", col: 5, row: 4 },
                    { type: "Rock", col: 5, row: 5 },
                    { type: "Rock", col: 5, row: 6 },
                    { type: "Target", trains: ["Purple"], direction: "right", col: 0, row: 6 },
                    { type: "Source", trains: ["Blue"], direction: "top", col: 6, row: 6 }
                ]
            },
            {
                name: "Nine Men's Morris",
                difficulty: 3,
                cells: [
                    { type: "Source", trains: ["Yellow"], direction: "bottom", col: 0, row: 0 },
                    { type: "Target", trains: ["Orange"], direction: ["left", "bottom"], col: 6, row: 0 },

                    { type: "Rock", col: 2, row: 2 },
                    { type: "Rock", col: 3, row: 2 },
                    { type: "Rock", col: 4, row: 2 },

                    { type: "Rock", col: 2, row: 3 },
                    { type: "Rock", col: 3, row: 3 },
                    { type: "Rock", col: 4, row: 3 },

                    { type: "Rock", col: 2, row: 4 },
                    { type: "Rock", col: 3, row: 4 },
                    { type: "Rock", col: 4, row: 4 },

                    { type: "Target", trains: ["Orange"], direction: ["top", "right"], col: 0, row: 6 },
                    { type: "Source", trains: ["Red"], direction: "top", col: 6, row: 6 }
                ]
            },
            {
                name: "Eee Tee",
                difficulty: 3,
                cells: [
                    { type: "Source", trains: ["Red"], direction: "top", col: 1, row: 4 },
                    { type: "Source", trains: ["Yellow"], direction: "top", col: 5, row: 4 },
                    { type: "Source", trains: ["Red"], direction: "left", col: 1, row: 6 },
                    { type: "Target", trains: ["Orange", "Purple"], direction: "top", col: 3, row: 6 },
                    { type: "Source", trains: ["Blue"], direction: "right", col: 5, row: 6 }
                ]
            },
            {
                name: "Relish",
                difficulty: 4,
                cells: [
                    { type: "Rock", col: 0, row: 0 },
                    { type: "Source", trains: ["Yellow"], direction: "right", col: 1, row: 0 },
                    { type: "Source", trains: ["Green"], direction: "bottom", col: 0, row: 1 },
                    { type: "Target", trains: ["Green"], direction: "bottom", col: 1, row: 1 },
                    { type: "Rock", col: 4, row: 5 },
                    { type: "Rock", col: 5, row: 5 },
                    { type: "Rock", col: 4, row: 6 },
                    { type: "Source", trains: ["Blue"], direction: "right", col: 5, row: 6 }
                ]
            }
        ]
    },
    {
        name: "Guelph",
        difficulty: 41,
        puzzles: [
            {
                name: "Mirror Squad", difficulty: 3, cells: [
                    { type: "Source", trains: ["Red"], direction: "right", col: 0, row: 0 },
                    { type: "Rock", col: 2, row: 1 },
                    { type: "Target", trains: ["Purple"], direction: "left", col: 6, row: 1 },
                    { type: "Source", trains: ["Blue"], direction: "right", col: 0, row: 2 },
                    { type: "Rock", col: 2, row: 2 },

                    { type: "Rock", col: 0, row: 3 },
                    { type: "Rock", col: 1, row: 3 },
                    { type: "Rock", col: 2, row: 3 },
                    { type: "Rock", col: 3, row: 3 },
                    { type: "Rock", col: 4, row: 3 },
                    { type: "Rock", col: 5, row: 3 },
                    { type: "Rock", col: 6, row: 3 },

                    { type: "Rock", col: 4, row: 4 },
                    { type: "Source", trains: ["Blue"], direction: "left", col: 6, row: 4 },
                    { type: "Target", trains: ["Green"], direction: "right", col: 0, row: 5 },
                    { type: "Rock", col: 4, row: 5 },
                    { type: "Source", trains: ["Yellow"], direction: "left", col: 6, row: 6 }
                ]
            },
            {
                name: "Cute Loop",
                difficulty: 3,
                cells: [
                    { type: "Source", trains: ["Red"], direction: "right", col: 0, row: 0 },
                    { type: "Source", trains: ["Blue"], direction: "left", col: 6, row: 0 },

                    { type: "Rock", col: 0, row: 1 },
                    { type: "Rock", col: 2, row: 1 },
                    { type: "Rock", col: 3, row: 1 },
                    { type: "Rock", col: 4, row: 1 },
                    { type: "Rock", col: 5, row: 1 },
                    { type: "Rock", col: 6, row: 1 },

                    { type: "Rock", col: 4, row: 2 },
                    { type: "Rock", col: 4, row: 3 },
                    { type: "Rock", col: 4, row: 4 },
                    { type: "Rock", col: 4, row: 5 },

                    { type: "Target", trains: ["Purple"], direction: "left", col: 6, row: 2 }
                ]
            },
            {
                name: "Hourglass",
                difficulty: 4,
                cells: [
                    { type: "Source", trains: ["Red"], direction: "right", col: 0, row: 0 },
                    { type: "Source", trains: ["Yellow"], direction: "left", col: 6, row: 0 },

                    { type: "Target", trains: ["Purple"], direction: "top", col: 3, row: 2 },
                    { type: "Rock", col: 3, row: 3 },
                    { type: "Target", trains: ["Orange"], direction: "bottom", col: 3, row: 4 },

                    { type: "Source", trains: ["Red"], direction: "right", col: 0, row: 6 },
                    { type: "Source", trains: ["Blue"], direction: "left", col: 6, row: 6 }
                ]
            },
            {
                name: "Gauss",
                difficulty: 4,
                cells: [
                    { type: "Source", trains: ["Red"], direction: "right", col: 0, row: 2 },
                    { type: "Source", trains: ["Purple"], direction: "left", col: 6, row: 2 },

                    { type: "Rock", col: 0, row: 3 },
                    { type: "Rock", col: 6, row: 3 },

                    { type: "Source", trains: ["Blue"], direction: "right", col: 0, row: 4 },
                    { type: "Target", trains: ["Purple"], direction: "left", col: 6, row: 4 }

                ]
            },
            {
                name: "Third Wheel",
                difficulty: 4,
                cells: [
                    { type: "Source", trains: ["Orange"], direction: "bottom", col: 3, row: 0 },
                    { type: "Source", trains: ["Yellow"], direction: "right", col: 0, row: 3 },
                    { type: "Source", trains: ["Red"], direction: "left", col: 6, row: 3 },
                    { type: "Target", trains: ["Orange"], direction: "top", col: 3, row: 6 }
                ]
            },
            {
                name: "Turtles",
                difficulty: 4,
                cells: [
                    { type: "Source", trains: ["Green"], direction: "right", col: 0, row: 4 },
                    { type: "Source", trains: ["Green"], direction: "left", col: 4, row: 4 },
                    { type: "Source", trains: ["Green"], direction: "right", col: 0, row: 6 },
                    { type: "Source", trains: ["Green"], direction: "left", col: 4, row: 6 },

                    { type: "Rock", col: 5, row: 1 },
                    { type: "Rock", col: 5, row: 2 },
                    { type: "Rock", col: 5, row: 3 },
                    { type: "Rock", col: 5, row: 4 },
                    { type: "Rock", col: 5, row: 5 },
                    { type: "Rock", col: 5, row: 6 },

                    { type: "Target", trains: ["Green"], direction: "top", col: 6, row: 6 }
                ]
            },
            {
                name: "Royals",
                difficulty: 4,
                cells: [
                    { type: "Source", trains: ["Purple"], direction: "bottom", col: 0, row: 0 },

                    { type: "Rock", col: 0, row: 4 },
                    { type: "Rock", col: 1, row: 4 },
                    { type: "Rock", col: 2, row: 4 },
                    { type: "Rock", col: 3, row: 4 },
                    { type: "Rock", col: 4, row: 4 },
                    { type: "Rock", col: 5, row: 4 },

                    { type: "Target", trains: ["Purple"], direction: "top", col: 0, row: 6 },
                    { type: "Rock", col: 1, row: 6 },
                    { type: "Source", trains: ["Purple"], direction: "right", col: 2, row: 6 }
                ]
            },
            {
                name: "Spiced",
                difficulty: 4,
                cells: [
                    { type: "Source", trains: ["Red", "Red"], direction: "right", col: 0, row: 0 },
                    { type: "Source", trains: ["Yellow", "Yellow"], direction: "left", col: 6, row: 0 },

                    { type: "Target", trains: ["Orange", "Orange"], direction: ["top", "right", "bottom", "left"], col: 3, row: 3 },

                    { type: "Source", trains: ["Yellow", "Yellow"], direction: "right", col: 0, row: 6 },
                    { type: "Source", trains: ["Red", "Red"], direction: "left", col: 6, row: 6 }
                ]
            }
        ]
    },
    {
        name: "Halifax",
        difficulty: 66,
        puzzles: [
            {
                name: "Handlebars",
                difficulty: 4,
                cells: [
                    { type: "Target", trains: ["Green"], direction: "right", col: 0, row: 0 },
                    { type: "Target", trains: ["Green"], direction: "left", col: 6, row: 0 },

                    { type: "Source", trains: ["Blue"], direction: "bottom", col: 0, row: 1 },
                    { type: "Source", trains: ["Yellow"], direction: "bottom", col: 6, row: 1 },

                    { type: "Source", trains: ["Yellow"], direction: "top", col: 0, row: 5 },
                    { type: "Source", trains: ["Blue"], direction: "top", col: 6, row: 5 },

                    { type: "Target", trains: ["Green"], direction: "right", col: 0, row: 6 },
                    { type: "Target", trains: ["Green"], direction: "left", col: 6, row: 6 }
                ]
            },
            {
                name: "Compact",
                difficulty: 4,
                cells: [
                    { type: "Target", trains: ["Orange"], direction: ["left", "top"], col: 2, row: 2 },
                    { type: "Source", trains: ["Red"], direction: "top", col: 3, row: 2 },
                    { type: "Rock", col: 4, row: 2 },

                    { type: "Source", trains: ["Blue"], direction: "left", col: 2, row: 3 },
                    { type: "Rock", col: 3, row: 3 },
                    { type: "Source", trains: ["Red"], direction: "right", col: 4, row: 3 },

                    { type: "Rock", col: 2, row: 4 },
                    { type: "Source", trains: ["Yellow"], direction: "bottom", col: 3, row: 4 },
                    { type: "Target", trains: ["Purple"], direction: ["right", "bottom"], col: 4, row: 4 }
                ]
            },
            {
                name: "Wailing",
                difficulty: 5,
                cells: [
                    { type: "Source", trains: ["Blue"], direction: "right", col: 1, row: 1 },
                    { type: "Source", trains: ["Red"], direction: "right", col: 1, row: 3 },
                    { type: "Source", trains: ["Yellow"], direction: "right", col: 1, row: 5 },

                    { type: "Rock", col: 3, row: 0 },
                    { type: "Rock", col: 3, row: 1 },
                    { type: "Rock", col: 3, row: 2 },

                    { type: "Rock", col: 3, row: 4 },
                    { type: "Rock", col: 3, row: 5 },
                    { type: "Rock", col: 3, row: 6 },

                    { type: "Target", trains: ["Red"], direction: "left", col: 5, row: 1 },
                    { type: "Target", trains: ["Yellow"], direction: "left", col: 5, row: 3 },
                    { type: "Target", trains: ["Blue"], direction: "left", col: 5, row: 5 }
                ]
            },
            {
                name: "Laser Master",
                difficulty: 7,
                cells: [
                    { type: "Target", trains: ["Purple", "Purple", "Purple", "Purple"], direction: "bottom", col: 3, row: 0 },

                    { type: "Source", trains: ["Red", "Blue", "Red", "Blue"], direction: "top", col: 3, row: 6 }
                ]
            },
            {
                name: "Squads",
                difficulty: 6,
                cells: [
                    { type: "Source", trains: ["Red"], direction: "right", col: 1, row: 0 },
                    { type: "Source", trains: ["Blue"], direction: "bottom", col: 0, row: 1 },

                    { type: "Target", trains: ["Purple", "Purple", "Orange", "Orange"], direction: "bottom", col: 3, row: 3 },

                    { type: "Source", trains: ["Red"], direction: "top", col: 6, row: 5 },
                    { type: "Source", trains: ["Yellow"], direction: "left", col: 5, row: 6 }
                ]
            },
            {
                name: "Aspire",
                difficulty: 7,
                cells: [
                    { type: "Target", trains: ["Green"], direction: "left", col: 1, row: 4 },
                    { type: "Source", trains: ["Blue", "Red"], direction: "bottom", col: 2, row: 4 },
                    { type: "Source", trains: ["Red", "Yellow"], direction: "bottom", col: 3, row: 4 },
                    { type: "Target", trains: ["Red"], direction: "left", col: 1, row: 5 },
                    { type: "Rock", col: 1, row: 6 }
                ]
            },
            {
                name: "Under The Fence",
                difficulty: 5,
                cells: [
                    { type: "Source", trains: ["Red"], direction: "right", col: 0, row: 0 },
                    { type: "Source", trains: ["Blue"], direction: "right", col: 0, row: 1 },

                    { type: "Rock", col: 3, row: 0 },
                    { type: "Rock", col: 3, row: 1 },
                    { type: "Rock", col: 3, row: 2 },
                    { type: "Rock", col: 3, row: 3 },
                    { type: "Rock", col: 3, row: 4 },

                    { type: "Source", trains: ["Red"], direction: "left", col: 6, row: 0 },
                    { type: "Source", trains: ["Blue"], direction: "left", col: 6, row: 1 },

                    { type: "Target", trains: ["Red"], direction: "top", col: 0, row: 6 },
                    { type: "Target", trains: ["Blue"], direction: "top", col: 6, row: 6 }
                ]
            }
        ]
    },
    {
        name: "Iqaluit",
        difficulty: 104,
        puzzles: [
            {
                name: "Inverse",
                difficulty: 7,
                cells: [
                    { type: "Source", trains: ["Yellow", "Yellow"], direction: "top", col: 0, row: 1 },
                    { type: "Source", trains: ["Blue", "Red"], direction: "top", col: 6, row: 1 },

                    { type: "Rock", col: 0, row: 2 },
                    { type: "Rock", col: 0, row: 3 },
                    { type: "Rock", col: 0, row: 4 },

                    { type: "Target", trains: ["Orange"], direction: ["top", "right", "bottom", "left"], col: 3, row: 3 },

                    { type: "Rock", col: 6, row: 2 },
                    { type: "Rock", col: 6, row: 3 },
                    { type: "Rock", col: 6, row: 4 },

                    { type: "Target", trains: ["Green"], direction: "bottom", col: 0, row: 5 },
                    { type: "Target", trains: ["Green"], direction: "bottom", col: 6, row: 5 }
                ]
            },
            {
                name: "Totem Pole",
                difficulty: 5,
                cells: [
                    { type: "Target", trains: ["Orange", "Orange"], direction: "bottom", col: 3, row: 0 },

                    { type: "Source", trains: ["Yellow"], direction: "left", col: 3, row: 3 },
                    { type: "Source", trains: ["Red"], direction: "left", col: 3, row: 4 },
                    { type: "Source", trains: ["Red"], direction: "right", col: 3, row: 5 },
                    { type: "Source", trains: ["Yellow"], direction: "right", col: 3, row: 6 }
                ]
            },
            {
                name: "Western",
                difficulty: 6,
                cells: [
                    { type: "Source", trains: ["Yellow"], direction: "right", col: 0, row: 0 },

                    { type: "Rock", col: 3, row: 0 },
                    { type: "Source", trains: ["Blue"], direction: "right", col: 1, row: 1 },
                    { type: "Rock", col: 3, row: 1 },
                    { type: "Target", trains: ["Red"], direction: "left", col: 5, row: 1 },
                    { type: "Rock", col: 3, row: 2 },

                    { type: "Source", trains: ["Red"], direction: "right", col: 1, row: 3 },
                    { type: "Target", trains: ["Yellow", "Blue"], direction: "left", col: 5, row: 3 },

                    { type: "Rock", col: 3, row: 4 },
                    { type: "Source", trains: ["Yellow"], direction: "right", col: 1, row: 5 },
                    { type: "Rock", col: 3, row: 5 },
                    { type: "Target", trains: ["Blue"], direction: "left", col: 5, row: 5 },
                    { type: "Rock", col: 3, row: 6 },

                    { type: "Source", trains: ["Blue"], direction: "right", col: 0, row: 6 },
                    { type: "Target", trains: ["Yellow"], direction: "top", col: 6, row: 6 },
                ]
            },
            {
                name: "Collider",
                difficulty: 6,
                cells: [
                    { type: "Source", trains: ["Yellow"], direction: "right", col: 0, row: 2 },
                    { type: "Source", trains: ["Yellow"], direction: "right", col: 0, row: 3 },
                    { type: "Source", trains: ["Yellow"], direction: "right", col: 0, row: 4 },

                    { type: "Target", trains: ["Green", "Green", "Green", "Green", "Green", "Green"], direction: ["top", "right", "bottom", "left"], col: 3, row: 3 },

                    { type: "Source", trains: ["Blue"], direction: "left", col: 6, row: 2 },
                    { type: "Source", trains: ["Blue"], direction: "left", col: 6, row: 3 },
                    { type: "Source", trains: ["Blue"], direction: "left", col: 6, row: 4 }
                ]
            },
            {
                name: "Starship Sandwich",
                difficulty: 6,
                cells: [
                    { type: "Target", trains: ["Purple", "Purple"], direction: "right", col: 0, row: 0 },
                    { type: "Source", trains: ["Red"], direction: "right", col: 0, row: 1 },
                    { type: "Source", trains: ["Red"], direction: "right", col: 0, row: 2 },

                    { type: "Rock", col: 0, row: 3 },
                    { type: "Rock", col: 1, row: 3 },
                    { type: "Rock", col: 2, row: 3 },
                    { type: "Rock", col: 3, row: 3 },
                    { type: "Rock", col: 4, row: 3 },
                    { type: "Rock", col: 5, row: 3 },

                    { type: "Source", trains: ["Blue"], direction: "right", col: 0, row: 4 },
                    { type: "Source", trains: ["Blue"], direction: "right", col: 0, row: 5 },
                    { type: "Target", trains: ["Purple", "Purple"], direction: "right", col: 0, row: 6 }
                ]
            },
            {
                name: "The Classic",
                difficulty: 7,
                cells: [
                    { type: "Target", trains: ["Green"], direction: "bottom", col: 3, row: 0 },
                    { type: "Target", trains: ["Orange"], direction: "bottom", col: 4, row: 0 },

                    { type: "Source", trains: ["Red"], direction: "right", col: 1, row: 2 },

                    { type: "Source", trains: ["Yellow", "Yellow"], direction: "right", col: 1, row: 4 },

                    { type: "Target", trains: ["Green"], direction: "top", col: 0, row: 6 },
                    { type: "Source", trains: ["Blue"], direction: "right", col: 1, row: 6 }
                ]
            }
        ]
    },
    {
        //Start of Paint tiles
        name: "Joliette",
        difficulty: 141,
        puzzles: [
            {
                name: "Red Pear",
                difficulty: 2,
                cells: [
                    { type: "Paint", color: "Red", direction: "bottom-right", col: 0, row: 0 },
                    { type: "Source", trains: ["Green"], direction: "right", col: 0, row: 3 },
                    { type: "Target", trains: ["Red"], direction: "left", col: 6, row: 3 }
                ]
            },
            {
                name: "Paint The Town",
                difficulty: 4,
                cells: [
                    { type: "Source", trains: ["Yellow"], direction: "bottom", col: 0, row: 0 },
                    { type: "Source", trains: ["Blue"], direction: "bottom", col: 6, row: 0 },
                    { type: "Paint", color: "Red", direction: "vertical", col: 3, row: 3 },
                    { type: "Target", trains: ["Orange"], direction: "top", col: 3, row: 6 }
                ]
            },
            {
                name: "Lopsided",
                difficulty: 5,
                cells: [
                    { type: "Target", trains: ["Orange"], direction: "left", col: 3, row: 0 },
                    { type: "Target", trains: ["Orange"], direction: "right", col: 4, row: 0 },

                    { type: "Rock", col: 3, row: 2 },
                    { type: "Rock", col: 4, row: 2 },

                    { type: "Rock", col: 3, row: 3 },
                    { type: "Rock", col: 4, row: 3 },

                    { type: "Rock", col: 3, row: 4 },
                    { type: "Rock", col: 4, row: 4 },

                    { type: "Paint", color: "Yellow", direction: "bottom-left", col: 3, row: 5 },
                    { type: "Paint", color: "Red", direction: "bottom-right", col: 4, row: 5 },

                    { type: "Source", trains: ["Orange"], direction: "top", col: 3, row: 6 },
                    { type: "Source", trains: ["Orange"], direction: "top", col: 4, row: 6 }
                ]
            },
            {
                name: "Plus",
                difficulty: 6,
                cells: [
                    { type: "Paint", color: "Red", direction: "bottom-right", col: 0, row: 0 },

                    { type: "Source", trains: ["Yellow"], direction: "top", col: 0, row: 3 },

                    { type: "Rock", col: 2, row: 2 },
                    { type: "Rock", col: 3, row: 2 },
                    { type: "Rock", col: 3, row: 3 },
                    { type: "Rock", col: 3, row: 4 },

                    { type: "Source", trains: ["Blue"], direction: "right", col: 4, row: 3 },

                    { type: "Target", trains: ["Purple"], direction: ["top", "right"], col: 0, row: 6 }
                ]
            },
            {
                name: "Orange Wall",
                difficulty: 7,
                cells: [
                    { type: "Target", trains: ["Orange"], direction: "left", col: 6, row: 0 },

                    { type: "Paint", color: "Orange", direction: "vertical", col: 3, row: 1 },
                    { type: "Target", trains: ["Orange"], direction: "top", col: 3, row: 2 },

                    { type: "Source", trains: ["Blue", "Blue"], direction: "top", col: 0, row: 3 },
                    { type: "Paint", color: "Orange", direction: "horizontal", col: 3, row: 3 },
                    { type: "Source", trains: ["Blue", "Blue"], direction: "bottom", col: 6, row: 3 },

                    { type: "Target", trains: ["Orange"], direction: "bottom", col: 3, row: 4 },
                    { type: "Paint", color: "Orange", direction: "vertical", col: 3, row: 5 },

                    { type: "Target", trains: ["Orange"], direction: "right", col: 0, row: 6 }
                ]
            }
        ]
    },
    {
        name: "Kamloops",
        difficulty: 160,
        puzzles: [
            {
                name: "Podded Peas",
                difficulty: 4,
                cells: [
                    { type: "Target", trains: ["Green", "Green"], direction: "bottom", col: 3, row: 0 },

                    { type: "Source", trains: ["Purple"], direction: "bottom", col: 0, row: 4 },
                    { type: "Source", trains: ["Purple"], direction: "bottom", col: 6, row: 4 },

                    { type: "Paint", color: "Yellow", direction: "top-right", col: 0, row: 6 },
                    { type: "Paint", color: "Blue", direction: "top-left", col: 6, row: 6 }
                ]
            },
            {
                name: "Let Them Yellow",
                difficulty: 7,
                cells: [
                    { type: "Target", trains: ["Yellow"], direction: "bottom", col: 0, row: 0 },
                    { type: "Target", trains: ["Yellow"], direction: "bottom", col: 6, row: 0 },

                    { type: "Rock", col: 0, row: 3 },
                    { type: "Rock", col: 1, row: 3 },
                    { type: "Rock", col: 2, row: 3 },

                    { type: "Paint", color: "Yellow", direction: "vertical", col: 3, row: 3 },

                    { type: "Rock", col: 4, row: 3 },
                    { type: "Rock", col: 5, row: 3 },
                    { type: "Rock", col: 6, row: 3 },

                    { type: "Target", trains: ["Yellow"], direction: "top", col: 0, row: 6 },
                    { type: "Source", trains: ["Purple", "Purple", "Purple", "Purple"], direction: "top", col: 3, row: 6 },
                    { type: "Target", trains: ["Yellow"], direction: "top", col: 6, row: 6 }
                ]
            },
            {
                name: "The Original",
                difficulty: 7,
                cells: [
                    { type: "Source", trains: ["Blue", "Blue"], direction: "top", col: 3, row: 2 },
                    { type: "Source", trains: ["Yellow"], direction: "top", col: 4, row: 2 },

                    { type: "Target", trains: ["Purple", "Purple"], direction: "bottom", col: 3, row: 3 },
                    { type: "Target", trains: ["Green"], direction: "bottom", col: 4, row: 3 },

                    { type: "Source", trains: ["Red"], direction: "left", col: 6, row: 6 }
                ]
            },
            {
                name: "Stuck To You",
                difficulty: 7,
                cells: [
                    { type: "Source", trains: ["Purple"], direction: "right", col: 0, row: 2 },
                    { type: "Rock", col: 6, row: 2 },

                    { type: "Rock", col: 0, row: 3 },
                    { type: "Paint", color: "Blue", direction: "vertical", col: 3, row: 3 },
                    { type: "Target", trains: ["Green"], direction: "left", col: 6, row: 3 },

                    { type: "Source", trains: ["Purple"], direction: "right", col: 0, row: 4 },
                    { type: "Paint", color: "Yellow", direction: "vertical", col: 3, row: 4 },
                    { type: "Rock", col: 6, row: 4 }
                ]
            },
            {
                name: "Diagonal Mirror",
                difficulty: 7,
                cells: [
                    { type: "Source", trains: ["Blue"], direction: "top", col: 4, row: 1 },
                    { type: "Target", trains: ["Yellow"], direction: ["top", "right"], col: 5, row: 1 },

                    { type: "Rock", col: 4, row: 2 },
                    { type: "Source", trains: ["Blue"], direction: "right", col: 5, row: 2 },

                    { type: "Rock", col: 3, row: 3 },
                    { type: "Rock", col: 2, row: 4 },

                    { type: "Paint", color: "Yellow", direction: "bottom-left", col: 1, row: 5 }
                ]
            },
            {
                name: "Four Shadowing",
                difficulty: 8,
                cells: [
                    { type: "Source", trains: ["Red", "Red", "Red", "Red"], direction: "bottom", col: 0, row: 0 },

                    { type: "Paint", color: "Yellow", direction: "vertical", col: 3, row: 2 },

                    { type: "Paint", color: "Blue", direction: "horizontal", col: 2, row: 3 },

                    { type: "Paint", color: "Orange", direction: "horizontal", col: 4, row: 3 },

                    { type: "Paint", color: "Green", direction: "vertical", col: 3, row: 4 },

                    { type: "Target", trains: ["Blue", "Yellow", "Orange", "Green"], direction: "top", col: 6, row: 6 }
                ]
            },
            {
                name: "Fireball Island",
                difficulty: 10,
                cells: [
                    { type: "Target", trains: ["Green", "Green"], direction: ["bottom", "right"], col: 0, row: 0 },

                    { type: "Rock", col: 2, row: 1 },
                    { type: "Source", trains: ["Red"], direction: "top", col: 4, row: 1 },

                    { type: "Source", trains: ["Yellow"], direction: "right", col: 5, row: 2 },

                    { type: "Rock", col: 6, row: 3 },

                    { type: "Source", trains: ["Yellow"], direction: "right", col: 5, row: 4 },

                    { type: "Rock", col: 2, row: 5 },
                    { type: "Source", trains: ["Blue"], direction: "bottom", col: 4, row: 5 },

                    { type: "Target", trains: ["Orange", "Orange"], direction: ["top", "right"], col: 0, row: 6 }
                ]
            }
        ]
    },
    {
        //Start of splitter tiles
        name: "London",
        difficulty: 205,
        puzzles: [
            {
                name: "Round The Twist",
                difficulty: 3,
                cells: [
                    { type: "Splitter", direction: "bottom", col: 3, row: 3 },

                    { type: "Target", trains: ["Red"], direction: "top", col: 0, row: 6 },
                    { type: "Source", trains: ["Purple"], direction: "top", col: 3, row: 6 },
                    { type: "Target", trains: ["Blue"], direction: "top", col: 6, row: 6 }
                ]
            },
            {
                name: "More Is Merrier",
                difficulty: 4,
                cells: [
                    { type: "Source", direction: "right", trains: ["Green", "Green", "Green", "Green"], row: 3, col: 0 },
                    { type: "Splitter", direction: "top", row: 3, col: 3 },
                    { type: "Target", direction: ["left"], trains: ["Blue", "Blue"], row: 3, col: 6 },
                    { type: "Target", direction: ["right"], trains: ["Yellow", "Yellow", "Yellow", "Yellow"], row: 4, col: 0 },
                    { type: "Target", direction: ["left"], trains: ["Blue", "Blue"], row: 4, col: 6 }
                ]
            },
            {
                name: "Three Peas",
                difficulty: 4,
                cells: [
                    { type: "Target", direction: ["bottom"], trains: ["Yellow", "Yellow", "Yellow"], row: 0, col: 4 },
                    { type: "Source", direction: "left", trains: ["Green"], row: 2, col: 3 },
                    { type: "Source", direction: "left", trains: ["Green"], row: 3, col: 3 },
                    { type: "Splitter", direction: "right", row: 3, col: 4 },
                    { type: "Source", direction: "left", trains: ["Green"], row: 4, col: 3 },
                    { type: "Target", direction: ["top"], trains: ["Blue", "Blue", "Blue"], row: 6, col: 4 }
                ]
            },
            {
                name: "Ackee Tree",
                difficulty: 5,
                cells: [
                    { type: "Source", direction: "bottom", trains: ["Green"], row: 0, col: 3 },
                    { type: "Splitter", direction: "top", row: 1, col: 3 },
                    { type: "Target", direction: ["right"], trains: ["Blue"], row: 2, col: 3 },
                    { type: "Target", direction: ["left"], trains: ["Yellow", "Yellow"], row: 3, col: 3 },
                    { type: "Target", direction: ["top", "right"], trains: ["Red"], row: 4, col: 3 },
                    { type: "Splitter", direction: "bottom", row: 5, col: 3 },
                    { type: "Source", direction: "top", trains: ["Orange"], row: 6, col: 3 }
                ]
            },
            {
                name: "Hookshot",
                difficulty: 6,
                cells: [
                    { type: "Source", direction: "top", trains: ["Blue"], row: 1, col: 1 },
                    { type: "Target", direction: ["right"], trains: ["Green"], row: 1, col: 5 },
                    { type: "Splitter", direction: "right", row: 3, col: 3 },
                    { type: "Target", direction: ["left"], trains: ["Red"], row: 5, col: 1 },
                    { type: "Source", direction: "bottom", trains: ["Orange"], row: 5, col: 5 }
                ]
            },
            {
                name: "Pick Your Partner",
                difficulty: 7,
                cells: [
                    { type: "Target", direction: ["right"], trains: ["Blue"], row: 0, col: 0 },
                    { type: "Target", direction: ["right"], trains: ["Blue"], row: 1, col: 0 },
                    { type: "Target", direction: ["right"], trains: ["Blue"], row: 2, col: 0 },
                    { type: "Splitter", direction: "bottom", row: 2, col: 3 },
                    { type: "Target", direction: ["left"], trains: ["Red"], row: 2, col: 6 },
                    { type: "Rock", row: 3, col: 0 },
                    { type: "Rock", row: 3, col: 1 },
                    { type: "Rock", row: 3, col: 2 },
                    { type: "Rock", row: 3, col: 4 },
                    { type: "Rock", row: 3, col: 5 },
                    { type: "Rock", row: 3, col: 6 },
                    { type: "Source", direction: "right", trains: ["Purple"], row: 5, col: 0 },
                    { type: "Splitter", direction: "left", row: 5, col: 2 },
                    { type: "Source", direction: "left", trains: ["Blue"], row: 5, col: 6 }
                ]
            },
            {
                name: "Primer",
                difficulty: 8,
                cells: [
                    { type: "Source", direction: "bottom", trains: ["Yellow"], row: 0, col: 3 },
                    { type: "Splitter", direction: "top", row: 2, col: 3 },
                    { type: "Target", direction: "top", trains: ["Yellow"], row: 6, col: 0 },
                    { type: "Target", direction: "top", trains: ["Yellow"], row: 6, col: 3 },
                    { type: "Target", direction: "top", trains: ["Yellow"], row: 6, col: 6 }
                ]
            },
            {
                name: "Reunited",
                difficulty: 9,
                cells: [
                    { type: "Splitter", direction: "bottom", row: 0, col: 1 },
                    { type: "Source", direction: "left", trains: ["Blue"], row: 1, col: 3 },
                    { type: "Source", direction: "right", trains: ["Purple"], row: 3, col: 3 },
                    { type: "Target", direction: ["left"], trains: ["Purple"], row: 5, col: 3 }
                ]
            },
            {
                name: "Star Stuck",
                difficulty: 10,
                cells: [
                    { type: "Source", direction: "top", trains: ["Orange", "Orange", "Orange", "Orange"], row: 2, col: 2 },
                    { type: "Target", direction: "top", trains: ["Red", "Blue", "Blue", "Red"], row: 2, col: 4 },
                    { type: "Paint", direction: "bottom-right", color: "Blue", row: 4, col: 3 },
                    { type: "Paint", direction: "top-left", color: "Red", row: 5, col: 3 }
                ]
            }
        ]
    },
    {
        name: "Mississauga",
        difficulty: 261,
        puzzles: [
            {
                name: "Warm Up",
                difficulty: 4,
                cells: [
                    { type: "Target", direction: ["right"], trains: ["Blue", "Blue", "Yellow"], row: 0, col: 2 },
                    { type: "Splitter", direction: "bottom", row: 0, col: 3 },
                    { type: "Target", direction: ["left"], trains: ["Red", "Red", "Yellow"], row: 0, col: 4 },
                    { type: "Source", direction: "top", trains: ["Blue", "Yellow", "Red"], row: 6, col: 2 },
                    { type: "Source", direction: "top", trains: ["Red", "Blue", "Yellow"], row: 6, col: 4 }
                ]
            },
            {
                name: "The Numerator",
                difficulty: 5,
                cells: [
                    { type: "Target", direction: ["bottom"], trains: ["Yellow"], row: 0, col: 2 },
                    { type: "Target", direction: ["bottom"], trains: ["Purple"], row: 0, col: 4 },
                    { type: "Splitter", direction: "bottom", row: 3, col: 2 },
                    { type: "Splitter", direction: "bottom", row: 3, col: 4 },
                    { type: "Source", direction: "top", trains: ["Orange"], row: 6, col: 2 },
                    { type: "Source", direction: "top", trains: ["Green"], row: 6, col: 4 }
                ]
            },
            {
                name: "Drone vs Probe",
                difficulty: 6,
                cells: [
                    { type: "Target", direction: ["bottom"], trains: ["Yellow"], row: 0, col: 3 },
                    { type: "Splitter", direction: "left", row: 1, col: 3 },
                    { type: "Paint", direction: "vertical", color: "Yellow", row: 2, col: 1 },
                    { type: "Rock", row: 2, col: 2 },
                    { type: "Source", direction: "left", trains: ["Blue"], row: 2, col: 6 },
                    { type: "Rock", row: 3, col: 3 },
                    { type: "Rock", row: 4, col: 4 },
                    { type: "Splitter", direction: "right", row: 5, col: 3 },
                    { type: "Target", direction: ["left"], trains: ["Yellow"], row: 5, col: 6 },
                    { type: "Target", direction: "top", trains: ["Blue"], row: 6, col: 3 }
                ]
            },
            {
                name: "Ochos Rios",
                difficulty: 7,
                cells: [
                    { type: "Source", direction: "top", trains: ["Purple"], row: 1, col: 1 },
                    { type: "Target", direction: ["left"], trains: ["Orange", "Blue"], row: 3, col: 2 },
                    { type: "Splitter", direction: "right", row: 3, col: 3 },
                    { type: "Source", direction: "bottom", trains: ["Green"], row: 5, col: 5 }
                ]
            },
            {
                name: "Port Credit",
                difficulty: 8,
                cells: [
                    { type: "Target", direction: ["right"], trains: ["Yellow"], row: 0, col: 0 },
                    { type: "Rock", row: 0, col: 3 },
                    { type: "Source", direction: "bottom", trains: ["Red"], row: 1, col: 0 },
                    { type: "Rock", row: 1, col: 3 },
                    { type: "Paint", direction: "horizontal", color: "Blue", row: 1, col: 5 },
                    { type: "Rock", row: 2, col: 3 },
                    { type: "Rock", row: 4, col: 3 },
                    { type: "Source", direction: "top", trains: ["Red"], row: 5, col: 0 },
                    { type: "Rock", row: 5, col: 3 },
                    { type: "Paint", direction: "horizontal", color: "Yellow", row: 5, col: 5 },
                    { type: "Target", direction: ["right"], trains: ["Blue"], row: 6, col: 0 },
                    { type: "Rock", row: 6, col: 3 }
                ]
            },
            {
                name: "Turtle",
                difficulty: 9,
                cells: [
                    { type: "Target", direction: ["right"], trains: ["Yellow"], row: 0, col: 0 },
                    { type: "Target", direction: ["right"], trains: ["Blue", "Red", "Yellow", "Blue"], row: 1, col: 0 },
                    { type: "Splitter", direction: "bottom", row: 1, col: 1 },
                    { type: "Paint", direction: "vertical", color: "Red", row: 3, col: 4 },
                    { type: "Paint", direction: "vertical", color: "Yellow", row: 3, col: 5 },
                    { type: "Paint", direction: "vertical", color: "Purple", row: 4, col: 4 },
                    { type: "Paint", direction: "vertical", color: "Green", row: 4, col: 5 },
                    { type: "Source", direction: "right", trains: ["Yellow"], row: 6, col: 0 }
                ]
            },
            {
                name: "Factories",
                difficulty: 10,
                cells: [
                    { type: "Paint", direction: "vertical", color: "Blue", row: 1, col: 1 },
                    { type: "Paint", direction: "vertical", color: "Green", row: 1, col: 5 },
                    { type: "Paint", direction: "vertical", color: "Green", row: 3, col: 1 },
                    { type: "Paint", direction: "vertical", color: "Blue", row: 3, col: 5 },
                    { type: "Target", direction: ["right"], trains: ["Blue"], row: 4, col: 0 },
                    { type: "Target", direction: ["left"], trains: ["Green"], row: 4, col: 6 },
                    { type: "Source", direction: "top", trains: ["Orange", "Orange"], row: 5, col: 1 },
                    { type: "Source", direction: "top", trains: ["Purple", "Purple"], row: 5, col: 5 }
                ]
            },
            {
                name: "Tor",
                difficulty: 10,
                cells: [
                    { type: "Target", direction: ["bottom"], trains: ["Green"], row: 0, col: 1 },
                    { type: "Target", direction: ["bottom"], trains: ["Purple"], row: 0, col: 3 },
                    { type: "Target", direction: ["bottom"], trains: ["Orange"], row: 0, col: 5 },
                    { type: "Source", direction: "right", trains: ["Red"], row: 1, col: 0 },
                    { type: "Source", direction: "right", trains: ["Yellow"], row: 1, col: 2 },
                    { type: "Source", direction: "right", trains: ["Blue"], row: 1, col: 4 },
                    { type: "Source", direction: "right", trains: ["Blue"], row: 3, col: 0 },
                    { type: "Source", direction: "right", trains: ["Red"], row: 3, col: 2 },
                    { type: "Source", direction: "right", trains: ["Yellow"], row: 3, col: 4 }
                ]
            }
        ]
    },
    {
        name: "Niagara Falls",
        difficulty: 345,
        puzzles: [
            {
                name: "Horhey",
                difficulty: 8,
                cells: [
                    { type: "Target", direction: ["left"], trains: ["Red"], row: 3, col: 2 },
                    { type: "Target", direction: ["top", "bottom"], trains: ["Red"], row: 3, col: 3 },
                    { type: "Source", direction: "right", trains: ["Red", "Red", "Red", "Red"], row: 3, col: 4 }
                ]
            },
            {
                name: "Christmas Eve",
                difficulty: 6,
                cells: [
                    { type: "Source", direction: "top", trains: ["Red"], row: 1, col: 2 },
                    { type: "Target", direction: "top", trains: ["Green"], row: 1, col: 3 },
                    { type: "Source", direction: "top", trains: ["Red"], row: 1, col: 4 },
                    { type: "Rock", row: 2, col: 0 },
                    { type: "Rock", row: 2, col: 2 },
                    { type: "Rock", row: 2, col: 3 },
                    { type: "Rock", row: 2, col: 4 },
                    { type: "Rock", row: 2, col: 6 },
                    { type: "Rock", row: 3, col: 0 },
                    { type: "Rock", row: 3, col: 2 },
                    { type: "Rock", row: 3, col: 3 },
                    { type: "Rock", row: 3, col: 4 },
                    { type: "Rock", row: 3, col: 6 },
                    { type: "Rock", row: 4, col: 0 },
                    { type: "Rock", row: 4, col: 2 },
                    { type: "Rock", row: 4, col: 3 },
                    { type: "Rock", row: 4, col: 4 },
                    { type: "Rock", row: 4, col: 6 },
                    { type: "Source", direction: "bottom", trains: ["Green"], row: 5, col: 2 },
                    { type: "Target", direction: ["bottom"], trains: ["Red"], row: 5, col: 3 },
                    { type: "Source", direction: "bottom", trains: ["Green"], row: 5, col: 4 }
                ]
            },
            {
                name: "Candlesticks",
                difficulty: 7,
                cells: [
                    { type: "Target", direction: ["bottom"], trains: ["Blue"], row: 0, col: 0 },
                    { type: "Target", direction: ["bottom"], trains: ["Blue"], row: 0, col: 1 },
                    { type: "Target", direction: ["bottom"], trains: ["Yellow"], row: 0, col: 2 },
                    { type: "Target", direction: ["bottom"], trains: ["Red"], row: 0, col: 4 },
                    { type: "Target", direction: ["bottom"], trains: ["Red"], row: 0, col: 5 },
                    { type: "Target", direction: ["bottom"], trains: ["Yellow"], row: 0, col: 6 },
                    { type: "Splitter", direction: "bottom", row: 2, col: 3 },
                    { type: "Rock", row: 3, col: 0 },
                    { type: "Rock", row: 3, col: 1 },
                    { type: "Rock", row: 3, col: 2 },
                    { type: "Rock", row: 3, col: 4 },
                    { type: "Rock", row: 3, col: 5 },
                    { type: "Rock", row: 3, col: 6 },
                    { type: "Source", direction: "top", trains: ["Green"], row: 6, col: 0 },
                    { type: "Source", direction: "top", trains: ["Purple"], row: 6, col: 1 },
                    { type: "Source", direction: "top", trains: ["Orange"], row: 6, col: 2 },
                    { type: "Source", direction: "top", trains: ["Orange"], row: 6, col: 4 },
                    { type: "Source", direction: "top", trains: ["Purple"], row: 6, col: 5 },
                    { type: "Source", direction: "top", trains: ["Green"], row: 6, col: 6 }
                ]
            },
            {
                name: "Argentan",
                difficulty: 8,
                cells: [
                    { type: "Source", direction: "right", trains: ["Yellow"], row: 1, col: 1 },
                    { type: "Source", direction: "right", trains: ["Orange"], row: 2, col: 1 },
                    { type: "Source", direction: "right", trains: ["Yellow"], row: 3, col: 1 },
                    { type: "Target", direction: ["right"], trains: ["Yellow", "Orange"], row: 3, col: 5 },
                    { type: "Source", direction: "right", trains: ["Orange"], row: 4, col: 1 },
                    { type: "Source", direction: "right", trains: ["Yellow"], row: 5, col: 1 }
                ]
            },
            {
                name: "Wagon Wheels",
                difficulty: 8,
                cells: [
                    { type: "Paint", direction: "bottom-right", color: "Green", row: 1, col: 1 },
                    { type: "Target", direction: ["right"], trains: ["Green"], row: 1, col: 3 },
                    { type: "Paint", direction: "bottom-left", color: "Blue", row: 1, col: 5 },
                    { type: "Target", direction: "top", trains: ["Yellow"], row: 3, col: 1 },
                    { type: "Source", direction: "top", trains: ["Brown", "Brown", "Brown", "Brown"], row: 3, col: 3 },
                    { type: "Target", direction: ["bottom"], trains: ["Blue"], row: 3, col: 5 },
                    { type: "Paint", direction: "top-right", color: "Yellow", row: 5, col: 1 },
                    { type: "Target", direction: ["left"], trains: ["Red"], row: 5, col: 3 },
                    { type: "Paint", direction: "top-left", color: "Red", row: 5, col: 5 }
                ]
            },
            {
                name: "Gaius",
                difficulty: 6,
                cells: [
                    { type: "Source", direction: "left", trains: ["Red"], row: 0, col: 6 },
                    { type: "Target", direction: ["right"], trains: ["Red"], row: 1, col: 0 },
                    { type: "Splitter", direction: "top", row: 1, col: 1 },
                    { type: "Splitter", direction: "top", row: 2, col: 5 },
                    { type: "Target", direction: ["left"], trains: ["Red"], row: 2, col: 6 },
                    { type: "Target", direction: ["right"], trains: ["Red"], row: 3, col: 0 },
                    { type: "Splitter", direction: "top", row: 3, col: 1 },
                    { type: "Splitter", direction: "top", row: 4, col: 5 },
                    { type: "Target", direction: ["left"], trains: ["Red"], row: 4, col: 6 },
                    { type: "Target", direction: ["right"], trains: ["Red"], row: 5, col: 0 },
                    { type: "Splitter", direction: "top", row: 5, col: 1 },
                    { type: "Target", direction: ["right"], trains: ["Red"], row: 6, col: 0 },
                    { type: "Splitter", direction: "top", row: 6, col: 5 },
                    { type: "Target", direction: ["left"], trains: ["Red"], row: 6, col: 6 }
                ]
            },
            {
                name: "Machine Gun",
                difficulty: 11,
                cells: [
                    { type: "Target", direction: ["bottom"], trains: ["Red"], row: 0, col: 0 },
                    { type: "Target", direction: ["bottom"], trains: ["Red"], row: 0, col: 1 },
                    { type: "Target", direction: ["bottom"], trains: ["Red"], row: 0, col: 2 },
                    { type: "Target", direction: ["bottom"], trains: ["Red"], row: 0, col: 3 },
                    { type: "Target", direction: ["bottom"], trains: ["Red"], row: 0, col: 4 },
                    { type: "Target", direction: ["bottom"], trains: ["Red"], row: 0, col: 5 },
                    { type: "Target", direction: ["bottom"], trains: ["Red"], row: 0, col: 6 },
                    { type: "Splitter", direction: "bottom", row: 4, col: 5 },
                    { type: "Source", direction: "top", trains: ["Red"], row: 6, col: 5 }
                ]
            },
            {
                name: "Humber",
                difficulty: 9,
                cells: [
                    { type: "Source", direction: "top", trains: ["Green"], row: 2, col: 0 },
                    { type: "Target", direction: "top", trains: ["Yellow", "Yellow"], row: 2, col: 6 },
                    { type: "Target", direction: ["right"], trains: ["Red", "Yellow"], row: 3, col: 0 },
                    { type: "Splitter", direction: "bottom", row: 3, col: 3 },
                    { type: "Source", direction: "left", trains: ["Orange"], row: 3, col: 6 },
                    { type: "Source", direction: "bottom", trains: ["Green"], row: 4, col: 0 },
                    { type: "Target", direction: ["bottom"], trains: ["Blue", "Blue"], row: 4, col: 6 }
                ]
            },
            {
                name: "Cooksville Creek",
                difficulty: 11,
                cells: [
                    { type: "Source", direction: "right", trains: ["Blue"], row: 0, col: 0 },
                    { type: "Target", direction: ["left"], trains: ["Blue", "Blue", "Blue", "Blue"], row: 0, col: 6 },
                    { type: "Splitter", direction: "right", row: 2, col: 0 },
                    { type: "Splitter", direction: "left", row: 2, col: 6 },
                    { type: "Target", direction: "top", trains: ["Blue", "Blue", "Blue", "Blue"], row: 3, col: 0 },
                    { type: "Target", direction: "top", trains: ["Blue", "Blue", "Blue", "Blue"], row: 3, col: 6 },
                    { type: "Splitter", direction: "right", row: 5, col: 0 },
                    { type: "Splitter", direction: "left", row: 5, col: 6 },
                    { type: "Target", direction: "top", trains: ["Blue", "Blue", "Blue", "Blue"], row: 6, col: 0 },
                    { type: "Splitter", direction: "top", row: 6, col: 3 },
                    { type: "Target", direction: "top", trains: ["Blue", "Blue", "Blue", "Blue"], row: 6, col: 6 }
                ]
            },
        ]
    }
];