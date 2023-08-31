import _ from 'lodash';

export type TrainColor = "Red" | "Green" | "Blue" | "Yellow" | "Orange" | "Purple" | "Brown";
export type TrackDirection = "vertical" | "horizontal" | "top-right" | "bottom-right" | "bottom-left" | "top-left";
export type TrainDirection = "top" | "right" | "bottom" | "left";

export type Coordinate = {
    row: number;
    col: number;
}

export type Train = {
    color: TrainColor;

    /** The coordinate of the current block */
    position: Coordinate;

    /** The direction that the train entered the current block */
    entrance: TrainDirection;

    /** The direction that the train is heading */
    towards: TrainDirection | null;
}

export type EmptyGameCell = {
    readonly type: "Empty";
};

export type RockGameCell = {
    readonly type: "Rock";
}

export type TrackGameCell = {
    readonly type: "Track";
    readonly direction: TrackDirection;
}

export type IntersectionGameCell = {
    readonly type: "Intersection";
    readonly track1: TrackDirection;
    readonly track2: TrackDirection;
}

export type SourceGameCell = {
    readonly type: "Source";
    readonly trains: TrainColor[];
    readonly direction: TrainDirection;
}

export type TargetGameCell = {
    readonly type: "Target";
    readonly trains: TrainColor[];
    readonly direction: TrainDirection | TrainDirection[];
}

export type PaintGameCell = {
    readonly type: "Paint";
    readonly color: TrainColor;
    readonly direction: TrackDirection;
}

export type SplitterGameCell = {
    readonly type: "Splitter";
    readonly direction: TrainDirection;
}

export type GameCell = EmptyGameCell | RockGameCell | TrackGameCell | IntersectionGameCell | SourceGameCell | TargetGameCell | PaintGameCell | SplitterGameCell;

function createGrid(height: number, width: number) {
    const result: GameCell[][] = [];
    for (let i = 0; i < height; i++) {
        const row = [];
        for (let i = 0; i < width; i++) {
            const cell: EmptyGameCell = { type: "Empty" };
            row.push(cell);
        }
        result.push(row);
    }
    return result;
}

const frameTime = 1;

export type GameRunState = "Running" | "Crashed" | "Complete";

export class GameState {
    readonly state: GameRunState;
    readonly tick: number;
    readonly trains: ReadonlyArray<Readonly<Train>>;
    readonly intersectionState: ReadonlyMap<IntersectionGameCell, boolean>;
    readonly targetState: ReadonlyMap<TargetGameCell, ReadonlyArray<TrainColor>>;
    readonly sourceState: ReadonlyMap<SourceGameCell, ReadonlyArray<TrainColor>>;

    constructor(
        state: GameRunState,
        tick: number,
        trains?: ReadonlyArray<Train>,
        intersectionState?: ReadonlyMap<IntersectionGameCell, boolean>,
        targetState?: ReadonlyMap<TargetGameCell, ReadonlyArray<TrainColor>>,
        sourceState?: ReadonlyMap<SourceGameCell, ReadonlyArray<TrainColor>>
    ) {

        this.state = state;
        this.tick = tick;
        this.trains = trains ?? [];
        this.intersectionState = intersectionState ?? new Map();
        this.targetState = targetState ?? new Map();
        this.sourceState = sourceState ?? new Map();
    }
}

export class Game {
    readonly width: number;
    readonly height: number;

    readonly level: string;
    readonly grid: ReadonlyArray<ReadonlyArray<GameCell>>;
    ticksPerBlock: number;

    private state: GameState;
    private interval?: NodeJS.Timer;

    /** Callback when game state changes */
    onTick?: (state: GameState) => void;

    constructor(level: string, grid?: ReadonlyArray<ReadonlyArray<GameCell>>, ticksPerBlock?: number) {
        this.level = level;
        this.grid = grid ?? createGrid(7, 7);
        this.height = this.grid.length;
        this.width = this.grid[0].length;
        this.ticksPerBlock = ticksPerBlock ?? 500;

        //Start the simulation (sorta)
        this.state = new GameState("Running", 0);
    }

    private isNextFrame(thisTick: number): boolean {
        if (this.state.tick === 0) {
            //Always perform the first cycle on the first frame
            return true;
        }

        return thisTick - this.state.tick > this.ticksPerBlock;
    }

    start() {
        //Default targetState
        const targetState = this.getDefaultTrainState("Target");
        const sourceState = this.getDefaultTrainState("Source");

        this.state = new GameState("Running", 0, [], new Map(), targetState, sourceState);
        this.interval = setInterval(this.doTick.bind(this), frameTime);
    }

    private getDefaultTrainState(cellType: "Target" | "Source") {
        const result = new Map();
        this.grid.forEach(row => {
            row.forEach(cell => {
                if (cell.type === cellType) {
                    result.set(cell, cell.trains);
                }
            });
        });
        return result;
    }

