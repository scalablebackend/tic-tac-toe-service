import { Response, NextFunction } from "express";
import { BoardService } from "./board.service";
import { BadRequestException } from "../common/exceptions/bad-request.exception";
import { KafkaService } from "../common/services/kafka.service";

export class TicTacToeController {
  constructor(
    private boardService: BoardService,
    private kafkaService: KafkaService
  ) {}

  handleInitialize(res: Response) {
    const history = this.boardService.findHistory();

    if (history.length > 0) {
      const board = history[history.length - 1];

      res.status(201).json({
        moves: this.getMoves([board]),
        status: this.getStatus(this.getWinner(board), this.xIsNext(board)),
        squares: board,
      });
    }

    const board = this.getInitialBoard();
    this.boardService.setHistory([board]);

    res.status(201).json({
      moves: this.getMoves([board]),
      status: this.getStatus(this.getWinner(board), this.xIsNext(board)),
      squares: board,
    });
  }

  async handlePlay(
    res: Response,
    next: NextFunction,
    step: number,
    square: number
  ) {
    try {
      const history = this.boardService.findHistory();
      const currentBoard = history[step];

      if (!currentBoard) {
        return next(
          new BadRequestException({
            error: "step does not exist",
          })
        );
      }

      const xIsNext = this.xIsNext(currentBoard);
      const currentWinner = this.getWinner(currentBoard);

      if (currentWinner) {
        res.status(201).json({
          moves: this.getMoves([currentBoard]),
          status: this.getStatus(currentWinner, xIsNext),
          squares: currentBoard,
        });
      }

      if (currentBoard[square]) {
        new BadRequestException({
          error: "cell already taken",
        });
      }

      const board = [...currentBoard];

      if (xIsNext) {
        board[square] = "X";
      } else {
        board[square] = "O";
      }

      this.boardService.setHistory([...history.slice(0, step + 1), board]);
      const winner = this.getWinner(board);

      if (winner) {
        await this.kafkaService.send("game.end", { winner, board });
      }

      res.status(201).json({
        history: [...history.slice(0, step + 1), board],
        winner,
        xIsNext: this.xIsNext(board),
        step: step + 1,
      });
    } catch (e) {
      next(e);
    }
  }

  handleJumpTo(res: Response, next: NextFunction, step: number) {
    try {
      const history = this.boardService.findHistory();
      const board = history[step];

      if (!board) {
        return next(
          new BadRequestException({
            error: "step does not exist",
          })
        );
      }

      res.status(201).json({
        moves: this.getMoves([board]),
        status: this.getStatus(this.getWinner(board), this.xIsNext(board)),
        squares: board,
      });
    } catch (e) {
      next(e);
    }
  }

  private getWinner(squares: string[]) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }

    if (squares.every((square) => !!square)) return "draw";

    return null;
  }

  private getStep(squares: string[]) {
    return squares.filter((square) => !!square).length;
  }

  private xIsNext(squares: string[]) {
    return this.getStep(squares) % 2 === 0;
  }

  private getInitialBoard() {
    return ["", "", "", "", "", "", "", "", ""];
  }

  private getMoves(history: string[][]) {
    const moves = history.map((_, move: number) => {
      return {
        move,
        description: move > 0 ? "Go to move #" + move : "Go to game start",
      };
    });

    return moves;
  }

  private getStatus(winner: string | null, xIsNext: boolean) {
    const status = winner
      ? winner === "draw"
        ? "Draw"
        : "Winner: " + winner
      : "Next player: " + (xIsNext ? "X" : "O");

    return status;
  }
}
