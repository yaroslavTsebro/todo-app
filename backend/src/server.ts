import "reflect-metadata";
import {createServer, Server as HttpServer} from "http";
import express, {Application} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {config} from "./config/config";
import logger from "./config/logger";
import {mainRouter} from "./route/index.route";
import {errorHandlerMiddleware} from "./middleware/errorHandler.middleware";

export class Server {
  private PORT: number = config.server.port;
  private readonly app: Application;
  private readonly httpServer: HttpServer;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    logger.info(`Configured server variables`);

    this.configureServer();
    logger.info(`Configured app settings`);
  }

  private configureServer() {
    const corsOptions = {
      origin: '*',
    };
    this.app.use(cors(corsOptions));
    this.app.use(cookieParser());
    this.app.use(express.json());

    this.app.use("/api", mainRouter);
    this.app.use(errorHandlerMiddleware);
  }

  public async start() {
    this.httpServer.listen(this.PORT, () => {
      const startUpMessage = `Server is working on ${this.PORT}`;
      logger.info(startUpMessage);
      logger.info(startUpMessage);
    });
  }
}