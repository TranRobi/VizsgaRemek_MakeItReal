'use strict';

import { unlinkSync } from 'fs';
import sqlite3 from 'sqlite3';

sqlite3.verbose();

const DB_NAME = 'makeitreal.db';

console.log('Tiszta lappal kezdünk');
// nem idempotens a függvény, szóval hibát dob, ha nincs létező db
try {
    unlinkSync(`./${DB_NAME}`);
} catch (e) {}

const connection = new sqlite3.Database(`./${DB_NAME}`);
console.log('SQLilte adatbázis létrehozva');

const query = (q) => connection.run(q, (err) => { if (err) throw err; });

connection.serialize(() => {
    console.log("'address' tábla létrehozása");
    query(`
        CREATE TABLE address (
            id INT NOT NULL PRIMARY KEY,
            country VARCHAR(128) NOT NULL,
            county VARCHAR(256) NOT NULL,
            city VARCHAR(256) NOT NULL,
            number INT NOT NULL,
            postal_code INT NOT NULL,
            phone_number INT NOT NULL,
            name VARCHAR(256) NOT NULL
        );
    `);
    
    console.log("'jobs' tábla létrehozása");
    query(`
        CREATE TABLE jobs (
            id INT NOT NULL PRIMARY KEY,
            product_id INT NULL,
            address_id INT NOT NULL,
            gcode_file_path VARCHAR(256) NOT NULL,
            quantity INT NOT NULL,
            material TEXT CHECK(material IN ('PLA', 'PETG', 'ABS')),
            colour TEXT CHECK(colour IN ('Red', 'Green', 'Blue', 'Yellow', 'Black', 'White', 'Gray')),
            state TEXT CHECK(state IN('pending', 'in_production', 'shipped')),
            FOREIGN KEY(address_id) REFERENCES address(id)
        );
    `);
    
    console.log("'users' tábla létrehozása");
    query(`
        CREATE TABLE users (
            id INT NOT NULL PRIMARY KEY,
            address_id INT,
            email_address VARCHAR(256) NOT NULL,
            display_name VARCHAR(64) NOT NULL,
            password VARCHAR(128) NOT NULL
        );
    `);
});

connection.close();
