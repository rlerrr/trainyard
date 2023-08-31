import { useContext, useEffect, useState } from "react";
import { Game, GameState, Train, TrainColor } from "../Game/Game";
import { getPointOnStar } from "../Utils/geometry";
import GameContext, { GameStateContext } from "./GameContext";
import styles from './TrainIcon.module.scss';

function getTrainCoordinates(train: Train, percent: number) {
    const offset = 33 / 2;

    //Straight tracks
    switch (`${train.entrance}-${train.towards}`) {
        case "right-left":
            return {
                top: `33%`,
                left: `${(1 - percent) * 100 - offset}%`
            };
        case "left-right":
            return {
                top: `33%`,
                left: `${percent * 100 - offset}%`
            };
        case "top-bottom":
            return {
                top: `${percent * 100 - offset}%`,
                left: `33%`
            };
        case "bottom-top":
            return {
                top: `${(1 - percent) * 100 - offset}%`,
                left: `33%`
            };
    }

    //Corner tracks
    let angle = null;
    switch (`${train.entrance}-${train.towards}`) {
        case "top-right":
            angle = 0 + percent * 90;
            break;
        case "right-bottom":
            angle = 90 + percent * 90;
            break;
        case "bottom-left":
            angle = 180 + percent * 90;
            break;
        case "left-top":
            angle = 270 + percent * 90;
            break;
        case "top-left":
            angle = 0 - percent * 90;
            break;
        case "left-bottom":
            angle = 270 - percent * 90;
            break;
        case "bottom-right":
            angle = 180 - percent * 90;
            break;
        case "right-top":
            angle = 90 - percent * 90;
            break;
    }

    const point = getPointOnStar(angle ?? 0);
    return {
        top: `${(1 - point.y) * 100 - offset}%`,
        left: `${point.x * 100 - offset}%`
    };
}

function getCyclePercent(game: Game, gameState: GameState): number {
    //TODO: if game speed is decreased quickly this can actually move backwards
    const ticksThisCycle = Date.now() - gameState.tick;
    return ticksThisCycle / game.ticksPerBlock;
}

function TrainSvg({ ...props }: React.SVGProps<SVGSVGElement>) {
    //From https://www.svgrepo.com/svg/18302/train
    return (
        <svg fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 288.618 288.618" {...props} className={styles.train}>
            <g>
                <path d="M287.985,215.049l-9.848-24.938c-1.365-3.458-4.706-5.73-8.424-5.73h-33.89c4.387,0,8.465-2.258,10.794-5.976
                c16.747-26.736,16.747-60.691,0-87.428c-2.329-3.719-6.407-5.977-10.795-5.977h-11.347V53.66h5.851
                c3.616,0,6.548-2.932,6.548-6.548V39.94c0-3.616-2.932-6.548-6.548-6.548h-48.184c-3.616,0-6.548,2.932-6.548,6.548v7.172
                c0,3.616,2.932,6.548,6.548,6.548h5.851v31.342h-38.869V29.45c0-5.003-4.055-9.058-9.057-9.058H9.057
                C4.055,20.392,0,24.447,0,29.45v13.875c0,5.002,4.055,9.057,9.057,9.057h10.101v132H9.057c-5.002,0-9.057,4.055-9.057,9.057v24.938
                c0,5.003,4.055,9.058,9.057,9.058h19.682v-0.001c0-30.765,25.028-55.793,55.793-55.793c30.765,0,55.794,25.028,55.794,55.793v0.001
                h26.992c5.183-17.839,21.663-30.919,41.151-30.919c19.488,0,35.969,13.08,41.152,30.919h29.939c2.999,0,5.803-1.483,7.489-3.963
                C288.736,220.991,289.086,217.838,287.985,215.049z M116.777,136.744c0,4.705-3.814,8.52-8.52,8.52H57.782
                c-4.705,0-8.52-3.814-8.52-8.52V94.139c0-18.645,15.113-33.758,33.757-33.758c18.645,0,33.758,15.113,33.758,33.758V136.744z"/>
                <path d="M208.469,210.514c-15.34,0-27.877,11.971-28.796,27.079c-5.911,0-49.787,0-55.624,0c0.833-3.248,1.276-6.653,1.276-10.161
                c0-22.529-18.264-40.793-40.794-40.793c-22.529,0-40.793,18.264-40.793,40.793c0,22.53,18.264,40.794,40.793,40.794
                c13.033,0,24.63-6.119,32.098-15.633c23.751,0,41.245,0,66.195,0c4.796,9.283,14.476,15.633,25.645,15.633
                c15.938,0,28.856-12.919,28.856-28.856C237.325,223.433,224.406,210.514,208.469,210.514z"/>
            </g>
        </svg>
    );
}

export default function TrainIcon({ train }: { train: Train }) {
    const game = useContext(GameContext);
    const gameState = useContext(GameStateContext);
    const percent = getCyclePercent(game, gameState);
    const coordinates = getTrainCoordinates(train, percent);
    const [, setTick] = useState(0);

    useEffect(() => {
        //Want to rerender every browser frame to update the position
        const interval = setInterval(() => setTick(c => (c + 1) % 1000000), 1);

        return () => clearInterval(interval);
    }, []);

    const color = getIconColor(train.color);
    return <TrainSvg style={{ ...coordinates, color: color }} data-path={`${train.entrance}-${train.towards}`} />;
}

export function getIconColor(trainColor: TrainColor) {
    switch (trainColor) {
        case "Red":
            return "red";
        case "Orange":
            return "darkorange";
        case "Yellow":
            return "yellow";
        case "Green":
            return "lime";
        case "Blue":
            return "#1B51CC";
        case "Purple":
            return "blueviolet";
        case "Brown":
            return "saddlebrown";
        default:
            return trainColor;
    }
}