    stop() {
        this.interval && clearInterval(this.interval);
        this.interval = undefined;
    }

    getCoordinate(source: Readonly<GameCell>): Coordinate | undefined {
        const row = this.grid.findIndex(r => r.includes(source));
        if (row < 0)
            return undefined;
        const col = this.grid[row].indexOf(source);
        if (col < 0)
            return undefined;
        return { row, col };
    }

    getCell(train: Train) {
        const cell = this.getCellAtCoordinate(train.position);
        if (cell === undefined)
            throw Error('train is at illegal coordinate!');

        return cell;
    }

    getCellAtCoordinate(coord: Coordinate) {
        if (coord.row < 0 || coord.row >= this.height || coord.col < 0 || coord.col >= this.width) {
            return undefined;
        }
        return this.grid[coord.row][coord.col];
    }

    doTick() {
        const thisTick = Date.now();
        if (!this.isNextFrame(thisTick)) {
            //Nothing to do yet
            return;
        }

        //Gotta do REAL shit!
        const intersectionState = this.updateIntersections();

        //Trains that cross should have their colors combined
        const trains: Train[] = this.state.trains.map(t => ({ ...t }));
        this.changeColors(trains);
        let { crashed, targetState } = this.moveTrains(trains, intersectionState);
        const { sourceState } = this.produceTrains(trains);

        if (trains.some(t => this.getCell(t).type === "Empty")) {
            crashed = true;
        }

        let newRunState = this.state.state;
        if (crashed) {
            newRunState = "Crashed";
        } else if (newRunState === "Running") {
            //Check for success
            if (trains.length === 0 && Array.from(targetState.values()).every(s => s.length === 0)) {
                newRunState = "Complete";
            }
        }

        const newState = new GameState(newRunState, thisTick, trains, intersectionState, targetState, sourceState);
        this.state = newState;
        this.onTick?.(newState);
    }

    private getTrackDirection(direction: TrackDirection, entrance: TrainDirection) {
        switch (direction) {
            case "horizontal":
                return entrance === "left" ? "right" : entrance === "right" ? "left" : null;
            case "vertical":
                return entrance === "top" ? "bottom" : entrance === "bottom" ? "top" : null;
            case "bottom-left":
                return entrance === "bottom" ? "left" : entrance === "left" ? "bottom" : null;
            case "bottom-right":
                return entrance === "bottom" ? "right" : entrance === "right" ? "bottom" : null;
            case "top-left":
                return entrance === "top" ? "left" : entrance === "left" ? "top" : null;
            case "top-right":
                return entrance === "top" ? "right" : entrance === "right" ? "top" : null;
        }
    }

    private getNewDirection(train: Readonly<Train>, newIntersectionState: ReadonlyMap<IntersectionGameCell, boolean>) {
        const cell = this.getCell(train);

        switch (cell.type) {
            case "Track":
            case "Paint":
                return this.getTrackDirection(cell.direction, train.entrance);
            case "Intersection":
                //State just flips the order checks are performed
                if (newIntersectionState.get(cell)) {
                    return this.getTrackDirection(cell.track1, train.entrance) ?? this.getTrackDirection(cell.track2, train.entrance);
                } else {
                    return this.getTrackDirection(cell.track2, train.entrance) ?? this.getTrackDirection(cell.track1, train.entrance);
                }
        }

        return null;
    }

