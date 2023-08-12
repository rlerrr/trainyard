import { useContext } from "react";
import { buildGame, findLevelByName, Puzzle, puzzleGroups } from "../Game/Levels";
import { getSolution, loadSolution } from "../Game/Storage";
import Button from "./Button";
import GameContext, { GameSetterContext } from "./GameContext";
import { Mode } from "./GameSurface";
import styles from "./LevelComplete.module.scss";

export default function LevelComplete({ setMode }: { setMode: (value: Mode) => void }) {
    const game = useContext(GameContext);
    const setGame = useContext(GameSetterContext);
    const level = findLevelByName(game.level);

    const group = level && puzzleGroups.find(g => g.puzzles.includes(level));
    const previousPuzzle = level && group?.puzzles.at(group?.puzzles.indexOf(level) - 1);
    const nextPuzzle = level && group?.puzzles.at(group?.puzzles.indexOf(level) + 1);

    const onLevelSelected = (level: Puzzle) => {
        const solution = getSolution(level);
        let newGame = solution ? loadSolution(solution) : undefined;
        newGame = newGame ?? buildGame(level.name, level.cells);
        setGame(newGame);

        setMode("Build");
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.completed}>
                <h1>You solved it!</h1>

                <div>
                    <Button onClick={() => setMode("Build")} buttonColor="blue">Replay Solution</Button>
                    <Button onClick={() => setMode("LevelSelect")}>Choose Level</Button>
                </div>

                <div>
                    <Button disabled={!previousPuzzle} onClick={() => previousPuzzle && onLevelSelected(previousPuzzle)}>Previous</Button>
                    <Button buttonColor="green" disabled={!nextPuzzle} onClick={() => nextPuzzle && onLevelSelected(nextPuzzle)}>Next</Button>
                </div>
            </div>
        </div>
    );
}
