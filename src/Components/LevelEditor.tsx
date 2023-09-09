import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Coordinate, GameCell, PaintGameCell, SourceGameCell, SplitterGameCell, TargetGameCell, TrackDirection, TrainColor, TrainDirection } from '../Game/Game';
import { UndoContext } from '../Game/Undo';
import Button, { ButtonColumn } from './Button';
import Canvas from './Canvas';
import PaintCell, { getDirections } from './Cells/PaintCell';
import RockSvg from './Cells/RockSvg';
import SourceCell from './Cells/SourceCell';
import SplitterCell from './Cells/SplitterCell';
import TargetCell from './Cells/TargetCell';
import { Footer, Header, Modal } from './Dialog';
import GameContext, { BuildContext, CellEvent, GameSetterContext } from './GameContext';
import styles from './LevelEditor.module.scss';

export const SelectedCellContext = createContext<Coordinate | undefined>(undefined);

function DirectionEditor({ directions, children, onClick }: { directions: TrainDirection[], children: React.ReactNode, onClick: (d: TrainDirection) => void }) {
    const maybeSelected = (direction: TrainDirection) => directions.includes(direction) ? styles.selected : '';

    return (
        <div className={styles.directions}>
            <div>
                <Button className={`${styles.arrow} ${styles.up} ${maybeSelected('top')}`} onClick={() => onClick('top')} />
            </div>

            <div>
                <Button className={`${styles.arrow} ${styles.left} ${maybeSelected('left')}`} onClick={() => onClick('left')} />
                <div> {children}</div>
                <Button className={`${styles.arrow} ${styles.right} ${maybeSelected('right')}`} onClick={() => onClick('right')} />
            </div>

            <div>
                <Button className={`${styles.arrow} ${styles.down} ${maybeSelected('bottom')}`} onClick={() => onClick('bottom')} />
            </div>
        </div>
    );
}

function ColorEditor({ selected, onClick }: { selected?: TrainColor, onClick: (color: TrainColor) => void }) {
    const maybeSelected = (color: TrainColor) => !selected || selected === color ? styles.selected : '';

    return (
        <div className={styles.hexagonContainer}>
            <div className={styles.hexagonRow}>
                <Button className={`${styles.hexagonButton} ${styles.red} ${maybeSelected('Red')}`} onClick={() => onClick('Red')} />
                <Button className={`${styles.hexagonButton} ${styles.orange} ${maybeSelected('Orange')}`} onClick={() => onClick('Orange')} />
            </div>
            <div className={styles.hexagonRow}>
                <Button className={`${styles.hexagonButton} ${styles.purple} ${maybeSelected('Purple')}`} onClick={() => onClick('Purple')} />
                <Button className={`${styles.hexagonButton} ${styles.brown} ${maybeSelected('Brown')}`} onClick={() => onClick('Brown')} />
                <Button className={`${styles.hexagonButton} ${styles.yellow} ${maybeSelected('Yellow')}`} onClick={() => onClick('Yellow')} />
            </div>
            <div className={styles.hexagonRow}>
                <Button className={`${styles.hexagonButton} ${styles.blue} ${maybeSelected('Blue')}`} onClick={() => onClick('Blue')} />
                <Button className={`${styles.hexagonButton} ${styles.green} ${maybeSelected('Green')}`} onClick={() => onClick('Green')} />
            </div>
        </div>
    );
}

function SourceEditor({ cell }: { cell: Readonly<SourceGameCell> }) {
    const game = useContext(GameContext);
    const setGame = useContext(GameSetterContext);

    const onClick = (d: TrainDirection) => {
        const newGame = game.replaceCell(cell, { ...cell, direction: d });
        newGame && setGame(newGame);
    }

    const addColor = (c: TrainColor) => {
        if (cell.trains.length < 16) {
            const newGame = game.replaceCell(cell, { ...cell, trains: [...cell.trains, c] });
            newGame && setGame(newGame);
        }
    }

    const onRemove = () => {
        if (cell.trains.length > 0) {
            const newGame = game.replaceCell(cell, { ...cell, trains: cell.trains.slice(0, -1) });
            newGame && setGame(newGame);
        }
    };

    return (
        <>
            <DirectionEditor directions={[cell.direction]} onClick={onClick}>
                <SourceCell cell={cell} />
            </DirectionEditor>

            <div>
                <Button onClick={onRemove}>Remove Train</Button>
            </div>

            <ColorEditor onClick={addColor} />
        </>
    );
}

