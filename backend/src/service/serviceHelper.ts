import {validateSync} from "class-validator";
import {AppError} from "../model/error/AppError";
import {ErrorMessages} from "../constant/ErrorMessages";
import {ErrorCodes} from "../constant/ErrorCodes";
import logger from "../config/logger";

export class ServiceHelper {
  public static validateInput<T extends object>(dto: T): void {
    const errors = validateSync(dto, {enableDebugMessages: false});
    if (errors.length > 0) {
      throw new AppError(
          ErrorCodes.VALIDATION_ERROR,
          ErrorMessages.VALIDATION_ERROR, errors.map(e => {
            if (e.constraints) {
              return e.constraints;
            }
          }))
    }
    logger.info("Validated successfully");
  }

  public static validateId(id: number): void {
    if (id <= 0) {
      throw new AppError(
          ErrorCodes.BAD_REQUEST,
          ErrorMessages.BAD_REQUEST,
          []);
    }
    logger.info("Validated successfully")
  }

  public static validateIds(ids: number[]): void {
    ids.map(id => this.validateId(id));
  }
}