    private moveTrains(trains: Train[], newIntersectionState: ReadonlyMap<IntersectionGameCell, boolean>) {
        const toRemove: Train[] = [];
        let crashed = false;
        const targetState = new Map(this.state.targetState);

        //Move trains to next tile
        for (const train of trains) {
            const newCoords = { ...train.position };
            const newDirection = train.towards;
            switch (newDirection) {
                case "bottom":
                    newCoords.row++;
                    break;
                case "top":
                    newCoords.row--;
                    break;
                case "left":
                    newCoords.col--;
                    break;
                case "right":
                    newCoords.col++;
                    break;
            }

            if (newCoords.row < 0 || newCoords.row >= this.height || newCoords.col < 0 || newCoords.col >= this.width) {
                //Hit the edge of the map
                toRemove.push(train);
                crashed = true;
            } else if (newDirection === null) {
                //Unreachable?
                toRemove.push(train);
            } else {
                train.position = newCoords;

                //We'll always "enter" from the opposite direction that we were exiting
                train.entrance = getOppositeDirection(newDirection);
                train.towards = this.getNewDirection(train, newIntersectionState);
            }
        }

        //Combine and remove overlapping trains
        const overlappingTrains = _.chain(trains)
            .groupBy(t => `${t.position.col}:${t.position.row}:${t.entrance}`)
            .values()
            .filter(t => t.length > 1)
            .value();

        for (const overlapped of overlappingTrains) {
            const target = overlapped[0];
            target.color = this.combineColors(overlapped.map(c => c.color));
            removeFrom(trains, overlapped.slice(1));
        }

        //Check exits make sense
        for (const train of trains) {
            const cell = this.getCell(train);
            if (train.towards === null) {
                if (cell.type === "Target") {
                    const cellState = targetState.get(cell);
                    if (cellState) {
                        //check for specific input directions!
                        if (cell.direction === train.entrance || (Array.isArray(cell.direction) && cell.direction.includes(train.entrance))) {
                            const inx = cellState.indexOf(train.color);
                            if (inx >= 0) {
                                const newState = [...cellState];
                                newState.splice(inx, 1);
                                targetState.set(cell, newState);
                            } else {
                                crashed = true;
                            }
                        } else {
                            crashed = true;
                        }
                    } else {
                        //Broken map??
                        crashed = true;
                    }
                } else if (cell.type === "Splitter") {
                    //check for specific input direction!
                    if (cell.direction === train.entrance) {
                        //Creating two new trains, still removing the original
                        this.split(trains, train, cell);
                    } else {
                        crashed = true;
                    }
                } else {
                    //Crashed
                    crashed = true;
                }

                toRemove.push(train);
            }
        }

        removeFrom(trains, toRemove);
        return { trains, crashed, targetState };
    }

    private split(trains: Train[], train: Train, cell: SplitterGameCell) {
        const position = this.getCoordinate(cell);
        if (!position) {
            throw new Error('Invalid Cell');
        }

        let newColors: TrainColor[];
        switch (train.color) {
            case "Purple":
                newColors = ["Red", "Blue"];
                break;
            case "Orange":
                newColors = ["Red", "Yellow"];
                break;
            case "Green":
                newColors = ["Yellow", "Blue"];
                break;
            default:
                newColors = [train.color, train.color];
                break;
        }

        let newDirections: TrainDirection[];
        switch (cell.direction) {
            case "top":
                newDirections = ["left", "right"];
                break;
            case "bottom":
                newDirections = ["right", "left"];
                break;
            case "left":
                newDirections = ["bottom", "top"];
                break;
            case "right":
                newDirections = ["top", "bottom"];
                break;
        }

        for (let i = 0; i <= 1; i++) {
            const newTrain: Train = {
                color: newColors[i],
                towards: newDirections[i],
                entrance: cell.direction,
                position
            }

            trains.push(newTrain);
        }
    }

    private changeColors(trains: Train[]) {
        //Check for Paint cells first
        for (const t of trains) {
            const cell = this.getCell(t);
            if (cell.type === "Paint") {
                t.color = cell.color;
            }
        }

        //Trains that crossed over each other may change color
        const crossedOnTrack = _.chain(trains)
            .groupBy(t => `${t.position.col}:${t.position.row}`)
            .values()
            .filter(t => {
                if (t.length < 2) {
                    return false;
                }

                //Check for pass by
                const [train1, train2] = t;
                if (train1.entrance === train2.towards && train2.entrance === train1.towards) {
                    return true;
                }

                //Check for cross intersection
                const cell = this.getCell(t[0]);
                if (cell.type === "Intersection") {
                    //Check for crossover
                    const { track1, track2 } = cell;
                    if ((track1 === "vertical" && track2 === "horizontal") || (track1 === "horizontal" && track2 === "vertical")) {
                        return true;
                    }
                }

                return false;
            })
            .value();

        const crossedOnEdge = _.chain(trains)
            .groupBy(getEdge)
            .values()
            .filter(t => t.length > 1)
            .value();

        for (const crossed of [...crossedOnTrack, ...crossedOnEdge]) {
            const newColor = this.combineColors(crossed.map(c => c.color));
            crossed.forEach(t => t.color = newColor);
        }
    }

    private combineColors(colors: TrainColor[]): TrainColor {
        let mixedColor: TrainColor | undefined = colors.pop();

        for (const color of colors) {
            // Perform color mixing based on the rules
            if (mixedColor === color) {
                // Yields the same color
            } else if ((mixedColor === "Red" && color === "Blue") || (mixedColor === "Blue" && color === "Red")) {
                mixedColor = "Purple";
            } else if ((mixedColor === "Red" && color === "Yellow") || (mixedColor === "Yellow" && color === "Red")) {
                mixedColor = "Orange";
            } else if ((mixedColor === "Blue" && color === "Yellow") || (mixedColor === "Yellow" && color === "Blue")) {
                mixedColor = "Green";
            } else {
                return "Brown"; // Mixing other colors always creates brown
            }
        }

        return mixedColor ?? "Brown";
    }

