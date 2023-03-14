var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const { Client } = require("pg");
var app = express();
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
};

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
    const getState = (url) => url.substring(url.lastIndexOf("/") + 1);
    console.log(url.substring(url.lastIndexOf("/") + 1));
    const state = getState(req.url);
    let qresult;
    if (states.include(state)) {
      let statement =
        "SELECT DISTINCT city FROM business WHERE state=$1 ORDER BY city;";
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
};
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.get("/Ahwatukee", selectAll);
app.get("/states", selectStates);

module.exports = app;
