import express from "express";
import registerRouter from "./routes/register.js";

const PORT = 4000;
const app = express();

app.use(express.json());
app.use("/register", registerRouter);
app.listen(PORT, () => console.log(`Server has started on port: ${PORT}`));
