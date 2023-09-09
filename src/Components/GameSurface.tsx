import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { clearLine } from 'readline';
import { Game, GameCell, GameState } from '../Game/Game';
import { findLevelByName, puzzleGroups } from '../Game/Levels';
import { saveSolution } from '../Game/Storage';
import { Undo, UndoContext, UndoState } from '../Game/Undo';
import Button, { ButtonColumn } from './Button';
import Canvas from './Canvas';
import DemoGame from './DemoGame';
import Dialog, { Footer, Header, Row } from './Dialog';
import GameContext, { BuildContext, CellEvent, defaultGame, defaultGameState, GameSetterContext, GameStateContext } from './GameContext';
import styles from './GameSurface.module.scss';
import LevelComplete from './LevelComplete';
import LevelEditor from './LevelEditor';
import LevelSelect, { getTotalPoints } from './LevelSelect';
import MyPuzzles from './MyPuzzles';
import { Speed } from './Speed';
import Status from './Status';

export type Mode = "Menu" | "Regular" | "Bonus" | "Featured" | "Engineer" | "Build" | "Erase" | "Run" | "Complete" | "Editor";

function GameCanvas({ mode, setMode }: { mode: Mode, setMode: (value: Mode) => void }) {
    const game = useContext(GameContext);
    const [gameState, setGameState] = useState<GameState>(defaultGameState);

    useEffect(() => {
        if (mode === "Run") {
            game.onTick = setGameState;
            game.start();

            return () => game.stop();
        } else {
            setGameState(defaultGameState);
        }
    }, [game, mode]);

    const { state } = gameState;
    useEffect(() => {
        if (state === "Complete") {
            setMode("Complete");
        }
    }, [state, setMode]);

    useEffect(() => {
        saveSolution(game, gameState);
    }, [game, gameState]);

    switch (mode) {
        case "Run":
            return (
                <GameStateContext.Provider value={gameState}>
                    <Canvas />

                    <Footer>
                        <Status />
                        <ButtonColumn>
                            <Button onClick={() => setMode("Build")}>Stop!</Button>
                            <Speed />
                        </ButtonColumn>
                    </Footer>
                </GameStateContext.Provider>
            );
        case "Erase":
            return <EraseMode setMode={setMode} />;
        case "Editor":
            return <LevelEditor />;
        default:
            return <BuildMode setMode={setMode} />;
    }
}

function UndoButton() {
    const undoCtx = useContext(UndoContext);
    const doUndo = useMemo(() => undoCtx.undo.bind(undoCtx), [undoCtx]);

    return <Button disabled={!undoCtx.canUndo} onClick={doUndo}>Undo</Button>;
}

function BuildMode({ setMode }: { setMode: (value: Mode) => void }) {
    const setGame = useContext(GameSetterContext);
    const onCellEvent = useCallback((e: CellEvent) => {
        if (e.type === "mouseThrough") {
            setGame(game => {
                const newGame = game?.drawTrack(e.cell, e.enterEdge, e.exitEdge);
                return newGame ?? game;
            });
        } else if (e.type === "dblclick") {
            //Flip intersections
            const { cell } = e;
            if (cell.type === "Intersection") {
                setGame(game => {
                    const newGame = game?.replaceCell(cell, { ...cell, track1: cell.track2, track2: cell.track1 });
                    return newGame ?? game;
                });
            }
        }
    }, [setGame]);

    return (
        <BuildContext.Provider value={onCellEvent}>
            <Canvas />

            <Footer>
                <ButtonColumn>
                    <Button buttonColor="yellow" onClick={() => setMode("Erase")}>Erase</Button>
                    <UndoButton />
                </ButtonColumn>
                <ButtonColumn>
                    <Button onClick={() => setMode("Run")} buttonColor="green">Start the trains!</Button>
                    <Speed />
                </ButtonColumn>
            </Footer>
        </BuildContext.Provider>
    );
}

function EraseMode({ setMode }: { setMode: (value: Mode) => void }) {
    const setGame = useContext(GameSetterContext);
    const onCellEvent = useCallback((e: CellEvent) => {
        if (e.type === "mouseEnter" || e.type === "click") {
            if (e.cell.type === "Intersection" || e.cell.type === "Track") {
                setGame(game => {
                    const newGame = game?.replaceCell(e.cell, { type: "Empty" });
                    return newGame ?? game;
                });
            }
        }
    }, [setGame]);

    return (
        <BuildContext.Provider value={onCellEvent}>
            <Canvas className={styles.erasing} />

            <Footer>
                <ButtonColumn>
                    <Button buttonColor="yellow" onClick={() => setMode("Build")}>Stop Erasing</Button>
                    <UndoButton />
                </ButtonColumn>
                <ButtonColumn>
                    <Button onClick={() => setMode("Run")} buttonColor="green">Start the trains!</Button>
                    <Speed />
                </ButtonColumn>
            </Footer>
        </BuildContext.Provider>
    );
}

