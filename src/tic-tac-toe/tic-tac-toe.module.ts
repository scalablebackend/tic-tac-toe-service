import { Router, Express } from "express";
import { TicTacToeController } from "./tic-tac-toe.controller";
import { queryValidator } from "../common/middlewares/query-validator.middleware";
import { query } from "../common/extractors/query";
import { PlayDTO } from "./dto/play.dto";
import { JumpToDTO } from "./dto/jump-to.dto";

export class TicTacToeModule {
  constructor(private controller: TicTacToeController) {}

  get routes() {
    const router = Router();

    router.post("/initialize", (_, res) => {
      this.controller.handleInitialize(res);
    });

    router.post("/play", queryValidator(PlayDTO), async (req, res, next) => {
      const step = parseInt(query<PlayDTO>(req, "step"));
      const square = parseInt(query<PlayDTO>(req, "square"));
      await this.controller.handlePlay(res, next, step, square);
    });

    router.post("/jump-to", queryValidator(JumpToDTO), (req, res, next) => {
      const step = parseInt(query<JumpToDTO>(req, "step"));
      this.controller.handleJumpTo(res, next, step);
    });

    return router;
  }

  configure(app: Express) {
    app.use("/tic-tac-toe", this.routes);
  }
}
