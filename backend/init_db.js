"use strict";

import { unlinkSync } from "fs";
import sqlite3 from "sqlite3";

sqlite3.verbose();

const DB_NAME = "makeitreal.db";

console.log("Tiszta lappal kezdünk");
// nem idempotens a függvény, szóval hibát dob, ha nincs létező db
try {
	unlinkSync(`./${DB_NAME}`);
} catch (e) {}

const db = new sqlite3.Database(`./${DB_NAME}`);
console.log("SQLilte adatbázis létrehozva");

const query = (q) =>
	db.run(q, (err) => {
		if (err) throw err;
	});

db.serialize(() => {
	console.log("'address' tábla létrehozása");
	query(`
        CREATE TABLE address (
            country VARCHAR(64) NOT NULL,
            county VARCHAR(128) NOT NULL,
            city VARCHAR(128) NOT NULL,
            postal_code INT NOT NULL,
            street_number VARCHAR(128) NOT NULL,
            phone_number INT NOT NULL,
            name VARCHAR(64) NOT NULL
        );
    `);

	console.log("'jobs' tábla létrehozása");
	query(`
        CREATE TABLE jobs (
            product_id INT NULL,
            address_id INT NOT NULL,
            gcode_file_path VARCHAR(256) NOT NULL,
            quantity INT NOT NULL,
            material TEXT CHECK(material IN ('PLA', 'PETG', 'ABS')),
            colour TEXT CHECK(colour IN ('Red', 'Green', 'Blue', 'Yellow', 'Black', 'White', 'Gray')),
            state TEXT CHECK(state IN('pending', 'in_production', 'shipped')),
            FOREIGN KEY(address_id) REFERENCES address(rowid)
        );
    `);

	console.log("'users' tábla létrehozása");
	query(`
        CREATE TABLE users (
            address_id INT NULL,
            email_address VARCHAR(256) NOT NULL,
            display_name VARCHAR(64) NOT NULL,
            password VARCHAR(128) NOT NULL
        );
    `);

	console.log("'products' tábla létrehozása");
	query(`
        CREATE TABLE products (
            name VARCHAR(64) NOT NULL,
            description VARCHAR(512) NOT NULL,
            stl_file_path VARCHAR(256) NOT NULL,
            display_image_file_path VARCHAR(256) NOT NULL,
            uploader_id INT NOT NULL,
            FOREIGN KEY(uploader_id) REFERENCES users(rowid)
        );
    `);

	console.log("Dummy adatokkal feltöltés");
	query(`
        INSERT INTO address(country, county, city, postal_code, street_number, phone_number, name) VALUES
        ('Magyarország', 'Pest', 'Budapest', 4000, 'Street utca 2', 36701234567, 'Vicc Elek'),
        ('Magyarország', 'Szabolcs-Szatmár-Bereg', 'Nyíregyháza', 4400, 'Street utca 3', 36701234567, 'Kriszh Advice');
    `);
	let rowid = 0;
	db.get(
		`
        SELECT rowid FROM address WHERE name = 'Vicc Elek';
    `,
		(err, row_id) => {
			rowid = row_id;
		}
	);
	query(`
        INSERT INTO users VALUES(${rowid}, 'viccelek@citromail.hu', 'ViccElek', '888888');
    `);

	query(`
        INSERT INTO products VALUES 
        ('Spártai pajzs', '300 egyike', '/dev/null', '/dev/null', 1),
        ('Spártai', '300', '/dev/null', '/dev/null', 2),
        ('Spártai pajzs', '300 egyike', '/dev/null', '/dev/null', 3),
        ('Spártai', '300', '/dev/null', '/dev/null', 4),
        ('Spártai', '300', '/dev/null', '/dev/null', 5),
        ('Spártai', '300', '/dev/null', '/dev/null', 6),
        ('Spártai', '300', '/dev/null', '/dev/null', 7),
        ('Spártai', '300', '/dev/null', '/dev/null', 8),
        ('Spártai', '300', '/dev/null', '/dev/null', 9),
        ('Spártai', '300', '/dev/null', '/dev/null', 10),
        ('Spártai', '300', '/dev/null', '/dev/null', 11),
        ('Spártai', '300', '/dev/null', '/dev/null', 12),
        ('Spártai', '300', '/dev/null', '/dev/null', 13),
        ('Spártai', '300', '/dev/null', '/dev/null', 14),
        ('Spártai', '300', '/dev/null', '/dev/null', 15),
        ('Spártai', '300', '/dev/null', '/dev/null', 16),
        ('Spártai', '300', '/dev/null', '/dev/null', 17),
        ('Spártai', '300', '/dev/null', '/dev/null', 18),
        ('Spártai', '300', '/dev/null', '/dev/null', 19),
        ('Spártai', '300', '/dev/null', '/dev/null', 20),
        ('Spártai', '300', '/dev/null', '/dev/null', 21),
        ('Spártai', '300', '/dev/null', '/dev/null', 22),
        ('Spártai', '300', '/dev/null', '/dev/null', 23),
        ('Spártai', '300', '/dev/null', '/dev/null', 24),
        ('Spártai', '300', '/dev/null', '/dev/null', 25),
        ('Spártai', '300', '/dev/null', '/dev/null', 26),
        ('Spártai', '300', '/dev/null', '/dev/null', 27),
        ('Spártai', '300', '/dev/null', '/dev/null', 28),
        ('Spártai', '300', '/dev/null', '/dev/null', 29),
        ('Spártai', '300', '/dev/null', '/dev/null', 30),
        ('Spártai', '300', '/dev/null', '/dev/null', 31),
        ('Spártai', '300', '/dev/null', '/dev/null', 32),
        ('Spártai', '300', '/dev/null', '/dev/null', 33),
        ('Spártai', '300', '/dev/null', '/dev/null', 34);
    `);
});

db.close();
