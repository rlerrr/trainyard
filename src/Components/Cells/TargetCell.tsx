import { useContext, useMemo } from "react";
import { TargetGameCell } from "../../Game/Game";
import { GameStateContext } from "../GameContext";
import IconGrid, { IconProps } from "./IconGrid";
import IconSvg, { InArrowSvg } from "./IconSvg";
import { getIconColor } from "../TrainIcon";

function getRemainingTrains<T>(current: ReadonlyArray<T>, original: ReadonlyArray<T>): Array<T | null> {
    const needlesCopy = [...current];
    return original.map(element => {
        const inx = needlesCopy.indexOf(element);
        if (inx >= 0) {
            needlesCopy.splice(inx, 1);
            return element;
        }
        return null;
    });
}

function TargetIcon({ x, y, diameter, color }: IconProps) {
    if (!color)
        return null;

    const radius = diameter / 2;

    return <circle
        cx={x + radius}
        cy={y + radius}
        r={radius}
        fill={getIconColor(color)} />;
}

export default function TargetCell({ cell }: { cell: Readonly<TargetGameCell> }) {
    const gameState = useContext(GameStateContext);
    const targetState = gameState.targetState.get(cell) ?? cell.trains;
    const directions = Array.isArray(cell.direction) ? cell.direction : [cell.direction];

    //Don't shift icons around
    const remainingIcons = useMemo(() => getRemainingTrains(targetState, cell.trains), [targetState, cell.trains]);

    return (
        <IconSvg>
            <rect width="90" height="90" fill="white" />
            <rect x="10" y="10" width="70" height="70" stroke="white" fill="#333" rx="5" />
            {directions.map(d => <InArrowSvg key={d} direction={d} />)}
            <IconGrid icons={remainingIcons} Icon={TargetIcon} />
        </IconSvg>
    )
}
