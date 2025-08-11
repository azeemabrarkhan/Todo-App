import { describe, it, expect } from "vitest";
import supertest from "supertest";
import { nanoid } from "nanoid";
import { CONSTANTS } from "../constants.js";
import { HTTP_RESPONSE_CODES } from "../enums/http-response-codes.js";

describe("", () => {
  const EMAIL_BASE = nanoid();
  const VALID_USER_EMAIL = `test${EMAIL_BASE}@gmail.com`;
  const UNFORMATTED_EMAIL = `test${EMAIL_BASE}gmail.cm`;

  const VALID_USER_PASSWORD = [...Array(CONSTANTS.MIN_PASSWORD_LENGTH).keys()].join("");
  const SHORT_PASSWORD = [...Array(CONSTANTS.MIN_PASSWORD_LENGTH - 1).keys()].join("");

  const SERVER = `http://localhost:${CONSTANTS.API_PORT}/api/user`;
  const SIGN_UP = "/sign-up";
  const LOGIN = "/login";

  describe("User signup", () => {
    it("should reject when email is not properly formatted", async () => {
      const res = await supertest(SERVER)
        .post(SIGN_UP)
        .send({ user_email: UNFORMATTED_EMAIL, user_pwd: VALID_USER_PASSWORD });

      expect(res.status).toBe(HTTP_RESPONSE_CODES.BAD_REQUEST);
      expect(res.body.message).toBe("Email address is not correctly formatted");
    });

    it("should reject when password is short", async () => {
      const res = await supertest(SERVER)
        .post(SIGN_UP)
        .send({ user_email: VALID_USER_EMAIL, user_pwd: SHORT_PASSWORD });

      expect(res.status).toBe(HTTP_RESPONSE_CODES.BAD_REQUEST);
      expect(res.body.message).toBe("Password should be at least 6 characters long");
    });

    it("should register a new user", async () => {
      const res = await supertest(SERVER)
        .post(SIGN_UP)
        .send({ user_email: VALID_USER_EMAIL, user_pwd: VALID_USER_PASSWORD });

      expect(res.status).toBe(HTTP_RESPONSE_CODES.CREATED);
      expect(res.body.message).toBe("User registered successfully");

      const { user } = res.body;

      expect(user.uuid).toBeTypeOf("string");
      expect(user.user_email).toBe(VALID_USER_EMAIL);
    });

    it("should reject when existing user tries to register again", async () => {
      const res = await supertest(SERVER)
        .post(SIGN_UP)
        .send({ user_email: VALID_USER_EMAIL, user_pwd: VALID_USER_PASSWORD });

      expect(res.status).toBe(HTTP_RESPONSE_CODES.CONFLICT);
      expect(res.body.message).toBe("Email already registered");
    });
  });

  describe("User login", () => {
    it("should reject when email is not properly formatted", async () => {
      const res = await supertest(SERVER)
        .post(LOGIN)
        .send({ user_email: UNFORMATTED_EMAIL, user_pwd: VALID_USER_PASSWORD });

      expect(res.status).toBe(HTTP_RESPONSE_CODES.BAD_REQUEST);
      expect(res.body.message).toBe("Email address is not correctly formatted");
    });

    it("should reject when password is short", async () => {
      const res = await supertest(SERVER).post(LOGIN).send({ user_email: VALID_USER_EMAIL, user_pwd: SHORT_PASSWORD });

      expect(res.status).toBe(HTTP_RESPONSE_CODES.BAD_REQUEST);
      expect(res.body.message).toBe("Password should be at least 6 characters long");
    });

    it("should login with the correct email and password", async () => {
      const res = await supertest(SERVER)
        .post(LOGIN)
        .send({ user_email: VALID_USER_EMAIL, user_pwd: VALID_USER_PASSWORD });

      expect(res.status).toBe(HTTP_RESPONSE_CODES.OK);

      const { token, user } = res.body;

      expect(token).toBeTypeOf("string");
      expect(user.uuid).toBeTypeOf("string");
      expect(user.user_email).toBe(VALID_USER_EMAIL);
    });

    it("should reject when try to login with the incorrect password", async () => {
      const incorrectPassword = VALID_USER_PASSWORD.split("").reverse().join("");
      const res = await supertest(SERVER)
        .post(LOGIN)
        .send({ user_email: VALID_USER_EMAIL, user_pwd: incorrectPassword });

      expect(res.status).toBe(HTTP_RESPONSE_CODES.UNAUTHORIZED);
      expect(res.body.message).toBe("Unauthorized: Invalid credentials");
    });
  });
});