function newDirection(lastEdge: TrainDirection, newEdge: TrainDirection): TrackDirection | undefined {
    switch (`${lastEdge}-${newEdge}`) {
        case 'bottom-left':
        case 'left-bottom':
            return 'bottom-left';
        case 'bottom-right':
        case 'right-bottom':
            return 'bottom-right';
        case 'top-left':
        case 'left-top':
            return 'top-left';
        case 'top-right':
        case 'right-top':
            return 'top-right';
        case 'bottom-top':
        case 'top-bottom':
            return 'vertical';
        case 'left-right':
        case 'right-left':
            return 'horizontal';

    }
}

function PaintEditor({ cell }: { cell: Readonly<PaintGameCell> }) {
    const game = useContext(GameContext);
    const setGame = useContext(GameSetterContext);

    //TODO: this fucks up when switching cells
    const [lastEdge, setLastEdge] = useState<TrainDirection>(pickEdge(cell.direction));

    function pickEdge(direction: TrackDirection): TrainDirection {
        switch (direction) {
            case 'horizontal':
            case 'bottom-right':
                return 'right';
            case 'top-right':
            case 'vertical':
                return 'top';
            default:
                return 'bottom';
        }
    }

    const changeDirection = (d: TrainDirection) => {
        if (getDirections(cell.direction).includes(d)) {
            //No change
            return;
        }

        const newEdge = newDirection(lastEdge, d);
        if (newEdge) {
            setLastEdge(d);
            const newGame = game.replaceCell(cell, { ...cell, direction: newEdge });
            newGame && setGame(newGame);
        }
    }

    const changeColor = (c: TrainColor) => {
        const newGame = game.replaceCell(cell, { ...cell, color: c });
        newGame && setGame(newGame);
    }

    return (
        <>
            <DirectionEditor directions={getDirections(cell.direction)} onClick={changeDirection}>
                <PaintCell cell={cell} />
            </DirectionEditor>

            <ColorEditor selected={cell.color} onClick={changeColor} />
        </>
    );
}

function TargetEditor({ cell }: { cell: Readonly<TargetGameCell> }) {
    const game = useContext(GameContext);
    const setGame = useContext(GameSetterContext);
    const directions = Array.isArray(cell.direction) ? cell.direction : [cell.direction];

    const changeDirection = (d: TrainDirection) => {
        if (directions.includes(d)) {
            if (directions.length > 1) {
                const newGame = game.replaceCell(cell, { ...cell, direction: directions.filter(direction => direction !== d) });
                newGame && setGame(newGame);
            }
        } else {
            const newGame = game.replaceCell(cell, { ...cell, direction: [...directions, d] });
            newGame && setGame(newGame);
        }
    }

    const addColor = (c: TrainColor) => {
        if (cell.trains.length < 16) {
            const newGame = game.replaceCell(cell, { ...cell, trains: [...cell.trains, c] });
            newGame && setGame(newGame);
        }
    }

    const onRemove = () => {
        if (cell.trains.length > 0) {
            const newGame = game.replaceCell(cell, { ...cell, trains: cell.trains.slice(0, -1) });
            newGame && setGame(newGame);
        }
    };

    return (
        <>
            <DirectionEditor directions={directions} onClick={changeDirection}>
                <TargetCell cell={cell} />
            </DirectionEditor>

            <div>
                <Button onClick={onRemove}>Remove Train</Button>
            </div>

            <ColorEditor onClick={addColor} />
        </>
    );
}

function SplitterEditor({ cell }: { cell: Readonly<SplitterGameCell> }) {
    const game = useContext(GameContext);
    const setGame = useContext(GameSetterContext);

    const onClick = (d: TrainDirection) => {
        const newGame = game.replaceCell(cell, { ...cell, direction: d });
        newGame && setGame(newGame);
    }

    return (
        <DirectionEditor directions={[cell.direction]} onClick={onClick}>
            <SplitterCell cell={cell} />
        </DirectionEditor>
    );
}

function CellEditor({ cell }: { cell: GameCell }) {
    switch (cell?.type) {
        case 'Source':
            return <SourceEditor cell={cell} />;
        case 'Splitter':
            return <SplitterEditor cell={cell} />;
        case 'Target':
            return <TargetEditor cell={cell} />;
        case 'Paint':
            return <PaintEditor cell={cell} />;
    }

    return null;
}

function CellEditorDialog({ setShowEditor }: { setShowEditor: React.Dispatch<React.SetStateAction<boolean>> }) {
    const game = useContext(GameContext);
    const selectedCell = useContext(SelectedCellContext);
    const cell = selectedCell ? game.getCellAtCoordinate(selectedCell) : undefined;

    useEffect(() => {
        if (!cell || cell.type === 'Empty' || cell.type === 'Rock') {
            //Auto close dialog when selecting a cell w/ no props
            setShowEditor(false);
        }
    }, [cell, setShowEditor])

    if (!cell || cell.type === 'Empty' || cell.type === 'Rock')
        return null;

    return (
        <Modal>
            <Header><Button onClick={() => setShowEditor(false)}>Close</Button></Header>
            <CellEditor cell={cell} />
        </Modal>
    );
}

