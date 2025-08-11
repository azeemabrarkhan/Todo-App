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

todoRouter.put("/", validateJwtConfig, authenticateJWT, async (req, res, next) => {
  try {
    const { user_uuid } = req as CustomRequest;
    const { uuid, content } = req.body;

    if (!uuid || typeof uuid !== "string") {
      return res.status(HTTP_RESPONSE_CODES.BAD_REQUEST).json({ message: "Todo uuid is required" });
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(HTTP_RESPONSE_CODES.BAD_REQUEST).json({ message: "Content is required" });
    }

    // Find the todo by uuid and user_uuid to ensure ownership
    const todo = await Todo.findOne({ where: { uuid, user_uuid } });

    if (!todo) {
      return res.status(HTTP_RESPONSE_CODES.NOT_FOUND).json({ message: "Todo not found" });
    }

    // Update the todo content
    todo.content = content.trim();
    await todo.save();

    res.status(HTTP_RESPONSE_CODES.OK).json({
      message: "Todo updated successfully",
      todo,
    });
  } catch (err) {
    next(err);
  }
});

todoRouter.delete("/", validateJwtConfig, authenticateJWT, async (req, res, next) => {
  try {
    const { user_uuid } = req as CustomRequest;
    const { uuid } = req.body;

    if (!uuid || typeof uuid !== "string") {
      return res.status(HTTP_RESPONSE_CODES.BAD_REQUEST).json({ message: "Todo uuid is required" });
    }

    console.log({ uuid, user_uuid });
    const deletedCount = await Todo.destroy({ where: { uuid, user_uuid } });

    if (deletedCount === 0) {
      return res.status(HTTP_RESPONSE_CODES.NOT_FOUND).json({ message: "Todo not found" });
    }

    res.status(HTTP_RESPONSE_CODES.OK).json({ message: "Todo deleted successfully" });
  } catch (err) {
    next(err);
  }
});

export default todoRouter;
