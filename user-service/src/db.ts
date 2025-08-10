import { Sequelize } from "sequelize";
import { CONSTANTS } from "./constants.js";

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env;
let database: Sequelize;

if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST) {
  throw new Error("Missing required DB env variables");
} else {
  database = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: "postgres",
    port: CONSTANTS.DB_PORT,
    logging: false,
  });
}

export default database;
