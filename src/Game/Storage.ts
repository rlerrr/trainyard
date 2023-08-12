import { Coordinate, Game, GameRunState, GameState, IntersectionGameCell, TrackGameCell } from "./Game";
import { buildGame, findLevelByName, Puzzle, puzzleGroups } from "./Levels";

export type SerializedCell = TrackGameCell | IntersectionGameCell;
export type CellDefinition = SerializedCell & Coordinate;
export type Solution = {
    level: string;
    grid: CellDefinition[];
    status: GameRunState;
};

/** Get the saved solution for the given level from storage, if one exists */
export function getSolution(level: Puzzle): Solution | null {
    const value = localStorage.getItem(`solutions-${level.name}`);
    if (value === null)
        return null;

    return JSON.parse(value);
}

/** Serialize a solution to its more-compact layout */
function serializeSolution(game: Game, gameState: GameState): Solution {
    const grid: CellDefinition[] = [];
    game.grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell.type === "Track" || cell.type === "Intersection") {
                grid.push({ ...cell, row: rowIndex, col: colIndex });
            }
        });
    });

    return {
        level: game.level,
        grid,
        status: gameState.state
    };
}

/** Convert a solution into a full game */
export function loadSolution(sln: Solution): Game | undefined {
    //TODO: this is kind of janky, just concatting on the real level
    const level = puzzleGroups.flatMap(g => g.puzzles).find(p => p.name === sln.level);
    if (level) {
        return buildGame(sln.level, [...sln.grid, ...level.cells]);
    }
}

/** Save a game board and state to storage */
export function saveSolution(game: Game, gameState: GameState) {
    if (!game.level) {
        //Weird but no
        return;
    }

    const level = findLevelByName(game.level);
    if (!level) {
        //Very weird but also no
        return;
    }

    const state = serializeSolution(game, gameState);
    const existing = getSolution(level);
    if (existing && JSON.stringify(existing.grid) === JSON.stringify(state.grid)) {
        if (existing.status === "Complete") {
            //Don't disturb an already complete solution
            return;
        }
    }

    localStorage.setItem(`solutions-${game.level}`, JSON.stringify(state));
}
