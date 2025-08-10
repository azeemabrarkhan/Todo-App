import express, { Response, Request } from "express";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import User from "../models/user.js";
import { CONSTANTS } from "../constants.js";

const userRouter = express.Router();

const validateUserCredentials = (req: Request, res: Response) => {
  const { user_email, user_pwd } = req.body;

  if (!user_email || !user_pwd) {
    res
      .status(CONSTANTS.STATUS_CODES.BAD_REQUEST)
      .json({ message: "Email and password are required" });
    return false;
  } else if (!CONSTANTS.EMAIL_REGEX.test(user_email)) {
    res
      .status(CONSTANTS.STATUS_CODES.BAD_REQUEST)
      .json({ message: "Email address is not correctly formatted" });
    return false;
  } else if (user_pwd && user_pwd.length < CONSTANTS.MIN_PASSWORD_LENGTH) {
    res.status(CONSTANTS.STATUS_CODES.BAD_REQUEST).json({
      message: `Password should be at least ${CONSTANTS.MIN_PASSWORD_LENGTH} characters long`,
    });
    return false;
  }
  return true;
};

const handleError = (res: Response, err: unknown) => {
  if (err instanceof Error) {
    res.status(CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: err.message });
  } else {
    res
      .status(CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Unknown error occurred" });
  }
};

userRouter.post("/sign-up", async (req, res) => {
  try {
    if (!validateUserCredentials(req, res)) return;

    const { user_email, user_pwd } = req.body;

    const existingUser = await User.findOne({ where: { user_email } });
    if (existingUser)
      return res
        .status(CONSTANTS.STATUS_CODES.CONFLICT)
        .json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(user_pwd, 10);
    await User.create({ user_email, user_pwd: hashedPassword });
    res.status(CONSTANTS.STATUS_CODES.CREATED).json({ message: "User registered successfully" });
  } catch (err) {
    handleError(res, err);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    if (!validateUserCredentials(req, res)) return;

    const { user_email, user_pwd } = req.body;

    if (!process.env.JWT_SECRET) {
      // Log the config issue only on the server and send generic error message to the client
      console.error("JWT_SECRET environment variable is not set");
      return res
        .status(CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }

    if (!process.env.JWT_EXPIRES_IN) {
      // Log the config issue only on the server and send generic error message to the client
      console.error("JWT_EXPIRES_IN environment variable is not set");
      return res
        .status(CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }

    const user = await User.findOne({ where: { user_email } });
    if (!user)
      return res
        .status(CONSTANTS.STATUS_CODES.UNAUTHORIZED)
        .json({ message: "Unauthorized: Invalid credentials" });

    const isMatch = await bcrypt.compare(user_pwd, user.user_pwd);
    if (!isMatch)
      return res
        .status(CONSTANTS.STATUS_CODES.UNAUTHORIZED)
        .json({ message: "Unauthorized: Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, uuid: user.uuid, user_email: user.user_email },
      process.env.JWT_SECRET,
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
    handleError(res, err);
  }
});

export default userRouter;
