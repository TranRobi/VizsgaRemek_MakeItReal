"use strict";

import { unlinkSync } from "fs";
import sqlite3 from "sqlite3";
import { CONFIG, JOB_COLOURS, JOB_STATES, JOB_MATERIALS } from "./config.js";
import { generate_salt, hash_password } from "./secret.js";
import { slicer_cleanup_directiories, slice_stl_to_gcode, slicer_init_directories, generate_stl_thumbnail } from './slicer.js';
import { async_get, file_name_from_date } from './util.js';

sqlite3.verbose();

console.log("Tiszta lappal kezdünk");
// nem idempotens a függvény, szóval hibát dob, ha nincs létező db
try {
	unlinkSync(`./${CONFIG.DB_NAME}`);
} catch (e) {}

slicer_cleanup_directiories();

const db = new sqlite3.Database(`./${CONFIG.DB_NAME}`);
console.log("SQLite adatbázis létrehozva");

const query = (q) =>
	db.run(q, (err) => {
		if (err) {
			console.log(err);
			throw err;
		}
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
            phone_number VARCHAR(12) NOT NULL,
            name VARCHAR(64) NOT NULL
        );
    `);

    console.log("'payment_info' tábla létrehozása");
    query(`
        CREATE TABLE payment_info (
            card_number VARCHAR(19) NOT NULL,
            name VARCHAR(64) NOT NULL,
            cvv VARCHAR(4) NOT NULL,
            expiration_year VARCHAR(2) NOT NULL,
            expiration_month VARCHAR(2) NOT NULL
        );
    `);

	console.log("'jobs' tábla létrehozása");
	query(`
        CREATE TABLE jobs (
            product_id INT NULL,
            email_address VARCHAR(128) NULL,
            payment_info_id INT NOT NULL,
            address_id INT NOT NULL,
            gcode_file_path VARCHAR(256) NOT NULL,
            quantity INT NOT NULL,
            material TEXT CHECK(material IN ('PLA', 'PETG', 'ABS')),
            colour TEXT CHECK(colour IN ('Red', 'Green', 'Blue', 'Yellow', 'Black', 'White', 'Gray')),
            state TEXT CHECK(state IN('pending', 'in_production', 'shipped', 'done')),
            FOREIGN KEY(address_id) REFERENCES address(rowid),
            FOREIGN KEY(payment_info_id) REFERENCES payment_info(rowid)
        );
    `);

	console.log("'users' tábla létrehozása");
	query(`
        CREATE TABLE users (
            address_id INT NULL,
            payment_info_id INT NULL,
            email_address VARCHAR(256) NOT NULL,
            display_name VARCHAR(64) NOT NULL,
            password_hash VARCHAR(${CONFIG.PASSWORD_HASH_SIZE}) NOT NULL,
            salt VARCHAR(${CONFIG.SALT_SIZE}) NOT NULL,
            FOREIGN KEY(address_id) REFERENCES address(rowid),
            FOREIGN KEY(payment_info_id) REFERENCES payment_info(rowid)
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

    slicer_init_directories();
    console.log('`stl`, `gcode` és `product-images` mappák sikeresen létrehozva');

	console.log("Dummy adatokkal feltöltés");
	query(`
        INSERT INTO address(country, county, city, postal_code, street_number, phone_number, name) VALUES
        ('Magyarország', 'Pest', 'Budapest', 4000, 'Street utca 2', 36701234567, 'Vicc Elek'),
        ('Magyarország', 'Szabolcs-Szatmár-Bereg', 'Nyíregyháza', 4400, 'Street utca 3', '+36701234567', 'Kriszh Advice');
    `);
    query(`
        INSERT INTO payment_info VALUES (1234567890123456789, 'Vicc Elek', '666', '03', '28');
    `);

	const salt = generate_salt();
	const pw = hash_password("888888", salt);
	db.run(
		`
        INSERT INTO users(address_id, payment_info_id, email_address, display_name, password_hash, salt)
            VALUES(
                (SELECT rowid FROM address WHERE name = 'Vicc Elek'),
                (SELECT rowid FROM payment_info WHERE name = 'Vicc Elek'),
                ?, ?, ?, ?);
    `,
		"viccelek@citromail.hu",
		"ViccElek",
		pw,
		salt
	);

    const sample_products = [
        {
            name: 'Gyűrű tartó',
            description: 'Gyűrű tartó, ami megvédi a gyűrűt a karcolódástól',
            stl_path: './stl/ring_holder.stl',
        },
        {
            name: 'Ventillátor tartó',
            description: 'Ventillátor tartó, levegő szűrő hozzáadható',
            stl_path: './stl/80mm_fan_holder.stl',
        },
        {
            name: 'Fogkefe tartó',
            description: 'Fogkefe tartó, utazáshoz',
            stl_path: './stl/carry-on_toothbrush_case.stl',
        },
        {
            name: 'Poháralátét',
            description: 'Poháralátét, ami megvédi a bútorokat a karcolódástól, és a nedvességtől',
            stl_path: './stl/coaster_hex.stl',
        },
        {
            name: 'DC motor tartó',
            description: 'DC motor tartó, JGA370 motorhoz',
            stl_path: './stl/DC_motor_holder_jga370.stl',
        },
        {
            name: 'Mosószer tartó pohár',
            description: 'Mosószer tartó, a mosószer adagolásához',
            stl_path: './stl/detergent_cup.stl',
        },
        {
            name: 'Rózsás kulcstartó',
            description: 'Rózsás kulcstartó, tökéletes ajándék hölgyeknek',
            stl_path: './stl/keychain_rose_heart.stl',
        },
        {
            name: 'Késtartó',
            description: 'Késtartó, túrázáshoz, kempingezéshez, övre akasztható',
            stl_path: './stl/knife_holder.stl',
        },
        {
            name: 'Laptop támasztó',
            description: 'Laptop támasztó, a jobb hűtés érdekében',
            stl_path: './stl/laptop_stand.stl',
        },
        {
            name: 'Lézertartó',
            description: 'Lézertartó puskához, 20mm-es sínre',
            stl_path: './stl/laser_adapter_multi_use.stl',
        },
        {
            name: 'Parkside akkumulátor tartó',
            description: 'Falra rögzíthető akkumulátor tartó, Parkside akkumulátorokhoz',
            stl_path: './stl/parkside_x20_battery_holder.stl',
        },
        {
            name: 'PowerBank',
            description: 'PowerBank, 10db 13700-as akkumulátorokkal',
            stl_path: './stl/powerBank_from_13700_batteries.stl',
        },
        {
            name: 'Cserép',
            description: 'Cserép, ami megvédi a növényeket a kiszáradástól',
            stl_path: './stl/small_pot.stl',
        },
        {
            name: 'Fogkefe tartó',
            description: 'Fogkefe tartó, egy elektromos fogkeféhez, két manuális fogkeféhez és egy tubus fogkrémhez',
            stl_path: './stl/small_pot.stl',
        },
    ];

    console.log('Példa termékek képeinek generálása...');
    for (const sample of sample_products) {
        const thumbnail_path = generate_stl_thumbnail(sample.stl_path);
        console.log(`${sample.name} termék képének generálása...`)
        query(`
            INSERT INTO products VALUES ('${sample.name}', '${sample.description}', '${sample.stl_path}', '${thumbnail_path}', 1)
        `);
    }
});

