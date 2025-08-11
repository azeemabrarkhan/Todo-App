import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HTTP_RESPONSE_CODES } from "../enums/http-response-codes.js";

interface JwtPayload {
  uuid: string;
  user_email: string;
}

export interface CustomRequest extends Request {
  user_uuid: string;
  user_email: string;
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(HTTP_RESPONSE_CODES.UNAUTHORIZED).json({ message: "Access denied. No token provided" });

  try {
    // process.env.JWT_SECRET as string because it should already been checked by the middleware 'validateJwtConfig'
    const { uuid, user_email } = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    const customReq = req as CustomRequest;
    customReq.user_uuid = uuid;
    customReq.user_email = user_email;
    next();
  } catch (ex) {
    res.status(HTTP_RESPONSE_CODES.UNAUTHORIZED).json({ message: "Missing or invalid token" });
  }
};
