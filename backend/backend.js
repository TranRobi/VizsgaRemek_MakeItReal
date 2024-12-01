'use strict';

const mysql = require('mysql');
const express = require('express');

const DB_NAME = 'makeitreal';
const USER = 'mysql';
const PASS = '******';
const PORT = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: USER,
    password: PASS,
    //database: DB_NAME,
    multipleStatements: true,
});
db.connect();

const app = express();

app.get('/', (req, res) => {
    res.send('<h1>lol</h1>');
});

app.listen(PORT, () => {
    console.log('Backend fut');
});
