import { describe, it, expect, beforeAll } from "vitest";
import supertest from "supertest";
import { CONSTANTS } from "../constants.js";
import { HTTP_RESPONSE_CODES } from "../enums/http-response-codes.js";
import { nanoid } from "nanoid";

describe("", () => {
  type Todo = { uuid: "string"; content: "string"; user_uuid: "string" };

  let token: string;
  let user: { uuid: "string"; user_email: "string" };

  const INCORRECT_TODO_UUID = "e1861c14-ecbe-47c8-b20d-4af73da50d7d";
  const INVALID_AUTH_TOKEN = "INVALID_AUTH_TOKEN";
  const SERVER = `http://localhost:${CONSTANTS.API_PORT}/api/todo`;
  const ROOT = "/";
  const todoContent = "Buy clothes";

  const getTodos = async (token: string) => {
    const res = await supertest(SERVER).get(ROOT).set("Authorization", `Bearer ${token}`);
    return { todos: res.body.todos, status: res.status, message: res.body.message };
  };

  const postTodo = async (content: string, token: string) => {
    const res = await supertest(SERVER).post(ROOT).set("Authorization", `Bearer ${token}`).send({ content });
    return { todo: res.body.todo, status: res.status, message: res.body.message };
  };

  const patchTodo = async (newContent: string, token: string, todoUuid: string) => {
    const res = await supertest(SERVER)
      .patch(ROOT)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: newContent, uuid: todoUuid });
    return { todo: res.body.todo, status: res.status, message: res.body.message };
  };

  const deleteTodo = async (token: string, todoUuid: string) => {
    const res = await supertest(SERVER).delete(ROOT).set("Authorization", `Bearer ${token}`).send({ uuid: todoUuid });
    return { status: res.status, message: res.body.message };
  };

  // register and login a user to get a token
  beforeAll(async () => {
    const USER_SERVICE_PORT = 4000;
    const USER_SERVER = `http://localhost:${USER_SERVICE_PORT}/api/user`;
    const SIGN_UP = "/sign-up";
    const LOGIN = "/login";
    const VALID_USER_EMAIL = `test${nanoid()}@gmail.com`;
    const VALID_USER_PASSWORD = [...Array(CONSTANTS.MIN_PASSWORD_LENGTH).keys()].join("");

    await supertest(USER_SERVER).post(SIGN_UP).send({ user_email: VALID_USER_EMAIL, user_pwd: VALID_USER_PASSWORD });
    const res = await supertest(USER_SERVER)
      .post(LOGIN)
      .send({ user_email: VALID_USER_EMAIL, user_pwd: VALID_USER_PASSWORD });

    token = res.body.token;
    user = res.body.user;
  });

  describe("GET", () => {
    it("should handle good req", async () => {
      const { todos, status } = await getTodos(token);
      expect(Array.isArray(todos)).toBe(true);
      expect(status).toBe(HTTP_RESPONSE_CODES.OK);
    });

    it("should handle unauthorized req", async () => {
      const { todos, status, message } = await getTodos(INVALID_AUTH_TOKEN);
      expect(Array.isArray(todos)).toBe(false);
      expect(status).toBe(HTTP_RESPONSE_CODES.UNAUTHORIZED);
      expect(message).toBe("Missing or invalid token");
    });
  });

  describe("POST", () => {
    it("should handle good req", async () => {
      const { message, todo, status } = await postTodo(todoContent, token);
      expect(status).toBe(HTTP_RESPONSE_CODES.CREATED);
      expect(message).toBe("Todo created successfully");
      expect(todo).toBeTypeOf("object");

      const { uuid, content, user_uuid } = todo;
      expect(uuid).toBeTypeOf("string");
      expect(user_uuid).toBeTypeOf("string");
      expect(user_uuid).toBe(user.uuid);
      expect(content).toBe(todoContent);

      const { todos } = await getTodos(token);
      const foundedTodo = todos.find(
        (t: Todo) => t.uuid === uuid && t.content === content && t.user_uuid === user_uuid
      );
      expect(foundedTodo).toBeDefined();
    });

    it("should handle unauthorized req", async () => {
      const { message, todo, status } = await postTodo(todoContent, INVALID_AUTH_TOKEN);
      expect(status).toBe(HTTP_RESPONSE_CODES.UNAUTHORIZED);
      expect(message).toBe("Missing or invalid token");
      expect(todo).not.toBeTypeOf("object");
    });

    it("should handle req when content is missing", async () => {
      const { message, todo, status } = await postTodo("", token);
      expect(status).toBe(HTTP_RESPONSE_CODES.BAD_REQUEST);
      expect(message).toBe("Content is required");
      expect(todo).not.toBeTypeOf("object");
    });
  });

  describe("PATCH", () => {
    it("should handle good req", async () => {
      const { todo: postedTodo } = await postTodo(todoContent, token);

      const NEW_TODO_CONTENT = "Iron clothers";
      const { message, todo, status } = await patchTodo(NEW_TODO_CONTENT, token, postedTodo.uuid);

      expect(message).toBe("Todo updated successfully");
      expect(status).toBe(HTTP_RESPONSE_CODES.OK);

      // only content should be updated
      const { uuid, content, user_uuid } = todo;
      expect(uuid).toBe(postedTodo.uuid);
      expect(user_uuid).toBe(postedTodo.user_uuid);
      expect(content).toBe(NEW_TODO_CONTENT);
    });

    it("should handle unauthorized req", async () => {
      const { todo: postedTodo } = await postTodo(todoContent, token);

      const NEW_TODO_CONTENT = "Iron clothers";
      const { message, todo, status } = await patchTodo(NEW_TODO_CONTENT, INVALID_AUTH_TOKEN, postedTodo.uuid);

      expect(todo).toBe(undefined);
      expect(message).toBe("Missing or invalid token");
      expect(status).toBe(HTTP_RESPONSE_CODES.UNAUTHORIZED);
    });

    it("should handle req when content is missing", async () => {
      const { todo: postedTodo } = await postTodo(todoContent, token);

      const { message, todo, status } = await patchTodo("", token, postedTodo.uuid);

      expect(todo).toBe(undefined);
      expect(message).toBe("Content is required");
      expect(status).toBe(HTTP_RESPONSE_CODES.BAD_REQUEST);
    });

    it("should handle req when token-uuid is missing", async () => {
      await postTodo(todoContent, token);

      const NEW_TODO_CONTENT = "Iron clothers";
      const { message, todo, status } = await patchTodo(NEW_TODO_CONTENT, token, "");

      expect(todo).toBe(undefined);
      expect(message).toBe("Todo uuid is required");
      expect(status).toBe(HTTP_RESPONSE_CODES.BAD_REQUEST);
    });

    it("should handle req when todo is not found in the DB", async () => {
      await postTodo(todoContent, token);

      const NEW_TODO_CONTENT = "Iron clothers";
      const { message, todo, status } = await patchTodo(NEW_TODO_CONTENT, token, INCORRECT_TODO_UUID);

      expect(todo).toBe(undefined);
      expect(message).toBe("Todo not found");
      expect(status).toBe(HTTP_RESPONSE_CODES.NOT_FOUND);
    });
  });

  describe("DELETE", () => {
    it("should handle good req", async () => {
      const { todo: postedTodo } = await postTodo(todoContent, token);

      const { message, status } = await deleteTodo(token, postedTodo.uuid);

      expect(message).toBe(undefined);
      expect(status).toBe(HTTP_RESPONSE_CODES.NO_CONTENT);
    });

    it("should handle unauthorized req", async () => {
      const { todo: postedTodo } = await postTodo(todoContent, token);

      const { message, status } = await deleteTodo(INVALID_AUTH_TOKEN, postedTodo.uuid);

      expect(message).toBe("Missing or invalid token");
      expect(status).toBe(HTTP_RESPONSE_CODES.UNAUTHORIZED);
    });

    it("should handle req when token-uuid is missing", async () => {
      await postTodo(todoContent, token);

      const { message, status } = await deleteTodo(token, "");

      expect(message).toBe("Todo uuid is required");
      expect(status).toBe(HTTP_RESPONSE_CODES.BAD_REQUEST);
    });

    it("should handle req when todo is not found in the DB", async () => {
      await postTodo(todoContent, token);

      const { message, status } = await deleteTodo(token, INCORRECT_TODO_UUID);

      expect(message).toBe("Todo not found");
      expect(status).toBe(HTTP_RESPONSE_CODES.NOT_FOUND);
    });
  });
});
