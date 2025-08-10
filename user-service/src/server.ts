import express from "express";
import database from "./db.js";
import userRouter from "./routes/user.js";

const PORT = 4000;
const app = express();

app.use(express.json());
app.use("/api/user", userRouter);

if (database !== undefined) {
  database
    .sync()
    .then(() => {
      console.log("Database connected & models synced");
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.error("DB connection error:", err));
}
