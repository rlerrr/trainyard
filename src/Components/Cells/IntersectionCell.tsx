import { useContext } from "react";
import { IntersectionGameCell } from "../../Game/Game";
import { GameStateContext } from "../GameContext";
import IconSvg from "./IconSvg";
import { TrackSvg } from "./TrackCell";

function isDoubleTrack(cell: IntersectionGameCell) {
    const { track1, track2 } = cell;
    if ((track1 === "bottom-left" && track2 === "top-right") || (track1 === "top-right" && track2 === "bottom-left")) {
        return true;
    }
    if ((track1 === "bottom-right" && track2 === "top-left") || (track1 === "top-left" && track2 === "bottom-right")) {
        return true;
    }
    return false;
}

export default function IntersectionCell({ cell }: { cell: Readonly<IntersectionGameCell> }) {
    const gameState = useContext(GameStateContext);

    if (isDoubleTrack(cell)) {
        //Not visually an intersection
        return (
            <IconSvg>
                <TrackSvg direction={cell.track1} />
                <TrackSvg direction={cell.track2} />
            </IconSvg>
        );
    } else if (gameState.intersectionState.get(cell)) {
        //Track1 on top
        return (
            <IconSvg>
                <TrackSvg direction={cell.track2} color="#777" />
                <TrackSvg direction={cell.track1} />
            </IconSvg>
        );
    } else {
        //Track2 on top
        return (
            <IconSvg>
                <TrackSvg direction={cell.track1} color="#777" />
                <TrackSvg direction={cell.track2} />
            </IconSvg>
        );
    }
}