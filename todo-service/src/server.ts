import express from "express";
import database from "./db.js";
import todoRouter from "./routes/todo.js";
import { CONSTANTS } from "./constants.js";
import { handleError } from "./middlewares/error.js";

const app = express();

app.use(express.json());
app.use("/api/todo", todoRouter);
app.use(handleError);

if (database !== undefined) {
  try {
    await database.authenticate();
    await database.sync();

    console.info("Todo database connected & models synced");
    app.listen(CONSTANTS.API_PORT, () => console.info(`Todo server running on port ${CONSTANTS.API_PORT}`));
  } catch (err) {
    console.error("Todo DB connection error:", err);
    process.exit(1);
  }
}
