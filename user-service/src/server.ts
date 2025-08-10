import express from "express";
import database from "./db.js";
import userRouter from "./routes/user.js";
import { CONSTANTS } from "./constants.js";

const app = express();

app.use(express.json());
app.use("/api/user", userRouter);

if (database !== undefined) {
  database
    .sync()
    .then(() => {
      console.log("Database connected & models synced");
      app.listen(CONSTANTS.API_PORT, () =>
        console.log(`Server running on port ${CONSTANTS.API_PORT}`)
      );
    })
    .catch((err) => console.error("DB connection error:", err));
}
