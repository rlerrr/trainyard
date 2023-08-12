import React from 'react';
import { TrainColor } from '../../Game/Game';

export type IconProps = {
    x: number;
    y: number;
    diameter: number;
    color: TrainColor | null;
}

type IconGridProps = {
    icons: ReadonlyArray<TrainColor | null>;
    Icon: React.ComponentType<IconProps>;
}

const getSize = (arr: ReadonlyArray<unknown>) => Math.ceil(Math.sqrt(arr.length));

export default function IconGrid({ icons, Icon }: IconGridProps) {
    const itemsPerRow = getSize(icons);
    const borderSize = 15;
    const gapSize = itemsPerRow === 1 ? 0 : 5;

    const iconSize = (90 - borderSize * 2 - gapSize * (itemsPerRow - 1)) / itemsPerRow;

    return (
        <>{
            icons.map((color, index) => <Icon
                key={index}
                x={borderSize + (index % itemsPerRow) * (iconSize + gapSize)}
                y={borderSize + Math.floor(index / itemsPerRow) * (iconSize + gapSize)}
                diameter={iconSize}
                color={color}
            />)
        }</>
    )
}
