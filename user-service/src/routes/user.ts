import express from "express";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { validateJwtConfig, validateUserCredentials } from "./../middlewares/validate.js";
import User from "../models/user.js";
import { HTTP_RESPONSE_CODES } from "../enums/http-response-codes.js";
import HttpError from "../httpError.js";

const userRouter = express.Router();

userRouter.post("/sign-up", validateJwtConfig, validateUserCredentials, async (req, res, next) => {
  try {
    const { user_email, user_pwd } = req.body;
    const trimedUserEmail = user_email.trim();

    const existingUser = await User.findOne({ where: { user_email: trimedUserEmail } });
    if (existingUser) {
      const error = new HttpError("Email already registered", HTTP_RESPONSE_CODES.CONFLICT);
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(user_pwd, 10);
    const user = await User.create({ user_email: trimedUserEmail, user_pwd: hashedPassword });
    res.status(HTTP_RESPONSE_CODES.CREATED).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        uuid: user.uuid,
        user_email: user.user_email,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

userRouter.post("/login", validateJwtConfig, validateUserCredentials, async (req, res, next) => {
  try {
    const { user_email, user_pwd } = req.body;
    const trimedUserEmail = user_email.trim();

    const user = await User.findOne({ where: { user_email: trimedUserEmail } });
    if (!user) {
      const error = new HttpError("Unauthorized: Invalid credentials", HTTP_RESPONSE_CODES.UNAUTHORIZED);
      return next(error);
    }

    const isMatch = await bcrypt.compare(user_pwd, user.user_pwd);
    if (!isMatch) {
      const error = new HttpError("Unauthorized: Invalid credentials", HTTP_RESPONSE_CODES.UNAUTHORIZED);
      return next(error);
    }

    // process.env.JWT_SECRET as string because it should already been checked by the middleware 'validateJwtConfig'
    const token = jwt.sign({ uuid: user.uuid, user_email: user.user_email }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    });

    res.status(HTTP_RESPONSE_CODES.OK).json({
      token,
      user: {
        id: user.id,
        uuid: user.uuid,
        user_email: user.user_email,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default userRouter;
