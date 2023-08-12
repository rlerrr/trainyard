import { createContext } from "react";
import { Game, GameCell, GameState, TrainDirection } from "../Game/Game";

export const defaultGame = new Game('');
export const defaultGameState = new GameState("Running", 0);
const GameContext = createContext(defaultGame);
export const GameStateContext = createContext(defaultGameState);
export default GameContext;

type CellMouseThroughEvent = {
    type: "mouseThrough";
    cell: GameCell;
    enterEdge: TrainDirection;
    exitEdge: TrainDirection;
};

type CellClickEvent = {
    type: "click";
    cell: GameCell;
}

type CellMouseEnterEvent = {
    type: "mouseEnter";
    cell: GameCell;
}

export type CellEvent = CellMouseThroughEvent | CellClickEvent | CellMouseEnterEvent;

export type CellEventHandler = (e: CellEvent) => void;

export const GameSetterContext = createContext((game: Game) => { });

export const BuildContext = createContext<CellEventHandler>(() => { });