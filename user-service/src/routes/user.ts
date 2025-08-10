import express from "express";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { validateJwtConfig, validateUserCredentials } from "./../middlewares/validate.js";
import User from "../models/user.js";
import { CONSTANTS } from "../constants.js";

const userRouter = express.Router();

userRouter.post("/sign-up", validateJwtConfig, validateUserCredentials, async (req, res, next) => {
  try {
    const { user_email, user_pwd } = req.body;

    const existingUser = await User.findOne({ where: { user_email } });
    if (existingUser) return res.status(CONSTANTS.STATUS_CODES.CONFLICT).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(user_pwd, 10);
    await User.create({ user_email, user_pwd: hashedPassword });
    res.status(CONSTANTS.STATUS_CODES.CREATED).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
});

userRouter.post("/login", validateJwtConfig, validateUserCredentials, async (req, res, next) => {
  try {
    const { user_email, user_pwd } = req.body;

    const user = await User.findOne({ where: { user_email } });
    if (!user)
      return res.status(CONSTANTS.STATUS_CODES.UNAUTHORIZED).json({ message: "Unauthorized: Invalid credentials" });

    const isMatch = await bcrypt.compare(user_pwd, user.user_pwd);
    if (!isMatch)
      return res.status(CONSTANTS.STATUS_CODES.UNAUTHORIZED).json({ message: "Unauthorized: Invalid credentials" });

    // process.env.JWT_SECRET as string because it has been checked by the middleware 'validateJwtConfig'
    const token = jwt.sign(
      { id: user.id, uuid: user.uuid, user_email: user.user_email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
      }
    );

    res.status(CONSTANTS.STATUS_CODES.OK).json({
      token,
      user: {
        id: user.id,
        uuid: user.uuid,
        user_email: user.user_email,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default userRouter;
