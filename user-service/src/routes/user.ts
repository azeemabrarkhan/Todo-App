import express, { Response, Request } from "express";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import User from "../models/user.js";

const validateUserCredentials = (req: Request, res: Response) => {
  const { user_email, user_pwd } = req.body;

  if (!user_email || !user_pwd) {
    res.status(400).json({ message: "Email and password are required" });
    return false;
  }
  return true;
};

const handleError = (res: Response, err: unknown) => {
  if (err instanceof Error) {
    res.status(500).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Unknown error occurred" });
  }
};

const userRouter = express.Router();

userRouter.post("/sign-up", async (req, res) => {
  try {
    if (!validateUserCredentials(req, res)) return;

    const { user_email, user_pwd } = req.body;

    const existingUser = await User.findOne({ where: { user_email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(user_pwd, 10);
    await User.create({ user_email, user_pwd: hashedPassword });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    handleError(res, err);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    if (!validateUserCredentials(req, res)) return;

    const { user_email, user_pwd } = req.body;

    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ error: "Server configuration error: JWT_SECRET is not set" });
    }
    if (!process.env.JWT_EXPIRES_IN) {
      return res.status(500).json({
        error: "Server configuration error: JWT_EXPIRES_IN is not set",
      });
    }

    const user = await User.findOne({ where: { user_email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(user_pwd, user.user_pwd);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, uuid: user.uuid, user_email: user.user_email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
      }
    );

    res.status(200).json({
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
