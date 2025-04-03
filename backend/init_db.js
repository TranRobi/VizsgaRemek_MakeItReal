"use strict";

import { unlinkSync } from "fs";
import sqlite3 from "sqlite3";
import CONFIG from "./config.js";
import { generate_salt, hash_password } from "./secret.js";
import { slicer_init_directories, generate_stl_thumbnail } from './slicer.js';

sqlite3.verbose();

console.log("Tiszta lappal kezdünk");
// nem idempotens a függvény, szóval hibát dob, ha nincs létező db
try {
	unlinkSync(`./${CONFIG.DB_NAME}`);
} catch (e) {}

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

	console.log("'jobs' tábla létrehozása");
	query(`
        CREATE TABLE jobs (
            product_id INT NULL,
            address_id INT NOT NULL,
            gcode_file_path VARCHAR(256) NOT NULL,
            quantity INT NOT NULL,
            material TEXT CHECK(material IN ('PLA', 'PETG', 'ABS')),
            colour TEXT CHECK(colour IN ('Red', 'Green', 'Blue', 'Yellow', 'Black', 'White', 'Gray')),
            state TEXT CHECK(state IN('pending', 'in_production', 'shipped', 'done')),
            FOREIGN KEY(address_id) REFERENCES address(rowid)
        );
    `);

	console.log("'users' tábla létrehozása");
	query(`
        CREATE TABLE users (
            address_id INT NULL,
            email_address VARCHAR(256) NOT NULL,
            display_name VARCHAR(64) NOT NULL,
            password_hash VARCHAR(${CONFIG.PASSWORD_HASH_SIZE}) NOT NULL,
            salt VARCHAR(${CONFIG.SALT_SIZE}) NOT NULL,
            FOREIGN KEY(address_id) REFERENCES address(rowid)
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
        ('Magyarország', 'Szabolcs-Szatmár-Bereg', 'Nyíregyháza', 4400, 'Street utca 3', '+36701234567', 'Kriszh Advice');
    `);

	const salt = generate_salt();
	const pw = hash_password("888888", salt);
	db.run(
		`
        INSERT INTO users(address_id, email_address, display_name, password_hash, salt)
            VALUES(
                (SELECT rowid FROM address WHERE name = 'Vicc Elek'),
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

	/*query(`
        INSERT INTO products VALUES 
        ('Spártai pajzs', '300 egyike', '/dev/null', '/dev/null', 1),
        ('Mester Máté', '1', '/dev/null', '/dev/null', 1),
        ('Vadász Zsolt', '1 egyike', '/dev/null', '/dev/null', 1),
        ('Tran Duy Dat', '300000000', '/dev/null', '/dev/null', 1,
        ('Girl ', '300', '/dev/null', '/dev/null', 1),
        ('Lány', '300', '/dev/null', '/dev/null', 1),
        ('Older MIlf', '300', '/dev/null', '/dev/null', 1),
        ('Wolf cut alter milf 9 foot 10 inches', '300', '/dev/null', '/dev/null', 8),
        ('Linear alternitve girl', '300', '/dev/null', '/dev/null', 9),
        ('uWu girl', '300', '/dev/null', '/dev/null', 10),
        ('Hello kitty lover', '300', '/dev/null', '/dev/null', 11),
        ('ginger girl', '300', '/dev/null', '/dev/null', 12),
        ('blonde petite', '300', '/dev/null', '/dev/null', 13),
        ('Blue hair cosplayer', '300', '/dev/null', '/dev/null', 14),
        ('Redhead milf', '300', '/dev/null', '/dev/null', 15),
        ('Rainbow haired girl', '300', '/dev/null', '/dev/null', 16),
        ('Battle girl', '300', '/dev/null', '/dev/null', 17),
        ('Big personality girl', '300', '/dev/null', '/dev/null', 18),
        ('BUNDA girl', '300', '/dev/null', '/dev/null', 19),
        ('CHERRY girl', '300', '/dev/null', '/dev/null', 20),
        ('Farmer girl', '300', '/dev/null', '/dev/null', 21),
        ('Cowboy woman', '300', '/dev/null', '/dev/null', 22),
        ('ADHD alter mix', '300', '/dev/null', '/dev/null', 23)
    `);*/
});

db.close();

slicer_init_directories();
console.log('`stl` és `product-images` mappák sikeresen létrehozva');

console.log(`
A backend Prusa Slicert és \`stl-thumb\`-ot használ G-Code és termék-kép
generáláshoz.

Prusa Slicer: telepítheti a https://github.com/prusa3d/PrusaSlicer/releases
stl-thumb: https://github.com/unlimitedbacon/stl-thumb/releases/tag/v0.5.0
`);
