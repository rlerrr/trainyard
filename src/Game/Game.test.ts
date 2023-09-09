import zlib from 'zlib';
import { Game, GameCell, GameState } from "./Game";
import { loadSolution, Solution } from "./Storage";
import { testSolutionsCompressed } from './testSolutions';

//A full game object (no level data needed)
//This is pulled from the trailer at: https://www.youtube.com/watch?v=xWtIb7NEYgM
const testGame: GameCell[][] = [
    [
        { type: "Track", direction: "bottom-right" },
        { type: "Track", direction: "horizontal" },
        { type: "Intersection", track1: "bottom-left", track2: "bottom-right" },
        { type: "Track", direction: "horizontal" },
        { type: "Intersection", track1: "horizontal", track2: "bottom-left" },
        { type: "Intersection", track1: "horizontal", track2: "bottom-right" },
        { type: "Track", direction: "bottom-left" }
    ],
    [
        { type: "Track", direction: "vertical" },
        { type: "Track", direction: "bottom-right" },
        { type: "Intersection", track1: "top-left", track2: "top-right" },
        { type: "Track", direction: "horizontal" },
        { type: "Intersection", track1: "top-right", track2: "bottom-left" },
        { type: "Track", direction: "top-left" },
        { type: "Track", direction: "vertical" }
    ],
    [
        { type: "Intersection", track1: "vertical", track2: "top-right" },
        { type: "Intersection", track1: "top-right", track2: "bottom-left" },
        { type: "Source", direction: "left", trains: ["Blue", "Blue", "Blue", "Blue"] },
        { type: "Empty" },
        { type: "Source", direction: "top", trains: ["Red", "Yellow", "Red", "Yellow"] },
        { type: "Track", direction: "bottom-right" },
        { type: "Intersection", track1: "top-left", track2: "bottom-left" }
    ],
    [
        { type: "Intersection", track1: "bottom-right", track2: "vertical" },
        { type: "Intersection", track1: "top-left", track2: "bottom-right" },
        { type: "Track", direction: "horizontal" },
        { type: "Target", trains: ["Purple", "Green"], direction: ["top", "right", "bottom", "left"] },
        { type: "Track", direction: "horizontal" },
        { type: "Intersection", track1: "top-left", track2: "bottom-right" },
        { type: "Intersection", track1: "top-left", track2: "vertical" }
    ],
    [
        { type: "Intersection", track1: "top-right", track2: "bottom-right" },
        { type: "Track", direction: "top-left" },
        { type: "Source", direction: "bottom", trains: ["Red", "Yellow", "Red", "Yellow"] },
        { type: "Empty" },
        { type: "Source", direction: "right", trains: ["Blue", "Blue", "Blue", "Blue"] },
        { type: "Intersection", track1: "top-right", track2: "bottom-left" },
        { type: "Intersection", track1: "vertical", track2: "bottom-left" }
    ],
    [
        { type: "Track", direction: "vertical" },
        { type: "Track", direction: "bottom-right" },
        { type: "Intersection", track1: "top-right", track2: "bottom-left" },
        { type: "Track", direction: "horizontal" },
        { type: "Intersection", track1: "bottom-right", track2: "bottom-left" },
        { type: "Track", direction: "top-left" },
        { type: "Track", direction: "vertical" }
    ],
    [
        { type: "Track", direction: "top-right" },
        { type: "Intersection", track1: "horizontal", track2: "top-left" },
        { type: "Intersection", track1: "horizontal", track2: "top-right" },
        { type: "Track", direction: "horizontal" },
        { type: "Intersection", track1: "top-left", track2: "top-right" },
        { type: "Track", direction: "horizontal" },
        { type: "Track", direction: "top-left" }
    ]
];

function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

test.concurrent('Test game completes', async () => {
    const game = new Game("A Barrel Roll", testGame, 1);
    let myState: GameState | undefined;
    game.onTick = state => myState = state;
    game.start();

    expect(myState?.state).toBeUndefined();

    do {
        await timeout(50);
    } while (myState?.state === "Running")

    expect(myState?.state).toBe("Complete");
});

test.concurrent.each(["top", "bottom", "left", "right"] as const)('Train crashes off %s edge', async (direction) => {
    const brokenGame = [...testGame];

    switch (direction) {
        case "top":
            brokenGame[0] = [{ type: "Track", direction: "top-right" }, ...brokenGame[0].slice(1)];
            break;
        case "left":
            brokenGame[0] = [{ type: "Track", direction: "horizontal" }, ...brokenGame[0].slice(1)];
            break;
        case "bottom":
            brokenGame[6] = [...brokenGame[6].slice(0, -1), { type: "Track", direction: "bottom-left" }];
            break;
        case "right":
            brokenGame[6] = [...brokenGame[6].slice(0, -1), { type: "Track", direction: "horizontal" }];
            break;
    }

    const game = new Game("A Barrel Roll", brokenGame, 1);
    let myState: GameState | undefined;
    game.onTick = state => myState = state;
    game.start();

    expect(myState?.state).toBeUndefined();

    do {
        await timeout(50);
    } while (myState?.state === "Running")

    expect(myState?.state).toBe("Crashed");
});

