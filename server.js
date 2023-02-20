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

const selectStates = async (req, res) => {
    try {
        await database.connect();
        await database.query("BEGIN");
        let statement = "SELECT DISTINCT state FROM business ORDER BY state;";
        const result = await database.query(statement);
        console.log(result);
        res.send(result.rows);
        await database.query("ROLLBACK");
    } catch (err) {
        await database.query("ROLLBACK");
    } finally {
        database.end();
    }
}

/*
 * SELECT DISTINCT city
 * FROM business
 * WHERE state= <selected state>
 * ORDER BY city;
 */
const selectCities = async (req, res) => {
    try {
        await database.connect();
        await database.query("BEGIN");
        let statement = "SELECT DISTINCT state FROM business ORDER BY state;";
        const states = database.query(statement);
        const getState = url => url.substring(url.lastIndexOf('/') + 1);
        const state = getState(req.url);
        let qresult;
        if (states.include(state)) {
            let statement = "SELECT DISTINCT city FROM business WHERE state=$1 ORDER BY city;";
            qresult = await database.query(statement, [state]);
            console.log(qresult);
        } else {
            qresult = req.url;
            console.log(req.url);
        }
        const result = qresult;
        res.send(result);
        await database.query("ROLLBACK");
    } catch (err) {
        await database.query("ROLLBACK");
    } finally {
        database.end();
    }
}
api.get("/", selectAll);
api.get("/states", selectStates);
//api.get("/states/NV", selectCities);

api.listen(PORT, HOST);
console.log(`Running on http://${PORT}:${PORT}`);
