import express from "express";
import cors from "cors";
import database from "./db.js";
import userRouter from "./routes/user.js";
import { CONSTANTS } from "./constants.js";
import { handleError } from "./middlewares/error.js";

const app = express();

app.use(
  cors({
    origin: CONSTANTS.FRONTEND_ADDRESS,
    methods: ["POST"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/user", userRouter);
app.use(handleError);

if (database !== undefined) {
  try {
    await database.authenticate();
    await database.sync();

    console.info("User database connected & models synced");
    app.listen(CONSTANTS.API_PORT, () => console.info(`User server running on port ${CONSTANTS.API_PORT}`));
  } catch (err) {
    console.error("User DB connection error:", err);
    process.exit(1);
  }
}