test.concurrent.each(["splitter", "source", "target", "rock"] as const)('Train crashes into %s', async (cellType) => {
    let solution: Solution;
    switch (cellType) {
        case "splitter":
            //Entering the wrong side of a splitter
            solution = { "level": "Round The Twist", "grid": [{ "type": "Track", "direction": "bottom-right", "row": 1, "col": 0 }, { "type": "Track", "direction": "horizontal", "row": 1, "col": 1 }, { "type": "Track", "direction": "horizontal", "row": 1, "col": 2 }, { "type": "Track", "direction": "horizontal", "row": 1, "col": 3 }, { "type": "Track", "direction": "bottom-left", "row": 1, "col": 4 }, { "type": "Track", "direction": "vertical", "row": 2, "col": 0 }, { "type": "Track", "direction": "bottom-right", "row": 2, "col": 1 }, { "type": "Track", "direction": "horizontal", "row": 2, "col": 2 }, { "type": "Track", "direction": "bottom-left", "row": 2, "col": 3 }, { "type": "Track", "direction": "vertical", "row": 2, "col": 4 }, { "type": "Track", "direction": "vertical", "row": 3, "col": 0 }, { "type": "Track", "direction": "vertical", "row": 3, "col": 1 }, { "type": "Track", "direction": "bottom-right", "row": 3, "col": 2 }, { "type": "Track", "direction": "top-left", "row": 3, "col": 4 }, { "type": "Track", "direction": "vertical", "row": 4, "col": 0 }, { "type": "Track", "direction": "vertical", "row": 4, "col": 1 }, { "type": "Track", "direction": "top-right", "row": 4, "col": 2 }, { "type": "Track", "direction": "horizontal", "row": 4, "col": 3 }, { "type": "Track", "direction": "horizontal", "row": 4, "col": 4 }, { "type": "Track", "direction": "horizontal", "row": 4, "col": 5 }, { "type": "Track", "direction": "bottom-left", "row": 4, "col": 6 }, { "type": "Track", "direction": "vertical", "row": 5, "col": 0 }, { "type": "Track", "direction": "top-right", "row": 5, "col": 1 }, { "type": "Track", "direction": "horizontal", "row": 5, "col": 2 }, { "type": "Track", "direction": "bottom-left", "row": 5, "col": 3 }, { "type": "Track", "direction": "vertical", "row": 5, "col": 6 }], "status": "Complete" };
            break;
        case "source":
            solution = { "level": "Red Line", "grid": [{ "type": "Track", "direction": "bottom-right", "row": 2, "col": 0 }, { "type": "Track", "direction": "horizontal", "row": 2, "col": 1 }, { "type": "Track", "direction": "bottom-left", "row": 2, "col": 2 }, { "type": "Track", "direction": "top-right", "row": 3, "col": 0 }, { "type": "Intersection", "track1": "horizontal", "track2": "top-left", "row": 3, "col": 2 }, { "type": "Track", "direction": "horizontal", "row": 3, "col": 3 }, { "type": "Track", "direction": "horizontal", "row": 3, "col": 4 }], "status": "Running" };
            break;
        case "target":
            //Entering the wrong side of a target
            solution = { "level": "Red Line", "grid": [{ "type": "Track", "direction": "bottom-right", "row": 2, "col": 3 }, { "type": "Track", "direction": "horizontal", "row": 2, "col": 4 }, { "type": "Track", "direction": "bottom-left", "row": 2, "col": 5 }, { "type": "Track", "direction": "horizontal", "row": 3, "col": 2 }, { "type": "Track", "direction": "top-left", "row": 3, "col": 3 }], "status": "Running" };
            break;
        case "rock":
            solution = { "level": "A Rock in the Way", "grid": [{ "type": "Track", "direction": "vertical", "row": 1, "col": 3 }, { "type": "Track", "direction": "vertical", "row": 2, "col": 3 }, { "type": "Track", "direction": "vertical", "row": 4, "col": 3 }, { "type": "Track", "direction": "vertical", "row": 5, "col": 3 }], "status": "Running" };
            break;
        default:
            throw Error(`Unknown cellType '${cellType}'`);
    }

    const game = loadSolution(solution)!;
    game.ticksPerBlock = 1;

    let myState: GameState | undefined;
    game.onTick = state => myState = state;
    game.start();

    expect(myState?.state).toBeUndefined();

    do {
        await timeout(50);
    } while (myState?.state === "Running")

    expect(myState?.state).toBe("Crashed");
});

describe('solutionTests', () => {
    //Decompress and parse the solutions
    const decodedBuffer = Buffer.from(testSolutionsCompressed, 'base64');
    const decompressedBuffer = zlib.unzipSync(decodedBuffer);
    const testSolutions: Solution[] = JSON.parse(decompressedBuffer.toString());

    //There are 99 regular puzzles, expecting a solution for each one!
    expect(testSolutions.length).toBe(99);

    const mappedSolutions = testSolutions.map((s): [string, Solution] => [s.level, s]);
    test.concurrent.each(mappedSolutions)("Test solution '%s' completes", async (name, solution) => {
        const game = loadSolution(solution)!;
        game.ticksPerBlock = 1;

        let myState: GameState | undefined;
        game.onTick = state => myState = state;
        game.start();

        expect(myState?.state).toBeUndefined();

        do {
            await timeout(50);
        } while (myState?.state === "Running")

        expect(myState?.state).toBe("Complete");
    });
});