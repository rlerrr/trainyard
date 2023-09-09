import { useCallback, useState } from "react";
import { Coordinate, Game, GameCell, GameRunState, GameState, IntersectionGameCell, TrackGameCell } from "./Game";
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
        //Must be a custom level
        saveCustomPuzzle(game);
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

export function usePuzzleState(): [Puzzle[], React.Dispatch<React.SetStateAction<Puzzle[]>>] {
    const getPuzzles = (): Puzzle[] => {
        const value = localStorage.getItem('my-trainyard-puzzles');
        if (value === null || value === '')
            return [];

        return JSON.parse(value);
    };

    const [puzzles, setPuzzles] = useState<Puzzle[]>(getPuzzles);
    const setPuzzlesStored = useCallback<React.Dispatch<React.SetStateAction<Puzzle[]>>>((value) => {
        if (typeof value === 'function') {
            setPuzzles((prevValue) => {
                const newValue = value(prevValue);
                localStorage.setItem('my-trainyard-puzzles', JSON.stringify(newValue));
                return newValue;
            });
        } else {
            localStorage.setItem('my-trainyard-puzzles', JSON.stringify(value));
            setPuzzles(value);
        }
    }, [setPuzzles]);
    return [puzzles, setPuzzlesStored];
}

function saveCustomPuzzle(game: Game): void {
    const value = localStorage.getItem('my-trainyard-puzzles');
    if (value === null || value === '')
        return;

    const puzzles: Puzzle[] = JSON.parse(value);
    if (!Array.isArray(puzzles))
        return;

    const target = puzzles.findIndex(p => p.name === game.level);
    if (target < 0)
        return;

    const cells = gameToCellDefinitions(game);

    const newPuzzle: Puzzle = { ...puzzles[target], cells };
    puzzles.splice(target, 1, newPuzzle);
    localStorage.setItem('my-trainyard-puzzles', JSON.stringify(puzzles));
}

export function gameToCellDefinitions(game: Game): (GameCell & Coordinate)[] {
    const cells: (GameCell & Coordinate)[] = [];
    game.grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell.type !== "Empty") {
                cells.push({ ...cell, row: rowIndex, col: colIndex });
            }
        });
    });
    return cells;
}
