import { Request, Response, NextFunction } from "express";
import { HTTP_RESPONSE_CODES } from "../enums/http-response-codes.js";
import HttpError from "../httpError.js";

export const validateJwtConfig = (req: Request, res: Response, next: NextFunction) => {
  if (!process.env.JWT_SECRET) {
    // Only Log the config issue. Send generic error message to the client
    console.error("JWT_SECRET environment variable is not set");
    return next(new HttpError("Internal server error", HTTP_RESPONSE_CODES.INTERNAL_SERVER_ERROR));
  }

  next();
};
