import { useContext, useMemo, useState } from "react";
import { buildGame, Puzzle } from "../Game/Levels";
import { gameToCellDefinitions, usePuzzleState } from "../Game/Storage";
import Button from "./Button";
import Canvas from "./Canvas";
import { Header, Row } from "./Dialog";
import GameContext, { GameSetterContext } from "./GameContext";
import { Mode } from "./GameSurface";
import { Level } from "./LevelSelect";

function getUniqueName(existingPuzzles: Puzzle[]) {
    for (let i = 1; i < 1000; i++) {
        let name: string = "My Puzzle";
        if (i > 1) {
            name = `My Puzzle ${i}`;
        }

        if (!existingPuzzles.some(p => p.name === name)) {
            return name;
        }
    }

    return `My Puzzle ${Math.random()}`;
}

const weirdStringify = (input: unknown, indent?: boolean): string => {
    if (input === null)
        return 'null';

    if (input instanceof Date)
        return JSON.stringify(input);

    // In case of an array we'll stringify all objects.
    if (Array.isArray(input)) {
        return `[${indent ? "\r\n" : ""}${input
            .map(obj => `${weirdStringify(obj)}`)
            .join(indent ? ",\r\n" : ",")
            }${indent ? "\r\n" : ""}]`;
    }

    // not an object, stringify using native function
    if (typeof input !== "object" || input instanceof Date || input === null) {
        return JSON.stringify(input);
    }
    // Implements recursive object serialization according to JSON spec
    // but without quotes around the keys.
    return `{${Object.entries(input)
        .map(([key, value]) => `${key}:${weirdStringify(value, Array.isArray(value) ? indent : false)}`)
        .join(indent ? ",\r\n" : ",")
        }}`;
};

function PuzzlePreview({ level }: { level: Puzzle }) {
    const game = useMemo(() => buildGame(level.name, level.cells), [level]);

    return <GameContext.Provider value={game}><Canvas preview /></GameContext.Provider>;
}

export default function MyPuzzles({ setMode }: { setMode: React.Dispatch<React.SetStateAction<Mode>> }) {
    const [puzzles, setPuzzles] = usePuzzleState();
    const [selected, setSelected] = useState<Puzzle>();
    const setGame = useContext(GameSetterContext);

    const onLevelSelected = (mode: Mode) => {
        if (selected) {
            const newGame = buildGame(selected.name, selected.cells);
            setGame(newGame);
            setMode(mode);
        }
    };

    const copyJson = () => {
        if (selected) {
            navigator.clipboard.writeText(weirdStringify(selected, true));
        }
    };

    if (selected) {
        return (
            <>
                <Header>
                    <Button onClick={() => setSelected(undefined)}>&#xab; Back</Button>

                    <h1>Puzzle Info</h1>

                    <Button onClick={() => onLevelSelected("Editor")}>Edit</Button>
                </Header>

                <Row>
                    <PuzzlePreview level={selected} />

                    <Button onClick={() => onLevelSelected("Build")}>Solve</Button>
                </Row>

                <Row>
                    <Button onClick={copyJson}>Copy to Clipboard</Button>
                    <Button color="Red">Delete</Button>
                </Row>
            </>
        );
    }


    return (
        <>
            <Header>
                <Button onClick={() => setMode("Menu")}>&#xab; Back</Button>

                <h1>My puzzles</h1>

                <Button onClick={() => setPuzzles(current => [...current, { name: getUniqueName(current), difficulty: 5, cells: [] }])}>New</Button>
            </Header>
            {puzzles.map(p => <Level key={p.name} level={p} onLevelSelected={setSelected} />)}
        </>
    );
}