// segítő függvények random adat generáláshoz
const random_quantity = () => Math.round(Math.random() * 5 + 1);
const random_key = obj => {
    const keys = Object.keys(obj).length;
    const random_key_idx = Math.round(Math.random() * (keys - 1));
    return obj[Object.keys(obj)[random_key_idx]];
};

console.log('Példa rendelések generálása...');
const products_to_jobs = [ 1, 4, 8, 9 ];
const promises = products_to_jobs.map(idx => new Promise((resolve, reject) => {
    async_get(db, `SELECT stl_file_path FROM products WHERE rowid = ?`, idx + 1).then(
        row => {
            const gcode_path = `./gcode/${file_name_from_date()}.gcode`;
            slice_stl_to_gcode(row.stl_file_path, gcode_path);
            console.log(`${row.stl_file_path} -> ${gcode_path}`);
            async_get(db, `INSERT INTO jobs VALUES
                (${idx + 1}, NULL, 1, 1, '${gcode_path}', ${random_quantity()},
                 '${random_key(JOB_MATERIALS)}',
                 '${random_key(JOB_COLOURS)}', '${random_key(JOB_STATES)}')
                RETURNING product_id, state`).then(
                row => {
                    console.log(row);
                },
                err => {
                    console.log(err);
                }
            );
        },
        err => {
            console.log(err);
        }
    );
}));
Promise.all(promises).then(() => db.close());


db.close();


console.log(`
A backend Prusa Slicert és \`stl-thumb\`-ot használ G-Code és termék-kép
generáláshoz.

Prusa Slicer: telepítheti a https://github.com/prusa3d/PrusaSlicer/releases
stl-thumb: https://github.com/unlimitedbacon/stl-thumb/releases/tag/v0.5.0
`);
