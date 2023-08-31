import { createContext } from "react";
import { Vcdiff } from "../Utils/vcdiff";

export type UndoStateItem = {
    readonly time: Date;
    data: string | undefined;
    delta?: (string | number)[];
}

export type UndoState = {
    readonly inx: number;
    readonly history: Readonly<UndoStateItem[]>;
}

export class Undo {
    readonly state: UndoState
    readonly setState: React.Dispatch<React.SetStateAction<UndoState>>

    constructor(state: UndoState, setState: React.Dispatch<React.SetStateAction<UndoState>>) {
        this.state = state;
        this.setState = setState;
    }

    get inx() {
        return this.state.inx;
    }

    get history() {
        return this.state.history;
    }

    get canRedo() : boolean {
        return this.inx > 0;
    }

    get canUndo(): boolean {
        return this.history.length > this.inx + 1;
    }

    push(val: string) {
        const lastHistory: UndoStateItem | undefined = this.history[this.history.length - this.inx - 1];
        const newHistory = this.history.slice(0);
        if (this.inx > 0) {
            //Destroy previous redo options
            newHistory.splice(this.history.length - this.inx);
        }

        if (lastHistory) {
            if (lastHistory.data === val) {
                //Pushing nothing
                return;
            }

            if (lastHistory.data) {
                //Convert last frame to diff
                var vcd = new Vcdiff();
                lastHistory.delta = vcd.encode(val, lastHistory.data);
                delete lastHistory.data;
            }
        }

        newHistory.push({
            time: new Date(),
            data: val
        });

        this.setState({
            inx: 0,
            history: newHistory
        });
    }

    undo() {
        if (this.canUndo) {
            const state = this.history[this.history.length - this.inx - 2];
            if (state.delta && !state.data) {
                var vcd = new Vcdiff();
                var nextHistory = this.history[this.history.length - this.inx - 1];
                if (nextHistory.data === undefined) {
                    throw Error('Unexpected undo state without data');
                }
                state.data = vcd.decode(nextHistory.data, state.delta);
            }

            this.setState(current => ({ ...current, inx: current.inx + 1 }));

            return state.data;
        }
    }

    redo() {
        if (this.canRedo) {
            const lastHistory = this.history[this.history.length - this.inx - 1];
            const data = lastHistory.data;
            if (lastHistory.delta) {
                delete lastHistory.data;
            }
            this.setState(current => ({ ...current, inx: current.inx - 1 }));
            return data;
        }
    }
}

const defaultUndo = new Undo({ inx: 0, history: [] }, () => { });
export const UndoContext = createContext<Undo>(defaultUndo);