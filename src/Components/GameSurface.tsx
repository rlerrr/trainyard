import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Game, GameState } from '../Game/Game';
import { findLevelByName } from '../Game/Levels';
import { saveSolution } from '../Game/Storage';
import { Undo, UndoContext, UndoState } from '../Game/Undo';
import Button, { ButtonColumn } from './Button';
import Canvas from './Canvas';
import Dialog, { Footer, Header } from './Dialog';
import GameContext, { BuildContext, CellEvent, defaultGame, defaultGameState, GameSetterContext, GameStateContext } from './GameContext';
import styles from './GameSurface.module.scss';
import LevelComplete from './LevelComplete';
import LevelEditor from './LevelEditor';
import LevelSelect from './LevelSelect';
import { Speed } from './Speed';
import Status from './Status';

export type Mode = "Build" | "Erase" | "Run" | "Complete" | "LevelSelect" | "Editor";

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

export default function GameSurface() {
    const [game, setGame] = useState<Game>();
    const level = useMemo(() => game?.level ? findLevelByName(game.level) : undefined, [game?.level]);
    const [mode, setMode] = useState<Mode>("Build");

    if (mode === "LevelSelect" || game === undefined || level === undefined) {
        return (
            <GameContext.Provider value={game ?? defaultGame}>
                <UndoContextProvider setGame={setGame}>
                    <Dialog>
                        <LevelSelect setMode={setMode} />
                    </Dialog>
                </UndoContextProvider>
            </GameContext.Provider>
        );
    }

    return (
        <GameContext.Provider value={game}>
            <UndoContextProvider setGame={setGame}>
                <Dialog>
                    <Header>
                        <Button onClick={() => setMode("LevelSelect")}>&#xab; Back</Button>

                        <h1>{game.level} {level.difficulty}&#x2605;</h1>
                    </Header>

                    <GameCanvas mode={mode} setMode={setMode} />

                    {mode === "Complete" && <LevelComplete setMode={setMode} />}
                </Dialog>
            </UndoContextProvider>
        </GameContext.Provider>
    );
}
