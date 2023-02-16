"use strict";

const express = require("express");
const { Client } = require("pg");

const PORT = 8080;
const HOST = "localhost";

const api = express();
const database = new Client({
    host: "localhost",
    database: "business_db",
    user: "postgres",
    password: "pass",
    port: 5432,
});

const selectAll = async (req, res) => {
    try {
        await database.connect();
        await database.query("BEGIN");
        let statement = "SELECT * FROM business WHERE (city='Ahwatukee');";
        const result = await database.query(statement);
        console.log(result);
        res.send(result.rows);
        await database.query("ROLLBACK");
        //await database.query("COMMIT");
    } catch (err) {
        await database.query("ROLLBACK");
        console.log(res, err);
    } finally {
        database.end(); // pool.release();
    }
};

api.get("/", selectAll);

api.listen(PORT, HOST);
console.log(`Running on http://${PORT}:${PORT}`);
