import express from "express";
import pool from "../db.js";

const registerRouter = express.Router();

registerRouter.get("/", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM users");
    res.status(200).send(data.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

export default registerRouter;
