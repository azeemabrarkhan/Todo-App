import { Response, Request, NextFunction } from "express";
import { CONSTANTS } from "../constants.js";
import HttpError from "../httpError.js";

export const validateUserCredentials = (req: Request, res: Response, next: NextFunction) => {
  const { user_email, user_pwd } = req.body;

  if (!user_email || !user_pwd) {
    return next(new HttpError("Email and password are required", CONSTANTS.STATUS_CODES.BAD_REQUEST));
  }
  if (!CONSTANTS.EMAIL_REGEX.test(user_email)) {
    return next(new HttpError("Email address is not correctly formatted", CONSTANTS.STATUS_CODES.BAD_REQUEST));
  }
  if (user_pwd && user_pwd.length < CONSTANTS.MIN_PASSWORD_LENGTH) {
    return next(
      new HttpError(
        `Password should be at least ${CONSTANTS.MIN_PASSWORD_LENGTH} characters long`,
        CONSTANTS.STATUS_CODES.BAD_REQUEST
      )
    );
  }

  next();
};

export const validateJwtConfig = (req: Request, res: Response, next: NextFunction) => {
  if (!process.env.JWT_SECRET) {
    // Only Log the config issue. Send generic error message to the client
    console.error("JWT_SECRET environment variable is not set");
    return next(new HttpError("Internal server error", CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR));
  }
  if (!process.env.JWT_EXPIRES_IN) {
    // Only Log the config issue. Send generic error message to the client
    console.error("JWT_EXPIRES_IN environment variable is not set");
    return next(new HttpError("Internal server error", CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR));
  }

  next();
};
