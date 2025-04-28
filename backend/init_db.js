"use strict";

import { unlinkSync, copyFileSync } from "fs";
import sqlite3 from "sqlite3";
import { CONFIG, JOB_COLOURS, JOB_STATES, JOB_MATERIALS } from "./config.js";
import { generate_salt, hash_password } from "./secret.js";
import {
  slicer_cleanup_directiories,
  slice_stl_to_gcode,
  slicer_init_directories,
  generate_stl_thumbnail,
  get_gcode_price,
} from "./slicer.js";
import { async_get, file_name_from_date } from "./util.js";

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
            cost_per_piece INT NOT NULL,
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
  console.log("`stl`, `gcode` és `product-images` mappák sikeresen létrehozva");

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
      name: "Ring holder",
      description: "Ring holder that protects the ring from scratches",
      stl_path: "./stl/ring_holder.stl",
    },
    {
      name: "Fan holder",
      description: "Fan holder, air filter can be added",
      stl_path: "./stl/80mm_fan_holder.stl",
    },
    {
      name: "Toothbrush holder",
      description: "Toothbrush holder, for traveling",
      stl_path: "./stl/carry-on_toothbrush_case.stl",
    },
    {
      name: "Coaster",
      description:
        "Coaster that protects furniture from scratches and moisture",
      stl_path: "./stl/coaster_hex.stl",
    },
    {
      name: "DC motor holder",
      description: "DC motor holder, for JGA370 motor",
      stl_path: "./stl/DC_motor_holder_jga370.stl",
    },
    {
      name: "Detergent cup",
      description: "Detergent dispenser for dispensing detergent",
      stl_path: "./stl/detergent_cup.stl",
    },
    {
      name: "Rose keychain",
      description: "Rose keychain, perfect gift for ladies",
      stl_path: "./stl/keychain_rose_heart.stl",
    },
    {
      name: "Knife holder",
      description: "Knife holder, for hiking, camping, can be hung on a belt",
      stl_path: "./stl/knife_holder.stl",
    },
    {
      name: "Laptop stand",
      description: "Laptop stand for better cooling",
      stl_path: "./stl/laptop_stand.stl",
    },
    {
      name: "Laser holder",
      description: "Laser mount for rifle, 20mm rail",
      stl_path: "./stl/laser_adapter_multi_use.stl",
    },
    {
      name: "Parkside battery holder",
      description: "Wall-mounted battery holder for Parkside batteries",
      stl_path: "./stl/parkside_x20_battery_holder.stl",
    },
    {
      name: "PowerBank",
      description: "PowerBank, with 10pcs 13700 batteries",
      stl_path: "./stl/powerBank_from_13700_batteries.stl",
    },
    {
      name: "Pot",
      description: "A pot that protects plants from drying out",
      stl_path: "./stl/small_pot.stl",
    },
    {
      name: "Toothbrush holder",
      description:
        "Toothbrush holder, for one electric toothbrush, two manual toothbrushes and one tube of toothpaste",
      stl_path: "./stl/toothburhs_holder_elecric_brush.stl",
    },
  ];

  console.log("Példa termékek képeinek generálása...");
  for (const sample of sample_products) {
    const new_stl_path = `./stl/${file_name_from_date()}.stl`;
    copyFileSync(sample.stl_path, new_stl_path);
    const thumbnail_path = generate_stl_thumbnail(sample.stl_path);
    console.log(`${sample.name} termék képének generálása...`);
    query(`
            INSERT INTO products VALUES ('${sample.name}', '${sample.description}', '${new_stl_path}', '${thumbnail_path}', 1)
        `);
  }
});

// segítő függvények random adat generáláshoz
const random_quantity = () => Math.round(Math.random() * 5 + 1);
const random_key = (obj) => {
  const keys = Object.keys(obj).length;
  const random_key_idx = Math.round(Math.random() * (keys - 1));
  return obj[Object.keys(obj)[random_key_idx]];
};

console.log("Példa rendelések generálása...");
const products_to_jobs = [1, 4, 8, 9];
const promises = products_to_jobs.map(
  (idx) =>
    new Promise((resolve, reject) => {
      async_get(
        db,
        `SELECT stl_file_path FROM products WHERE rowid = ?`,
        idx + 1
      ).then(
        (row) => {
          const gcode_path = `./gcode/${file_name_from_date()}.gcode`;
          const material = random_key(JOB_MATERIALS);
          slice_stl_to_gcode(row.stl_file_path, gcode_path);
          console.log(`${row.stl_file_path} -> ${gcode_path}`);
          get_gcode_price(gcode_path, material).then(
            (price) => {
              async_get(
                db,
                `INSERT INTO jobs VALUES
                        (${
                          idx + 1
                        }, NULL, 1, 1, '${gcode_path}', ${random_quantity()},
                         '${material}',
                         '${random_key(JOB_COLOURS)}', '${random_key(
                  JOB_STATES
                )}', ${price})
                        RETURNING product_id, state`
              ).then(
                (row) => {
                  console.log(row);
                  resolve(row);
                },
                (err) => {
                  console.log(err);
                  reject(err);
                }
              );
            },
            (err) => {
              console.log(err);
              reject(err);
            }
          );
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    })
);
Promise.all(promises).then(() => db.close());

console.log(`
A backend Prusa Slicert és \`stl-thumb\`-ot használ G-Code és termék-kép
generáláshoz.

Prusa Slicer: telepítheti a https://github.com/prusa3d/PrusaSlicer/releases
stl-thumb: https://github.com/unlimitedbacon/stl-thumb/releases/tag/v0.5.0
`);
