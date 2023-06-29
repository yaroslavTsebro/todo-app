import winston from 'winston';
import {config} from "./config";

const logger = winston.createLogger({
  level: config.logger.level,
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({filename: 'logs.log'})
  ]
});

export default logger;
