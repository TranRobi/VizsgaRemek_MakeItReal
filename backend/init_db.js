'use strict';

const DB_NAME = 'makeitreal';
const USER = 'mysql';
const PASS = '******';

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: USER,
    password: PASS,
    //database: DB_NAME,
    multipleStatements: true,
});

connection.connect();

const query = (q) => connection.query(q, (err, rows, fields) => { if (err) throw err; });

console.log('SQL kapcsolat létrejött');

console.log('Tiszta lappal kezdünk');
query(`DROP DATABASE IF EXISTS ${DB_NAME};`);

console.log('Adatbázis létrehozása');
query(`CREATE DATABASE ${DB_NAME}`);

console.log("'jobs' tábla létrehozása");
query(`
    CREATE TABLE ${DB_NAME}.jobs (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        product_id INT UNSIGNED NULL,
        gcode_file_path VARCHAR(256) CHARACTER SET utf8 NOT NULL,
        state ENUM('pending', 'in_production', 'shipped'),
        PRIMARY KEY(id)
    );
`);

connection.end();
