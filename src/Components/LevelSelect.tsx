import _ from "lodash";
import React, { useContext, useMemo, useState } from "react";
import { Game } from "../Game/Game";
import { buildGame, Puzzle, PuzzleGroup, puzzleGroups } from "../Game/Levels";
import { getSolution, loadSolution, Solution } from "../Game/Storage";
import Button from "./Button";
import { Header, Row } from "./Dialog";
import GameContext, { GameSetterContext } from "./GameContext";
import { Mode } from "./GameSurface";

function getTotalPoints() {
    const allPuzzles = puzzleGroups.flatMap(g => g.puzzles);
    return _.sumBy(allPuzzles, p => {
        const s = getSolution(p);
        if (!!s && s.status === "Complete") {
            return p.difficulty;
        } else {
            return 0;
        }
    });
}

function LevelGroup({ group, setGroup }: { group: PuzzleGroup, setGroup: React.Dispatch<React.SetStateAction<string | undefined>> }) {
    const solutions = group.puzzles.map(p => getSolution(p));
    const solved = solutions.filter(s => !!s && s.status === "Complete");
    const fullySolved = solved.length === group.puzzles.length;

    const totalPoints = useMemo(getTotalPoints, []);
    const isLocked = group.difficulty && totalPoints < group.difficulty;

    let button;
    if (isLocked) {
        button = <Button disabled>{group.difficulty - totalPoints} &#x2605; to unlock</Button>;
    } else if (group.puzzles.length === 0) {
        button = <Button disabled>Empty</Button>;
    } else if (fullySolved) {
        button = <Button onClick={() => setGroup(group.name)}>Completed</Button>;
    } else {
        button = <Button onClick={() => setGroup(group.name)} buttonColor="green">{solved.length} / {group.puzzles.length}</Button>
    }

    return (
        <Row>
            <h1>{isLocked ? group.name.replace(/./g, '?') : group.name}</h1>
            {button}
        </Row>
    );
}

function Level({ level, onLevelSelected }: { level: Puzzle, onLevelSelected: (level: Puzzle, solution: Solution | null) => void }) {
    const solution = getSolution(level);
    const solved = solution?.status === "Complete";

    let button;
    if (solved) {
        button = <Button onClick={() => onLevelSelected(level, solution)}>Solved</Button>;
    } else {
        button = <Button buttonColor="green" onClick={() => onLevelSelected(level, solution)}>{level.difficulty} &#x2605;</Button>;
    }

    return (
        <Row>
            <h1>{level.name}</h1>
            {button}
        </Row>
    );
}

function getDefaultGroup(game: Game) {
    if (!game || !game.level)
        return undefined;

    const currentGroup = puzzleGroups.find(g => !!g.puzzles.find(l => l.name === game.level));
    return currentGroup?.name;
}

function getQuery(): { [k: string]: string | undefined } {
    return Object.fromEntries(new URLSearchParams(window.location.search));
}

export default function LevelSelect({ setMode }: { setMode: (value: Mode) => void }) {
    const game = useContext(GameContext);
    const setGame = useContext(GameSetterContext);
    const [group, setGroup] = useState<string | undefined>(() => getDefaultGroup(game));
    const totalPoints = useMemo(getTotalPoints, []);

    const onLevelSelected = (level: Puzzle, solution: Solution | null) => {
        let newGame = solution ? loadSolution(solution) : undefined;
        newGame = newGame ?? buildGame(level.name, level.cells);
        newGame.ticksPerBlock = game.ticksPerBlock;
        setGame(newGame);

        if (getQuery().edit !== undefined) {
            setMode("Editor");
        } else {
            setMode("Build");
        }
    }

    if (group) {
        const selectedGroup = puzzleGroups.find(g => g.name === group)!;

        return (
            <>
                <Header>
                    <Button onClick={() => setGroup(undefined)}>&#xab; Back</Button>

                    <h1>{group}</h1>
                </Header>

                {selectedGroup.puzzles.map(p => <Level key={p.name} level={p} onLevelSelected={onLevelSelected} />)}
            </>
        );
    }

    return (
        <>
            <Header>
                <h1>Your Stars: {totalPoints}&#x2605;</h1>
            </Header>

            {puzzleGroups.map(g => <LevelGroup key={g.name} group={g} setGroup={setGroup} />)}
        </>
    );
}