function UndoContextProvider({ children, setGame }: { children: React.ReactNode, setGame: React.Dispatch<React.SetStateAction<Game | undefined>> }) {
    const [state, setState] = useState<UndoState>({ inx: 0, history: [] });
    const doUndo: React.Dispatch<React.SetStateAction<UndoState>> = useCallback((value: React.SetStateAction<UndoState>) => {
        if (typeof value === 'function') {
            setState(prevState => {
                const newState = value(prevState);

                const gridData = newState.history[newState.history.length - newState.inx - 1].data;
                if (gridData) {
                    setGame(g => g ? new Game(g.level, JSON.parse(gridData), g.ticksPerBlock) : undefined);
                }

                return newState;
            })
        } else {
            const gridData = value.history[value.history.length - value.inx - 1].data;
            if (gridData) {
                setGame(g => g ? new Game(g.level, JSON.parse(gridData), g.ticksPerBlock) : undefined);
            }
            setState(value);
        }
    }, [setState, setGame]);

    const undoCtx = useMemo(() => new Undo(state, doUndo), [state, doUndo])

    const undoableSetGame: React.Dispatch<React.SetStateAction<Game | undefined>> = useCallback((value: React.SetStateAction<Game | undefined>) => {
        if (typeof value === 'function') {
            setGame(prevState => {
                const newState = value(prevState);
                if (newState === undefined) {
                    setState({ inx: 0, history: [] });
                } else {
                    undoCtx.push(JSON.stringify(newState.grid));
                }
                return newState;
            });
        } else if (value === undefined) {
            setState({ inx: 0, history: [] });
            setGame(value);
        } else {
            undoCtx.push(JSON.stringify(value.grid));
            setGame(value);
        }
    }, [setGame, setState, undoCtx]);

    const game = useContext(GameContext);
    useEffect(() => {
        //Reset undo state when switching levels
        setState({
            inx: 0,
            history: [{
                time: new Date(),
                data: JSON.stringify(game.grid)
            }]
        });
    }, [game.level, setState]);

    return (
        <GameSetterContext.Provider value={undoableSetGame}>
            <UndoContext.Provider value={undoCtx}>{children}</UndoContext.Provider>
        </GameSetterContext.Provider>
    );
}

function MainMenu({ setMode }: { setMode: (value: Mode) => void }) {
    const points = useMemo(() => getTotalPoints(), []);
    return (
        <Dialog>
            <div className={styles.titleBar}>
                <div className={styles.title}>Trainyard</div>
                <div className={styles.subTitle}>A puzzle solving game</div>
            </div>

            <DemoGame />

            <div className={styles.menuButtons}>
                <Row>
                    <Button buttonColor="green" onClick={() => setMode("Regular")}>Start</Button>
                    <Button buttonColor="blue" onClick={() => setMode("Bonus")} disabled={points < 425}>Bonus<br />Puzzles</Button>
                </Row>
                <Row>
                    <Button buttonColor="purple" onClick={() => setMode("Featured")} disabled={points < 200}>Featured<br />Puzzles</Button>
                    <Button buttonColor="yellow" onClick={() => setMode("Engineer")}>My Puzzles</Button>
                </Row>
            </div>
        </Dialog>
    )
}

function GameContents({ mode, setMode }: { mode: Mode, setMode: React.Dispatch<React.SetStateAction<Mode>> }) {
    const game = useContext(GameContext);
    const setGame = useContext(GameSetterContext);
    const [group, setGroup] = useState<string>();
    const level = useMemo(() => game?.level ? findLevelByName(game.level) : undefined, [game?.level]);
    const groups = useMemo(() => puzzleGroups.filter(g => g.mode === mode), [mode]);

    if (mode === "Engineer") {
        return <MyPuzzles setMode={setMode} />;
    }

    if (game === undefined || mode === "Regular" || mode === "Bonus" || mode === "Featured") {
        return <LevelSelect setMode={setMode} group={group} groups={groups} setGroup={setGroup} />;
    }

    const goBack = () => {
        setGame(undefined);
        const selectedGroup = puzzleGroups.find(g => g.name === group);
        setMode(selectedGroup ? selectedGroup.mode : "Engineer");
    };

    return (
        <>
            <Header>
                <Button onClick={goBack}>&#xab; Back</Button>

                <h1>{game.level} {level?.difficulty}&#x2605;</h1>
            </Header>

            <GameCanvas mode={mode} setMode={setMode} />

            {mode === "Complete" && <LevelComplete setMode={setMode} />}
        </>
    );
}

export default function GameSurface() {
    const [game, setGame] = useState<Game>();
    const [mode, setMode] = useState<Mode>("Menu");

    if (mode === "Menu") {
        return <MainMenu setMode={setMode} />;
    }

    return (
        <GameContext.Provider value={game ?? defaultGame}>
            <UndoContextProvider setGame={setGame}>
                <Dialog>
                    <GameContents mode={mode} setMode={setMode} />
                </Dialog>
            </UndoContextProvider>
        </GameContext.Provider>
    );
}