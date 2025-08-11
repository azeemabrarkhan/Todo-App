import express from "express";
import database from "./db.js";
import userRouter from "./routes/user.js";
import { CONSTANTS } from "./constants.js";
import { handleError } from "./middlewares/error.js";

const app = express();

app.use(express.json());
app.use("/api/user", userRouter);
app.use(handleError);

if (database !== undefined) {
  database
    .sync()
    .then(() => {
      console.info("User database connected & models synced");
      app.listen(CONSTANTS.API_PORT, () => console.info(`User server running on port ${CONSTANTS.API_PORT}`));
    })
    .catch((err) => console.error("User DB connection error:", err));
}

export default app;
