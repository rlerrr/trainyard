import { useContext } from "react";
import { GameStateContext } from "./GameContext";
import styles from "./Status.module.scss";

export default function Status() {
    const { state } = useContext(GameStateContext);

    switch (state) {
        case "Running":
        case "Complete":
            return (
                <div className={`${styles.status} ${styles.good}`}>
                    <div>Status:</div>
                    <div className={styles.good}>GOOD</div>
                </div>
            );
        case "Crashed":
            return (
                <div className={`${styles.status} ${styles.crashed}`}>
                    <div>Status:</div>
                    <div className={styles.crashed}>CRASHED!</div>
                </div>
            );
    }

    return null;
}
