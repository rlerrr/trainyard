import { SplitterGameCell, TrainDirection } from "../../Game/Game";
import IconSvg, { InArrowSvg, OutArrowSvg } from "./IconSvg";

function getOutDirections(direction: TrainDirection): TrainDirection[] {
    if (direction === "top" || direction === "bottom") {
        return ["left", "right"];
    } else {
        return ["top", "bottom"];
    }
}

function getAngle(direction: TrainDirection): number {
    switch (direction) {
        case "top": return 0;
        case "left": return 270;
        case "right": return 90;
        default: return 180;
    }
}

function SplitterBorder() {
    return (
        <>
            <defs>
                <clipPath id="clip-bottom-half">
                    <polygon points="0,0 0,33 45,15 90,33 90,0" />
                </clipPath>

                <clipPath id="clip-right-half">
                    <polygon points="0,15 45,33 45,90 0,90" />
                </clipPath>
                
                <clipPath id="clip-left-half">
                    <polygon points="90,15 45,33 45,90 90,90" />
                </clipPath>
            </defs>

            <rect x="12" y="12" width="65" height="65" fill="transparent" stroke="yellow" strokeWidth="3" rx="5" clipPath="url(#clip-bottom-half)" />
            <rect x="12" y="12" width="65" height="65" fill="transparent" stroke="red" strokeWidth="3" rx="5" clipPath="url(#clip-right-half)" />
            <rect x="12" y="12" width="65" height="65" fill="transparent" stroke="blue" strokeWidth="3" rx="5" clipPath="url(#clip-left-half)" />
        </>
    )
}

export default function SplitterCell({ cell }: { cell: Readonly<SplitterGameCell> }) {
    //From https://freesvg.org/scissors-icon-vector-image
    const { direction } = cell;
    const outDirections = getOutDirections(direction);
    const angle = getAngle(direction);

    return (
        <IconSvg>

            <InArrowSvg direction={direction} />
            {outDirections.map(d => <OutArrowSvg key={d} direction={d} />)}

            <g transform={`rotate(${angle},45,45)`}>
                <SplitterBorder />

                <g transform="translate(20,20),scale(0.13)" fill="white">
                    <path d="M 223.66778 189.869258 C 263.783912 134.576465 272.434048 94.124891 286.027117 97.99505 C 296.636342 101.02387 291.542709 110.11033 319.602903 116.538159 C 346.547923 122.69676 374.095741 100.586374 379.822311 73.86545 C 387.417552 47.716637 375.090355 14.837113 347.452119 6.692952 C 320.11528 -3.201193 287.534109 12.885206 277.79894 40.144587 C 263.693493 71.274126 256.45993 112.365118 210.918627 147.667699 L 175.956408 174.758811 L 54.944935 345.584262 C 41.412145 367.660995 33.274387 397.074203 50.815777 425.040308 Z M 353.480087 86.754762 C 330.181988 110.009369 288.950682 95.807569 289.010962 64.77899 C 287.35327 36.240774 322.07437 10.226576 347.874077 26.514897 C 369.604904 37.957106 369.424065 70.83663 353.480087 86.754762 Z M 353.480087 86.754762 " />
                    <path d="M 161.850961 191.383668 C 121.855388 135.989915 113.265533 95.53834 99.672463 99.374846 C 89.063238 102.370012 94.126732 111.490126 66.066537 117.816994 C 39.091377 123.908288 11.60384 101.730595 5.937549 75.043325 C -1.597412 48.860858 10.820204 15.981334 38.458441 7.938134 C 65.825419 -1.888705 98.37645 14.265002 108.05134 41.524383 C 122.066367 72.687576 129.20951 113.812221 174.690534 149.182109 L 209.592473 176.340528 L 330.212128 347.468861 C 343.714778 369.579248 351.762116 398.992456 334.160448 426.924907 L 161.850961 191.350014 Z M 32.249633 87.96629 C 55.517592 111.288205 96.779038 97.187365 96.748898 66.158786 C 98.46687 37.586917 63.836189 11.505411 38.006343 27.760078 C 16.245376 39.13498 16.335795 72.014505 32.249633 87.96629 Z M 32.249633 87.96629 " />
                </g>
            </g>
        </IconSvg>
    );
}