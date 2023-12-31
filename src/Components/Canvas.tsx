import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { GameCell, TrainDirection } from '../Game/Game';
import { detectEdge, getClosestEdge, getMotionLineSegment } from '../Utils/geometry';
import useTap from '../Utils/useTap';
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

    const [cellRef, setCellRef] = useState<HTMLElement | null>(null);
    const enterEdge = useRef<TrainDirection>();

    const isDragging = useRef<boolean>(false);
    const lastTarget = useRef<HTMLElement | null>(null);

    const tap = useTap();

    useEffect(() => {
        if (cellRef) {
            //For whatever reason React's onPointerLeave doesn't catch our manually dispatched events
            const pointerLeave = (e: PointerEvent) => {
                if (enterEdge.current && e.target instanceof HTMLElement && (e.buttons & 1) === 1) {
                    const { clientX, clientY, target } = e;
                    const rect = target.getBoundingClientRect();
                    const edge = getClosestEdge(rect, { x: clientX, y: clientY });
                    edge && onBuildEvent({ type: "mouseThrough", cell, enterEdge: enterEdge.current, exitEdge: edge });
                }

                enterEdge.current = undefined;
            }

            cellRef.addEventListener('pointerleave', pointerLeave);

            return () => {
                cellRef.removeEventListener('pointerleave', pointerLeave);
            }
        }
    }, [cell, cellRef, onBuildEvent, enterEdge]);

    function pointerDown(event: React.PointerEvent) {
        if (event.target instanceof HTMLElement) {
            isDragging.current = true;
            lastTarget.current = event.target;
        }
    };

    function pointerUp() {
        isDragging.current = false;
        lastTarget.current = null;
    };

    function pointerMove(e: React.PointerEvent) {
        if (!enterEdge.current && e.target instanceof HTMLElement && (e.buttons & 1) === 1) {
            //Detecting mouseEnter
            enterEdge.current = detectEdge(getMotionLineSegment(e.nativeEvent), e.target);

            if (!enterEdge.current && !isDragging.current) {
                //This works ok but isn't as accurate
                const rect = e.target.getBoundingClientRect();
                const { clientX, clientY, movementX, movementY } = e;
                enterEdge.current = getClosestEdge(rect, { x: clientX - movementX, y: clientY - movementY });
            }

            onBuildEvent({ type: "mouseEnter", cell });
        }

        if (e.pointerType === 'touch') {
            //PointerMove works weird w/ touch -- it never moves through an element other than the initial pointerDown target
            let newTarget = document.elementFromPoint(e.clientX, e.clientY)?.closest(`.${styles.cell}`);
            if (newTarget instanceof HTMLElement && newTarget !== e.target) {
                //Manually dispatch the pointermove event to the target under the pointer
                const newMove = new PointerEvent('pointermove', e.nativeEvent);
                newTarget.dispatchEvent(newMove);

                if (newTarget !== lastTarget.current) {
                    //Fire pointerleave when target changes
                    if (lastTarget.current) {
                        const newLeave = new PointerEvent('pointerleave', e.nativeEvent);
                        lastTarget.current.dispatchEvent(newLeave);
                    }
                    lastTarget.current = newTarget;
                }
            }
        }
    }

    function click(e: React.MouseEvent) {
        tap(e, {
            onSingleTap: () => onBuildEvent({ type: "click", cell }),
            onDoubleTap: () => onBuildEvent({ type: "dblclick", cell })
        });
    }

    return (
        <div
            className={`${styles.cell} ${selectedCell && cellCoordinate && selectedCell.col === cellCoordinate.col && selectedCell.row === cellCoordinate.row ? styles.selected : ''}`}
            onPointerDown={pointerDown}
            onPointerUp={pointerUp}
            onPointerMove={pointerMove}
            onClick={click}
            ref={setCellRef}>
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

export default function Canvas({ className, preview }: { className?: string, preview?: boolean }) {
    const game = useContext(GameContext);
    const { grid } = game;

    return (
        <div className={`${styles.wrapper} ${className ?? ''} ${preview ? styles.preview : ''}`}>
            <div className={styles.container}>
                {grid.map((r, i) => <Row key={i} row={r} />)}
            </div>
        </div>
    );
}