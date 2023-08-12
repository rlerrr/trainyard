import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Game, GameState } from '../Game/Game';
import { saveSolution } from '../Game/Storage';
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
                            <Button onClick={() => setMode("Build")}>Back to the drawing board!</Button>
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

function BuildMode({ setMode }: { setMode: (value: Mode) => void }) {
    const game = useContext(GameContext);
    const setGame = useContext(GameSetterContext);
    const onCellEvent = useCallback((e: CellEvent) => {
        if (e.type === "mouseThrough") {
            const newGame = game?.drawTrack(e.cell, e.enterEdge, e.exitEdge);
            newGame && setGame(newGame);
        }
    }, [game, setGame]);

    return (
        <BuildContext.Provider value={onCellEvent}>
            <Canvas />

            <Footer>
                <ButtonColumn>
                    <Button buttonColor="yellow" onClick={() => setMode("Erase")}>Erase</Button>
                    <Button disabled>Undo</Button>
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
    const game = useContext(GameContext);
    const setGame = useContext(GameSetterContext);
    const onCellEvent = useCallback((e: CellEvent) => {
        if (e.type === "mouseEnter" || e.type === "click") {
            if (e.cell.type === "Intersection" || e.cell.type === "Track") {
                const newGame = game?.replaceCell(e.cell, { type: "Empty" });
                newGame && setGame(newGame);
            }
        }
    }, [game, setGame]);

    return (
        <BuildContext.Provider value={onCellEvent}>
            <div className={styles.erasing}>
                <Canvas />
            </div>

            <Footer>
                <ButtonColumn>
                    <Button buttonColor="yellow" onClick={() => setMode("Build")}>Stop Erasing</Button>
                    <Button disabled>Undo</Button>
                </ButtonColumn>
                <ButtonColumn>
                    <Button onClick={() => setMode("Run")} buttonColor="green">Start the trains!</Button>
                    <Speed />
                </ButtonColumn>
            </Footer>
        </BuildContext.Provider>
    );
}

export default function GameSurface() {
    const [game, setGame] = useState<Game>();
    const [mode, setMode] = useState<Mode>("Build");

    if (mode === "LevelSelect" || game === undefined) {
        return (
            <GameContext.Provider value={game ?? defaultGame}>
                <GameSetterContext.Provider value={setGame}>
                    <Dialog>
                        <LevelSelect setMode={setMode} />
                    </Dialog>
                </GameSetterContext.Provider>
            </GameContext.Provider>
        );
    }

    return (
        <GameContext.Provider value={game}>
            <GameSetterContext.Provider value={setGame}>
                <Dialog>
                    <Header>
                        <Button onClick={() => setMode("LevelSelect")}>&#xab; Back</Button>

                        <h1>{game.level}</h1>
                    </Header>

                    <GameCanvas mode={mode} setMode={setMode} />

                    {mode === "Complete" && <LevelComplete setMode={setMode} />}
                </Dialog>
            </GameSetterContext.Provider>
        </GameContext.Provider>
    );
}