    private produceTrains(trains: Train[]) {
        const sources = this.grid.flatMap(r => r).filter((c): c is SourceGameCell => c.type === "Source");
        const sourceState = new Map(this.state.sourceState);

        for (const source of sources) {
            const sourceTrains = sourceState.get(source);
            if (sourceTrains && sourceTrains.length) {
                const newState = [...sourceTrains];

                //Produce a train!
                const newTrain: Train = {
                    color: newState.shift()!,
                    entrance: getOppositeDirection(source.direction),
                    towards: source.direction,
                    position: this.getCoordinate(source)!
                };

                trains.push(newTrain);
                sourceState.set(source, newState);
            }
        }

        return { sourceState };
    }

    private updateIntersections(): ReadonlyMap<IntersectionGameCell, boolean> {
        const toFlip: IntersectionGameCell[] = [];

        for (const train of this.state.trains) {
            const cell = this.getCell(train);
            if (cell.type === "Intersection") {
                toFlip.push(cell);
            }
        }

        if (toFlip.length) {
            const result = new Map(this.state.intersectionState);
            toFlip.forEach(f => result.set(f, !result.get(f)));
            return result;
        } else {
            return this.state.intersectionState;
        }
    }

    /** Attempt to draw track over the given cell, returning a new Game if anything changed */
    drawTrack(cell: Readonly<GameCell>, enterEdge: TrainDirection, exitEdge: TrainDirection): Game | undefined {
        if (enterEdge === exitEdge) {
            //no change!
            return undefined;
        }

        const direction = getDirection(enterEdge, exitEdge);
        let newCell: GameCell | undefined = undefined;
        switch (cell.type) {
            case "Empty":
                //Ez pz
                newCell = { type: "Track", direction };
                break;
            case "Intersection":
                if (cell.track1 === direction) {
                    //already the back layer, move to front
                    newCell = { ...cell, track2: cell.track1, track1: cell.track2 };
                } else if (cell.track2 === direction) {
                    //already the front layer, remove back layer
                    newCell = { type: "Track", direction: cell.track2 };
                } else {
                    //TODO: this should replace one of the tracks (but which?)
                }
                break;
            case "Track":
                if (cell.direction === direction) {
                    //Nothing
                } else {
                    //Convert to intersection
                    newCell = { type: "Intersection", track1: cell.direction, track2: direction };
                }
                break;
        }

        if (newCell) {
            //Replace cell and create new Game obj
            return this.replaceCell(cell, newCell);
        }
    }

    /** Replace the given cell, returning a new Game if anything changed */
    replaceCell(cell: Readonly<GameCell>, newCell: Readonly<GameCell>): Game | undefined {
        const coord = this.getCoordinate(cell);
        if (coord) {
            const newGrid = [...this.grid];
            const newRow = [...newGrid[coord.row]];
            newRow[coord.col] = newCell;
            newGrid[coord.row] = newRow;
            return new Game(this.level, newGrid, this.ticksPerBlock);
        }
        return undefined;
    }
}

function removeFrom(trains: Train[], toRemove: Train[]) {
    for (const removeMe of toRemove) {
        const inx = trains.indexOf(removeMe);
        inx > -1 && trains.splice(inx, 1);
    }
}

function getDirection(enterEdge: TrainDirection, exitEdge: TrainDirection): TrackDirection {
    if ((enterEdge === "top" && exitEdge === "bottom") || (enterEdge === "bottom" && exitEdge === "top")) {
        return "vertical";
    }

    if ((enterEdge === "left" && exitEdge === "right") || (enterEdge === "right" && exitEdge === "left")) {
        return "horizontal";
    }

    const corners: TrackDirection[] = ["bottom-left", "bottom-right", "top-left", "top-right"];
    const toCheck = `${enterEdge}-${exitEdge}`;
    if (corners.includes(toCheck as TrackDirection)) {
        return toCheck as TrackDirection;
    }

    const backwardsCheck = `${exitEdge}-${enterEdge}`;
    if (corners.includes(backwardsCheck as TrackDirection)) {
        return backwardsCheck as TrackDirection;
    }

    throw Error(`Unhandled direction '${enterEdge}-${exitEdge}'`);
}

function getOppositeDirection(direction: TrainDirection): TrainDirection {
    switch (direction) {
        case "bottom":
            return "top";
        case "top":
            return "bottom";
        case "left":
            return "right";
        case "right":
            return "left";
    }
}

function getEdge(t: Train): string {
    const position = { ...t.position };

    //Using half unit as the 'edge' between 2 coordinates
    //This overlaps when approacing the same edge from different directions
    switch (t.towards) {
        case 'top':
            position.row -= .5;
            break;
        case 'bottom':
            position.row += .5;
            break;
        case 'left':
            position.col -= .5;
            break;
        case 'right':
            position.col += .5;
            break;
    }

    return `${position.col}:${position.row}`;
}