import zlib from 'zlib';
import { Game, GameCell, GameState } from "./Game";
import { loadSolution, Solution } from "./Storage";

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
})

describe('solutionTests', () => {
    //Solutions to all normal levels (gzip compressed JSON)
    const testSolutionsCompressed = "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";

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