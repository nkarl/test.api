"use strict";

const express = require("express");
const { Client } = require("pg");

const PORT = 8080;
const HOST = "localhost";

const app = express();
const client = new Client({
  host: "localhost",
  database: "my_db",
  user: "myself",
  password: "pass",
  port: 5432,
});

const selectAll = async (req, res) => {
  try {
    await client.connect();
    await client.query("BEGIN");
    let statement = "SELECT * FROM business WHERE (city='Ahwatukee');";
    const result = await client.query(statement);
    res.send(result.rows);
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
}

app.get("/", selectAll);

app.listen(PORT, HOST);
console.log(`Running on http://${PORT}:${PORT}`);
