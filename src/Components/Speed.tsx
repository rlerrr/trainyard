import { useCallback, useContext } from "react";
import ReactSlider from "react-slider";
import GameContext from "./GameContext";
import styles from "./Speed.module.scss";

function renderThumb(props: React.HTMLProps<HTMLDivElement>) {
    return (
        <div {...props} className={styles.thumb}>
            Speed
        </div>
    );
}

export function Speed() {
    //TODO: this should probably be non-linear?
    const game = useContext(GameContext);

    const onChange = useCallback((value: number) => {
        game.ticksPerBlock = 10000 - value;
    }, [game]);

    return <ReactSlider min={9000} max={9950} defaultValue={10000 - game.ticksPerBlock} onChange={onChange} renderThumb={renderThumb} className={styles.slider} />;
}
