import { Response, Request, NextFunction } from "express";
import { HTTP_RESPONSE_CODES } from "../enums/http-response-codes.js";

export const handleError = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || HTTP_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
  const message = err.message || "Unknown error occurred";
  res.status(statusCode).json({ message });
};
