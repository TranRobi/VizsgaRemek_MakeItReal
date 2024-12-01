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
        address_id INT UNSIGNED NOT NULL,
        gcode_file_path VARCHAR(256) CHARACTER SET utf8 NOT NULL,
        quantity INT UNSIGNED NOT NULL,
        material ENUM('PLA', 'PETG', 'ABS'),
        colour ENUM('Red', 'Green', 'Blue', 'Yellow', 'Black', 'White', 'Gray'),
        state ENUM('pending', 'in_production', 'shipped'),
        PRIMARY KEY(id)
    );
`);

console.log("'address' tábla létrehozása");
query(`
    CREATE TABLE ${DB_NAME}.address (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        country VARCHAR(128) CHARACTER SET utf8 NOT NULL,
        county VARCHAR(256) CHARACTER SET utf8 NOT NULL,
        city VARCHAR(256) CHARACTER SET utf8 NOT NULL,
        number INT UNSIGNED NOT NULL,
        postal_code INT UNSIGNED NOT NULL,
        phone_number INT UNSIGNED  NOT NULL,
        name VARCHAR(256) CHARACTER SET utf8 NOT NULL,
        PRIMARY KEY(id)
    );
`);

console.log("'users' tábla létrehozása");
query(`
    CREATE TABLE ${DB_NAME}.users (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        address_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        email_address VARCHAR(256) CHARACTER SET utf8 NOT NULL,
        display_name VARCHAR(64) CHARACTER_SET utf8 NOT NULL,
        password VARCHAR(128) CHARACTER_SET utf8 NOT NULL,
        PRIMARY KEY(id)
    );
`);

connection.end();