function Toolbar({ selectedCell, setShowEditor }: { selectedCell: Coordinate | undefined, setShowEditor: React.Dispatch<React.SetStateAction<boolean>> }) {
    const setGame = useContext(GameSetterContext);

    const undoCtx = useContext(UndoContext);
    const doUndo = useMemo(() => undoCtx.undo.bind(undoCtx), [undoCtx]);
    const doRedo = useMemo(() => undoCtx.redo.bind(undoCtx), [undoCtx]);

    const replaceCell = (newType: GameCell["type"]) => {
        if (!selectedCell)
            return;

        setGame(game => {
            if (!game)
                return game;

            const cell = game.getCellAtCoordinate(selectedCell);
            if (!cell)
                return game;

            switch (newType) {
                case 'Empty':
                case 'Rock':
                    return game.replaceCell(cell, { type: newType });
                case 'Source':
                case 'Target':
                    return game.replaceCell(cell, { type: newType, direction: "top", trains: [] });
                case 'Splitter':
                    return game.replaceCell(cell, { type: newType, direction: "top" });
                case 'Paint':
                    return game.replaceCell(cell, { type: newType, direction: "top-right", color: "Yellow" });
            }
            return game;
        });
    };

    return (
        <Footer className={styles.editor}>
            <ButtonColumn>
                <Button disabled={!undoCtx.canUndo} onClick={doUndo}>Undo</Button>
                <Button disabled={!undoCtx.canRedo} onClick={doRedo}>Redo</Button>
            </ButtonColumn>
            <ButtonColumn>
                <Button onClick={() => replaceCell('Empty')} className={styles.emptyIcon} title="Empty tile">❌</Button>
                <Button onClick={() => replaceCell('Rock')} className={styles.icon}><RockSvg /></Button>
            </ButtonColumn>
            <ButtonColumn>
                <Button onClick={() => replaceCell('Source')} className={styles.icon}><SourceCell cell={{ type: "Source", trains: [], direction: "top" }} /></Button>
                <Button onClick={() => replaceCell('Target')} className={styles.icon}><TargetCell cell={{ type: "Target", trains: [], direction: "top" }} /></Button>
            </ButtonColumn>
            <ButtonColumn>
                <Button onClick={() => replaceCell('Paint')} className={styles.icon}><PaintCell cell={{ type: "Paint", color: "Yellow", direction: "vertical" }} /></Button>
                <Button onClick={() => replaceCell('Splitter')} className={styles.icon}><SplitterCell cell={{ type: "Splitter", direction: "top" }} /></Button>
            </ButtonColumn>
            <ButtonColumn>
                <Button onClick={() => setShowEditor(current => !current)}>Edit<br />Piece</Button>
            </ButtonColumn>
        </Footer>
    );
}

export default function LevelEditor() {
    const game = useContext(GameContext);
    const [selectedCell, setSelectedCell] = useState<Coordinate>();
    const [showEditor, setShowEditor] = useState(false);

    const onCellEvent = useCallback((e: CellEvent) => {
        if (e.type === "click") {
            setSelectedCell(game.getCoordinate(e.cell));
        }
    }, [game, setSelectedCell]);

    useEffect(() => {
        //Allow changing cells w/ arrow keys
        const handleArrows = (event: KeyboardEvent) => {
            setSelectedCell(cell => {
                if (!cell)
                    return cell;

                const newCell = { ...cell };
                if (event.key === "ArrowUp") {
                    newCell.row > 0 && newCell.row--;
                } else if (event.key === "ArrowDown") {
                    newCell.row < game.height - 1 && newCell.row++;
                } else if (event.key === "ArrowLeft") {
                    newCell.col > 0 && newCell.col--;
                } else if (event.key === "ArrowRight") {
                    newCell.col < game.width - 1 && newCell.col++;
                }

                return newCell;
            });
        };

        document.addEventListener("keydown", handleArrows);
        return () => {
            document.removeEventListener("keydown", handleArrows);
        };
    }, [game, setSelectedCell]);

    return (
        <BuildContext.Provider value={onCellEvent}>
            <SelectedCellContext.Provider value={selectedCell}>
                <Canvas />

                <Toolbar selectedCell={selectedCell} setShowEditor={setShowEditor} />

                {showEditor && <CellEditorDialog setShowEditor={setShowEditor} />}
            </SelectedCellContext.Provider>
        </BuildContext.Provider>
    );
}