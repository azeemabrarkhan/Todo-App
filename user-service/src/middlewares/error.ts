import { Response, Request, NextFunction } from "express";
import { CONSTANTS } from "../constants.js";

export const handleError = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR;
  const message = err.message || "Unknown error occurred";
  res.status(statusCode).json({ message });
};
