import pako from "pako";
import { useEffect, useMemo, useState } from "react";
import { GameState } from "../Game/Game";
import { puzzleGroups } from "../Game/Levels";
import { getSolution, loadSolution, Solution } from "../Game/Storage";
import { testSolutionsCompressed } from "../Game/testSolutions";
import Canvas from "./Canvas";
import GameContext, { defaultGameState, GameStateContext } from "./GameContext";

function getSolutions(): Solution[] {
    //Re-using solutions from tests
    const buffer = Uint8Array.from(atob(testSolutionsCompressed), c => c.charCodeAt(0));
    const solutions: Solution[] = JSON.parse(pako.inflate(buffer, { to: 'string' }));

    return puzzleGroups.flatMap(g => g.puzzles).flatMap(level => {
        //Super simple levels are boring to watch
        if (level.difficulty < 3)
            return [];

        //Show the player their completed solutions
        const playerSolution = getSolution(level);
        if (playerSolution !== null && playerSolution.status === "Complete")
            return [playerSolution];

        //It's ok to spoil simple levels
        if (level.difficulty <= 3) {
            const testSolution = solutions.find(s => s.level === level.name);
            if (testSolution)
                return [testSolution];
        }

        return [];
    });
}

function getRandomGame(solutions: Solution[]) {
    const solution = solutions[Math.floor(Math.random() * solutions.length)];
    return loadSolution(solution)!;
}

export default function DemoGame() {
    const solutions = useMemo(() => getSolutions(), []);
    const [gameState, setGameState] = useState<GameState>(defaultGameState);

    const [game, setGame] = useState(() => getRandomGame(solutions));

    useEffect(() => {
        game.onTick = setGameState;
        game.start();

        return () => game.stop();
    }, [game]);

    useEffect(() => {
        if (gameState.state !== "Running") {
            setTimeout(() => setGame(getRandomGame(solutions)), 2000);
        }
    }, [gameState.state, solutions, setGame]);

    return (
        <GameContext.Provider value={game}>
            <GameStateContext.Provider value={gameState}>
                <Canvas />
            </GameStateContext.Provider>
        </GameContext.Provider>
    );
}
