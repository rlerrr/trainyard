import { useContext, useMemo } from "react";
import { SourceGameCell } from "../../Game/Game";
import { GameStateContext } from "../GameContext";
import IconGrid, { IconProps } from "./IconGrid";
import IconSvg, { OutArrowSvg } from "./IconSvg";
import { getIconColor } from "../TrainIcon";

function getRemainingTrains<T>(current: ReadonlyArray<T>, original: ReadonlyArray<T>): Array<T | null> {
    //Trains are consumed from the start, but we don't want them to shift around
    const offset = original.length - current.length;
    return [...Array(offset), ...current];
}

export function PlusIcon({ x, y, diameter, color }: IconProps) {
    if (!color)
        return null;

    const sizeDiff = diameter * .25;

    return (
        <>
            <rect
                x={sizeDiff + x}
                y={y}
                width={diameter - sizeDiff * 2}
                height={diameter}
                fill={getIconColor(color)}
            />
            <rect
                x={x}
                y={sizeDiff + y}
                width={diameter}
                height={diameter - sizeDiff * 2}
                fill={getIconColor(color)}
            />
        </>
    );
}

export default function SourceCell({ cell }: { cell: Readonly<SourceGameCell> }) {
    const { direction } = cell;
    const gameState = useContext(GameStateContext);
    const sourceState = gameState.sourceState.get(cell) ?? cell.trains;

    //Don't shift icons around
    const remainingIcons = useMemo(() => getRemainingTrains(sourceState, cell.trains), [sourceState, cell.trains]);

    return (
        <IconSvg>
            <OutArrowSvg direction={direction} />
            <rect x="10" y="10" width="70" height="70" stroke="white" fill="#333" rx="5" />
            <IconGrid icons={remainingIcons} Icon={PlusIcon} />
        </IconSvg>
    )
}