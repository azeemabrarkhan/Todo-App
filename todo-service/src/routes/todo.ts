import express from "express";
import Todo from "../models/todo.js";
import { HTTP_RESPONSE_CODES } from "../enums/http-response-codes.js";
import { validateJwtConfig } from "../middlewares/validate.js";
import { authenticateJWT, CustomRequest } from "../middlewares/auth.js";

const todoRouter = express.Router();

todoRouter.get("/", validateJwtConfig, authenticateJWT, async (req, res, next) => {
  try {
    const { user_uuid } = req as CustomRequest;

    const todos = await Todo.findAll({ where: { user_uuid } });
    res.status(HTTP_RESPONSE_CODES.OK).json({ todos });
  } catch (err) {
    next(err);
  }
});

todoRouter.post("/", validateJwtConfig, authenticateJWT, async (req, res, next) => {
  try {
    const { user_uuid } = req as CustomRequest;
    const { content } = req.body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(HTTP_RESPONSE_CODES.BAD_REQUEST).json({ message: "Content is required" });
    }

    const todo = await Todo.create({ content: content.trim(), user_uuid });
    res.status(HTTP_RESPONSE_CODES.CREATED).json({
      message: "Todo created successfully",
      todo,
    });
  } catch (err) {
    next(err);
  }
});

export default todoRouter;
