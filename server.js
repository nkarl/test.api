"use strict";

const express = require("express");
const { Client } = require("pg");

const PORT = 8080;
const HOST = "localhost";

const api = express();
const client = new Client({
  host: "localhost",
  database: "business_db",
  user: "postgres",
  password: "pass",
  port: 5432,
});

const selectAll = async (req, res) => {
  try {
    await client.connect();
    await client.query("BEGIN");
    let statement = "SELECT * FROM business WHERE (city='Ahwatukee');";
    const result = await client.query(statement);
    console.log(result);
    res.send(result.rows);
    await client.query("ROLLBACK");
    //await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.log(res, err);
  } finally {
    client.end(); // pool.release();
  }
};

api.get("/", selectAll);

api.listen(PORT, HOST);
console.log(`Running on http://${PORT}:${PORT}`);
