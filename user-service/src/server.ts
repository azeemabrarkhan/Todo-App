import express from "express";
import pool from "./db.js";

const port = 1337;

const app = express();

app.get('/', (req, res) => {
    res.sendStatus(200);
})

app.listen(port, () => console.log(`Server has started on port: ${port}`));