import React, { useContext, useMemo, useRef } from 'react';
import { GameCell, TrainDirection } from '../Game/Game';
import { detectEdge, getClosestEdge, getMotionLineSegment } from '../Utils/geometry';
import styles from './Canvas.module.scss';
import InterSectionCell from './Cells/IntersectionCell';
import PaintCell from './Cells/PaintCell';
import RockSvg from './Cells/RockSvg';
import SourceCell from './Cells/SourceCell';
import SplitterCell from './Cells/SplitterCell';
import TargetCell from './Cells/TargetCell';
import TrackCell from './Cells/TrackCell';
import GameContext, { BuildContext, GameStateContext } from './GameContext';
import { SelectedCellContext } from './LevelEditor';
import TrainIcon from './TrainIcon';

function CellContent({ cell }: { cell: Readonly<GameCell> }) {
    switch (cell.type) {
        case "Track":
            return <TrackCell cell={cell} />
        case "Intersection":
            return <InterSectionCell cell={cell} />;
        case "Source":
            return <SourceCell cell={cell} />;
        case "Target":
            return <TargetCell cell={cell} />;
        case "Rock":
            return <RockSvg />;
        case "Paint":
            return <PaintCell cell={cell} />;
        case "Splitter":
            return <SplitterCell cell={cell} />;
    }

    //Empty?
    return null;
}

function Cell({ cell }: { cell: Readonly<GameCell> }) {
    const game = useContext(GameContext);
    const onBuildEvent = useContext(BuildContext);
    const gameState = useContext(GameStateContext);
    const selectedCell = useContext(SelectedCellContext);
    const cellCoordinate = useMemo(() => game.getCoordinate(cell), [cell, game]);
    const trains = gameState.trains.filter(t => t.position.col === cellCoordinate?.col && t.position.row === cellCoordinate?.row);

    const enterEdge = useRef<TrainDirection>();

    //TODO: this doesn't work at all on mobile :(
    function mouseMove(e: React.MouseEvent) {
        if (!enterEdge.current && e.target instanceof HTMLElement && (e.buttons & 1) === 1) {
            //Detecting mouseEnter
            enterEdge.current = detectEdge(getMotionLineSegment(e.nativeEvent), e.target);

            //This works OK too but doesn't actually detect mouseEnter
            //enterEdge.current = getClosestEdge(rect, { x: clientX - movementX, y: clientY - movementY });
            onBuildEvent({ type: "mouseEnter", cell });
        }
    }

    function mouseLeave(e: React.MouseEvent) {
        if (enterEdge.current && e.target instanceof HTMLElement && (e.buttons & 1) === 1) {
            const { clientX, clientY, target } = e;
            const rect = target.getBoundingClientRect();
            const edge = getClosestEdge(rect, { x: clientX, y: clientY });

            edge && onBuildEvent({ type: "mouseThrough", cell, enterEdge: enterEdge.current, exitEdge: edge });
        }

        enterEdge.current = undefined;
    }

    function click(e: React.MouseEvent) {
        onBuildEvent({ type: "click", cell });
    }

    return (
        <div
            className={`${styles.cell} ${selectedCell && cellCoordinate && selectedCell.col === cellCoordinate.col && selectedCell.row === cellCoordinate.row ? styles.selected : ''}`}
            onMouseMove={mouseMove}
            onMouseLeave={mouseLeave}
            onClick={click}>
            <CellContent cell={cell} />
            {trains.map((t, i) => <TrainIcon key={i} train={t} />)}
        </div>
    );
}

function Row({ row }: { row: ReadonlyArray<GameCell> }) {
    return (
        <>
            {row.map((c, i) => <Cell key={i} cell={c} />)}
        </>
    );
}

export default function Canvas() {
    const game = useContext(GameContext);
    const { grid } = game;

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                {grid.map((r, i) => <Row key={i} row={r} />)}
            </div>
        </div>
    );
}