import Cell from "./Cell";
import styles from "./css/board.module.css";
import { CellProps } from "./Cell";

interface BoardProps {
    humanSetInitialColor: (color: string) => void;
    botSetInitialColor: (color: string) => void;
}

class Board {
    humanSetInitialColor: (color: string) => void;
    botSetInitialColor: (color: string) => void;
    board: Cell[][] = [];
    BOARD_WIDTH = 7;
    BOARD_HEIGHT = 6;
    COLORS = ["#d9c027", "#3f97d1", "#92b956", "#6a5293", "#d3324d", "#494949"];

    constructor(props: BoardProps) {
        this.humanSetInitialColor = props.humanSetInitialColor;
        this.botSetInitialColor = props.botSetInitialColor;
        this.board = this.createBoard();
    }

    createBoard() {
        let cells: Cell[][] = [];

        for (let i = 0; i <= this.BOARD_HEIGHT; i++) {
            cells[i] = [];
            for (let j = 0; j <= this.BOARD_WIDTH; j++) {
                let tempKey = `${i}${j}`;
                let availableColors = this.COLORS.filter((color) => {
                    // main cases
                    if (i > 0) {
                        if (cells[i - 1][j].getColor() === color) {
                            return false;
                        }
                    }
                    if (j > 0) {
                        if (cells[i][j - 1].getColor() === color) {
                            return false;
                        }
                    }

                    // edge cases
                    if (i === 1 && j === 7) {
                        if (cells[i - 1][j - 1].getColor() === color) {
                            return false;
                        }
                    }

                    if (i === 6 && j === 1) {
                        if (cells[i - 1][j - 1].getColor() === color) {
                            return false;
                        }
                    }

                    if (i === 6 && j === 0) {
                        if (cells[0][7].getColor() === color) {
                            return false;
                        }
                    }

                    return true;
                });

                let tempColor =
                    availableColors[
                        Math.floor(Math.random() * availableColors.length)
                    ];

                cells[i][j] = new Cell({
                    location: tempKey,
                    color: tempColor,
                    captured:
                        (i === 6 && j === 0) || (i === 0 && j === 7)
                            ? true
                            : false,
                    capturedBy:
                        (i === 6 && j === 0) || (i === 0 && j === 7)
                            ? i === 6
                                ? "human"
                                : "bot"
                            : undefined,
                });

                if (i === 0 && j === 7) {
                    console.log(tempColor);
                    this.botSetInitialColor(tempColor);
                }

                if (i === 6 && j === 0) {
                    console.log(tempColor);
                    this.humanSetInitialColor(tempColor);
                }
            }
        }

        console.log("board created");

        return cells;
    }

    changeCells(props: CellProps[]) {
        props.forEach((cell) => {
            this.board[Number(cell.location[0])][
                Number(cell.location[0])
            ].setColor(cell.color);
            this.board[Number(cell.location[0])][
                Number(cell.location[0])
            ].setCaptured(cell.captured as boolean);
            this.board[Number(cell.location[0])][
                Number(cell.location[0])
            ].setCapturedBy(cell.capturedBy as string);
        });
    }

    getJSON() {
        let boardJSON: {
            [rowIndex: number]: {
                [colIndex: number]: {
                    location: string;
                    color: string;
                    captured: boolean | undefined;
                    capturedBy: string | undefined;
                };
            }[];
        }[] = [];
        let rowIndex = 0;

        this.board.forEach((row) => {
            let tempRow: {
                [colIndex: number]: {
                    location: string;
                    color: string;
                    captured: boolean | undefined;
                    capturedBy: string | undefined;
                };
            }[] = [];

            let colCount = 0;

            row.forEach((cell) => {
                tempRow.push({ [colCount]: cell.getJSON() });
                colCount++;
            });
            boardJSON.push({ [rowIndex]: tempRow });
            rowIndex++;
        });

        return { board: boardJSON };
    }

    getView() {
        return (
            <div className={styles.board}>
                {this.board.map((row, rowIndex) => (
                    <div
                        key={rowIndex.toString()}
                        style={{ display: "flex", flexDirection: "row" }}
                    >
                        {row.map((cell, cellIndex) => (
                            <div key={cellIndex.toString()}>
                                {cell.getView()}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    }
}

export default Board;
