"use strict";

import sqlite3 from "sqlite3";
import express from "express";
import swagger_jsdoc from "swagger-jsdoc";
import swagger_ui from "swagger-ui-express";
import body_parser from "body-parser";
const { urlencoded } = body_parser;
import cookie_parser from "cookie-parser";
import cors from "cors";

import CONFIG from "./config.js";
import { generate_salt, hash_password } from "./secret.js";
import { rename_key } from "./util.js";
import { async_get, async_run } from './async_helpers.js';

const PORT = 8080;
const SWAGGER_OPTS = {
	swaggerDefinition: {
		openapi: "3.0.0",
		info: {
			title: "Make It Real API",
			description: "Backend szolgáltatás API-ja",
			contact: {
				name: "Zsolt Vadász",
				email: "20d_vadaszz@nyirszikszi.hu",
			},
		},
		components: {
			securitySchemes: {
				cookieAuth: {
					type: "apiKey",
					in: "cookie",
					name: "LOGIN_TOKEN",
				},
			},
		},
		security: {
			cookieAuth: [],
		},
		servers: [
			{
				url: `http://localhost:${PORT}/`,
			},
		],
	},
	apis: ["./backend.js"],
};

// kenyelmi closure
const new_db_error_ctx = () => {
	let err_to_return = null;

	const error_handler = (err) => {
		if (err) console.log(err);
		err_to_return = err;
	};
	const getter = () => err_to_return;

	return [error_handler, getter];
};

const PATH_ID_REGEX = new RegExp("^[0-9]+$");

const db = new sqlite3.Database(`./${CONFIG.DB_NAME}`);
const app = express();

app.use(cors());
app.use(cookie_parser());
app.use(urlencoded({ extended: true }));
app.use(
	"/api-docs",
	swagger_ui.serve,
	swagger_ui.setup(swagger_jsdoc(SWAGGER_OPTS))
);

const logged_in_users = new Array();

app.get("/", (req, res) => {
	return res.send("<h1>lol</h1>");
});

/**
 * @swagger
 * /api/register:
 *     post:
 *         summary: Regisztráció
 *         tags:
 *           - Auth rendszer
 *         description: Beszúr egy sort a `users` táblába
 *         security: []
 *         requestBody:
 *             required: true
 *             content:
 *                 application/x-www-form-urlencoded:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             email-address:
 *                                 type: string
 *                                 description: Email cím
 *                             display-name:
 *                                 type: string
 *                                 description: Felhasználó megjelenítési neve
 *                             password:
 *                                 type: string
 *                                 description: Plaintext jelszó
 *                         required:
 *                             - email-address
 *                             - display-name
 *                             - password
 *         responses:
 *             "200":
 *                 description: Sikeres regisztráció
 *             "400":
 *                 description: Sikertelen regisztráció
 *             "409":
 *                 description: Már létezik ilyen felhasználó
 */
app.post("/api/register", (req, res) => {
	const email = req.body["email-address"];
	const password = req.body["password"];
	const display_name = req.body["display-name"];

	console.log(req.body);

	if (
		!email ||
		!password ||
		!display_name ||
		email.length > 256 ||
		display_name.length > 64 ||
		password.length > 128
	) {
		return res.status(400).send();
	}

	const salt = generate_salt();
	const password_hash = hash_password(password, salt);

	const [query_callback, get_error] = new_db_error_ctx();
	db.serialize(() => {
		const stmt = db.prepare(
			`INSERT INTO users (email_address, display_name, password_hash, salt, address_id) VALUES
            (?, ?, ?, ?, ?)`,
			email,
			display_name,
			password_hash,
			salt,
			null,
			query_callback
		);
		if (get_error()) {
			return res.status(400).send();
		}
		stmt.run(query_callback);
		if (get_error()) {
			return res.status(409).send();
		} else {
			return res.status(200).send();
		}
	});
});

/**
 * @swagger
 * /api/login:
 *     post:
 *         summary: Belépés
 *         tags:
 *           - Auth rendszer
 *         description: Visszaad egy tokent, ami egy bejelentkezett felhasználó munkamenetének felel meg
 *         requestBody:
 *             required: true
 *             content:
 *                 application/x-www-form-urlencoded:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             email-address:
 *                                 type: string
 *                                 description: Email cím
 *                                 example: viccelek@citromail.hu
 *                             password:
 *                                 type: string
 *                                 description: Jelszó
 *                                 example: 888888
 *                         required:
 *                             - email-address
 *                             - password
 *         security: []
 *         responses:
 *             "201":
 *                 description:
 *                     Sikeres belépés, a `LOGIN_TOKEN` sütit beállítja,
 *                     melyet a logint igénylő végpontok innentől el fognak várni
 *                 content:
 *                     text/plain:
 *                         schema:
 *                             type: string
 *                 headers:
 *                     Set-Cookie:
 *                         schema:
 *                             type: string
 *             "401":
 *                 description:
 *                     A felhasználó létezik, de hibás a jelszó
 *             "404":
 *                 description:
 *                     Nincs ilyen felhasználó
 *             "406":
 *                 description:
 *                     Nem formdata, vagy a formdata-ban a mezők nevei rosszak,
 *                     vagy túl hosszúak az adatok (init_db.js-ben vannak egyelőre
 *                     dokumentálva az email címek és jelszavak hosszai)
 *             "500":
 *                 description:
 *                     A backenden valami nagyon nem jó, ha a backendes nem béna,
 *                     ez sose történik meg
 *             "409":
 *                 description:
 *                     Ez a felhasználó már be van lépve
 */
app.post("/api/login", (req, res) => {
	const email = req.body["email-address"];
	const password = req.body["password"];

	if (!email || !password || email.length > 256 || password.length > 128)
		return res.status(406).send();

	const [set_error, get_error] = new_db_error_ctx();
	db.serialize(() => {
		// `salt`, es `stored_hash` lekerese
		const stmt = db.prepare(
			`SELECT rowid, password_hash, salt FROM users WHERE email_address = ?`,
			email,
			set_error
		);
		if (get_error()) {
			console.log(get_error());
			return res.status(500).send();
		}
		stmt.get((err, row) => {
			set_error(err);
			if (get_error()) {
				return res.status(500).send();
			}
			if (!row) {
				return res.status(404).send();
			}

			console.log(row);

			const salt = row.salt;
			const stored_hash = row.password_hash;
			const hashed_input = hash_password(password, salt);
			if (hashed_input !== stored_hash) return res.status(401).send();

			const token = generate_salt();
			if (logged_in_users.find((elem) => elem.id === row.rowid)) {
				return res.status(409).send();
			}
			logged_in_users.push({
				id: row.rowid,
				token: token,
			});
			console.log(token);
			res.cookie("LOGIN_TOKEN", token);
			return res.status(201).send(token);
		});
	});
});

/**
 * @swagger
 * /api/logout:
 *     post:
 *         summary: Kilépés
 *         tags:
 *           - Auth rendszer
 *         description: Kilépteti a bejelentkezett felhasználót
 *         security: []
 *         parameters:
 *             - name: LOGIN_TOKEN
 *               in: cookie
 *               type: string
 *               required: true
 *         responses:
 *             "200":
 *                 description:
 *                     Sikeres kilépés, kitörli a `LOGIN_TOKEN` sütit
 *             "404":
 *                 description:
 *                     Nincs ilyen belépett felhasználó
 */
app.post("/api/logout", (req, res) => {
	console.log(req.cookies);
	if (
		!req.cookies ||
		!req.cookies["LOGIN_TOKEN"] ||
		!logged_in_users.find((elem) => elem.token === req.cookies["LOGIN_TOKEN"])
	)
		return res.status(404).send();
	logged_in_users.splice(
		logged_in_users.indexOf(
			(elem) => elem.token === req.cookies["LOGIN_TOKEN"]
		),
		1
	);
	res.clearCookie("LOGIN_TOKEN");
	return res.status(200).send();
});

/**
 * @swagger
 * /api/delivery-information:
 *     put:
 *         summary: Szállítási adatok rögzítése az adatbázisba
 *         tags:
 *           - Szállítási adatok
 *         description: Rögzíti a bejelentkezett felhasználó szállítási adatait
 *         parameters:
 *             - name: LOGIN_TOKEN
 *               in: cookie
 *               type: string
 *               required: true
 *         requestBody:
 *             required: true
 *             content:
 *                 application/x-www-form-urlencoded:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             country:
 *                                 type: string
 *                                 description: Ország
 *                                 example: Szudán
 *                             county:
 *                                 type: string
 *                                 description: Megye/Állam
 *                                 example: Szabolcs-Szatmár-Bereg
 *                             city:
 *                                 type: string
 *                                 description: Város/Község
 *                                 example: Tokió
 *                             postal-code:
 *                                 type: number
 *                                 description: Postakód
 *                                 example: 4558
 *                             street-number:
 *                                 type: string
 *                                 description: Utca, házszám
 *                                 example: Ash Tree Lane 2
 *                             phone-number:
 *                                 type: string
 *                                 description: Telefonszám
 *                                 example: +36702223344
 *                             name:
 *                                 type: string
 *                                 description: Név
 *                                 example: Tóth László
 *         responses:
 *             200:
 *                 description:
 *                     Szállítási információk sikeresen beállítva
 *             403:
 *                 description:
 *                     Frontend nem küldte el a `LOGIN_TOKEN` cookie-t
 *             404:
 *                 description:
 *                     Nincs ilyen BELÉPETT felhasználó
 *             406:
 *                 description:
 *                     Nem formdata, hibás formdata, vagy a formdata-ban a mezők nevei rosszak,
 *                     vagy túl hosszúak az adatok (init_db.js-ben vannak egyelőre
 *                     dokumentálva az email címek és jelszavak hosszai)
 *             500:
 *                 description:
 *                     A backenden valami nagyon nem jó, ha a backendes nem béna,
 *                     ez sose történik meg
 */
app.put("/api/delivery-information", (req, res) => {
	if (!req.cookies) return res.status(403).send();
	const token = req.cookies["LOGIN_TOKEN"];
	const user = logged_in_users.find((elem) => elem.token === token);
	if (!user) return res.status(404).send();
	const user_id = user.id;
	const country = req.body["country"];
	const county = req.body["county"];
	const city = req.body["city"];
	const postal_code = req.body["postal-code"];
	const street_number = req.body["street-number"];
	const phone_number = req.body["phone-number"];
	const name = req.body["name"];
	if (
		!country ||
		!county ||
		!city ||
		!postal_code ||
		!street_number ||
		!phone_number ||
		!name ||
		phone_number.length > 12 ||
		country.length > 64 ||
		county.length > 128 ||
		city.length > 128 ||
		street_number.length > 128 ||
		name.length > 64 ||
		postal_code < 1
	) {
		return res.status(406).send();
	}

    db.serialize(() => {
        async_get(db, `SELECT address_id FROM users WHERE rowid = ?`, user_id)
            .then(row => {
                console.log(row);
                if (!row.address_id) {
                    console.log(`hozzaad, user id ${user_id}`);
                    // uj sor
                    async_get(db,
                        `INSERT INTO address VALUES
                        (?, ?, ?, ?, ?, ?, ?) RETURNING rowid`,
	                	country,
	                	county,
	                	city,
	                	postal_code,
	                	street_number,
	                	phone_number,
	                	name
                    )
                    .then(row => {
                        console.log(`inserted rowid ${row.rowid}`);
                        async_run(db,
                            `UPDATE users
                            SET address_id = ?
                            WHERE rowid = ?`,
                            row.rowid,
                            user_id)
                             .then(() => {
                                console.log('siker');
                                return res.status(200).send();
                            });
                    },
                    err => {
                        console.log(err);
                        return res.status(500).send();
                    });
                } else {
                    // TODO frissites
                    console.log('frissul');
                    return res.status(200).send();
                }
            },
            err => {
                console.log(err);
                return res.status(500).send();
            });
    });
});

/**
 * @swagger
 * /api/delivery-information:
 *     get:
 *         summary: Felhasználó szállítási adatainak
 *         tags:
 *           - Szállítási adatok
 *         description: Rögzíti a bejelentkezett felhasználó szállítási adatait
 *         parameters:
 *             - name: LOGIN_TOKEN
 *               in: cookie
 *               type: string
 *               required: true
 *         security: []
 *         responses:
 *             200:
 *                 content:
 *                     application/json:
 *                         schema:
 *                             type: object
 *                             properties:
 *                                 country:
 *                                     type: string
 *                                     description: Ország
 *                                 county:
 *                                     type: string
 *                                     description: Megye/Állam
 *                                 city:
 *                                     type: string
 *                                     description: Város/Község
 *                                 postal-code:
 *                                     type: number
 *                                     description: Postakód
 *                                 street-number:
 *                                     type: string
 *                                     description: Utca, házszám
 *                                 phone-number:
 *                                     type: string
 *                                     description: Telefonszám
 *                                 name:
 *                                     type: string
 *                                     description: Név
 *             403:
 *                 description:
 *                     Frontend nem küldte el a `LOGIN_TOKEN` cookie-t
 *             404:
 *                 description:
 *                     Nincs ilyen BELÉPETT felhasználó
 *             500:
 *                 description:
 *                     A backenden valami nagyon nem jó, ha a backendes nem béna,
 *                     ez sose történik meg
 */
app.get("/api/delivery-information", (req, res) => {
	if (!req.cookies || !req.cookies["LOGIN_TOKEN"]) {
		return res.status(403).send();
	}
	const user = logged_in_users.find(
		(e) => e.token === req.cookies["LOGIN_TOKEN"]
	);
	console.log(user);
	if (!user) {
		return res.status(404).send();
	}

	db.serialize(() => {
		const stmt = db.prepare(
			"SELECT * FROM address WHERE rowid = (SELECT address_id FROM users WHERE rowid = ?)",
			user.id
		);
		stmt.get((err, row) => {
			if (err) {
				console.log(err);
				return res.status(500).send();
			}
			if (!row) {
				return res.status(404).send();
			}
			rename_key(row, "postal_code", "postal-code");
			rename_key(row, "street_number", "street-number");
			rename_key(row, "phone_number", "phone-number");
			return res.status(200).json(row);
		});
	});
});

/**
 * @swagger
 * /api/products:
 *     get:
 *         summary: Termékek listázása
 *         tags:
 *           - Termékek
 *         description: Visszaadja a termékek listáját, azokhoz tartozó cikkek, képek, stb.
 *         security: []
 *         responses:
 *             200:
 *                 description:
 *                     Ez a request nem bukhat el, visszaad minden terméket a `products` táblából
 *                 content:
 *                     application/json:
 *                         schema:
 *                             type: object
 *                             properties:
 *                                 id:
 *                                     type: integer
 *                                     description: Termék ID
 *                                 name:
 *                                     type: string
 *                                     description: Termék neve
 *                                 description:
 *                                     type: string
 *                                     description: Termék leírása
 *
 *             500:
 *                 description:
 *                     Nincs a backendnek `products` táblája, futtasd az `init_db.js` scriptet!
 *                     Csak teszteléskor jöhet elő.
 */
app.get("/api/products", (req, res) => {
	db.serialize(() => {
		const stmt = db.prepare(`SELECT rowid, name, description FROM products`);
		stmt.all((err, rows) => {
			if (err) {
				console.log(err);
				return res.status(500).send();
			}

			const json = rows.map((row) => ({
				id: Number(row.rowid),
				name: row.name,
				description: row.description,
			}));
			return res.status(200).json(json);
		});
	});
});

/**
 * @swagger
 * /api/products:
 *     post:
 *         summary: Termék hozzáadása
 *         tags:
 *           - Termékek
 *         description: Visszaadja a termékek listáját, azokhoz tartozó cikkek, képek, stb.
 *         parameters:
 *             - name: LOGIN_TOKEN
 *               in: cookie
 *               type: string
 *               required: true
 *         security: []
 *         requestBody:
 *             required: true
 *             content:
 *                 application/x-www-form-urlencoded:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             name:
 *                                 type: string
 *                                 description: Termék neve
 *                                 example: Torment Nexus
 *                             description:
 *                                 type: string
 *                                 description: Termék leírása
 *                                 example: We built the Torment Nexus from the sci-fi novel Do not build the Torment Nexus
 *         responses:
 *             200:
 *                 description:
 *                     Termék sikeresen létrehozva
 *                 content:
 *                     application/json:
 *                         schema:
 *                             type: object
 *                             properties:
 *                                 id:
 *                                     type: integer
 *                                     description: Termék ID
 *                                 name:
 *                                     type: string
 *                                     description: Termék neve
 *                                 description:
 *                                     type: string
 *                                     description: Termék leírása
 *             401:
 *                 description:
 *                     Nincs belépve a felhasználó
 *                     vagy a frontend nem küldte
 *                     el a `LOGIN_TOKEN` cookie-t
 *             406:
 *                 description:
 *                     Nem formdata, hibás formdata, vagy a formdata-ban a mezők nevei rosszak,
 *                     vagy túl hosszúak az adatok (init_db.js-ben vannak egyelőre
 *                     dokumentálva mezők hosszai)
 *             500:
 *                 description:
 *                     Nincs a backendnek `products` táblája, futtasd az `init_db.js` scriptet!
 *                     Csak teszteléskor jöhet elő.
 */

/**
 * @swagger
 * /api/products:
 *      patch:
 *         summary: Termék módosítása
 *         tags:
 *           - Termékek
 */
app.patch("/api/products", (req, res) => {
	console.log(req.cookies);
	if (!req.cookies || !req.cookies["LOGIN_TOKEN"])
		return res.status(401).send();
	const user_id = logged_in_users.find(
		(elem) => elem.token === req.cookies["LOGIN_TOKEN"]
	);
	console.log(`user id ${user_id}`);
	if (!user_id) return res.status(401).send();
	const { name, description } = req.body;
	console.log(req.body);
	if (!name || !description || description.length > 512 || name.length > 64) {
		return res.status(406).send();
	}
	db.serialize(() => {
		const stmt = db.prepare(
			`UPDATE products SET 
        name =?, 
        description =?, 
        stl_file_path = "MAJD",
        display_image_file_path= "LESZ" 
      WHERE rowid =?`,
			name,
			description,
			user_id
		);
		stmt.run((err) => {
			if (err) {
				console.log(err);
				return res.status(500).send();
			}
			return res.status(200).json({ name, description });
		});
	});
});
app.post("/api/products", (req, res) => {
	console.log(req.cookies);
	if (!req.cookies || !req.cookies["LOGIN_TOKEN"])
		return res.status(401).send();
	const user_id = logged_in_users.find(
		(elem) => elem.token === req.cookies["LOGIN_TOKEN"]
	);
	console.log(`user id ${user_id}`);
	if (!user_id) return res.status(401).send();
	const { name, description } = req.body;
	console.log(req.body);
	if (!name || !description || description.length > 512 || name.length > 64) {
		return res.status(406).send();
	}
	db.serialize(() => {
		const stmt = db.prepare(
			`INSERT INTO products (
          name,
          description,
          uploader_id,
          stl_file_path,
          display_image_file_path
      ) VALUES (?, ?, ?, 'MAJD', 'LESZ') RETURNING rowid AS id, name, description`,
			name,
			description,
			user_id,
			(err) => {
				if (err) {
					console.log(err);
					return res.status(500).send();
				}
			}
		);
		stmt.get((err, row) => {
			if (err) {
				console.log(err);
				return res.status(500).send();
			}
			console.log(row);
			return res.status(201).json(row);
		});
	});
});

/** @swagger
 * /api/products/{id}:
 *     get:
 *         summary: Egy termék visszaadása
 *         tags:
 *           - Termékek
 *         description: Visszaadja a megadott termék adatait, azokhoz tartozó cikkek, képek, stb.
 *         security: []
 *         parameters:
 *             - in: path
 *               name: id
 *               schema:
 *                   type: integer
 *               required: true
 *               description: Termék ID
 *         responses:
 *             200:
 *                 description:
 *                     Egy terméknek ugyanazokat az adatait adja vissza, mint a `/api/products`
 *                 content:
 *                     application/json:
 *                         schema:
 *                             type: object
 *                             properties:
 *                                 id:
 *                                     type: integer
 *                                     description: Termék ID
 *                                 name:
 *                                     type: string
 *                                     description: Termék neve
 *                                 description:
 *                                     type: string
 *                                     description: Termék leírása
 *             404:
 *                 description:
 *                     Nincs ilyen ID!
 *             406:
 *                 description:
 *                     Rossz a path paraméter
 *             500:
 *                 description:
 *                     Nincs a backendnek `products` táblája, futtasd az `init_db.js` scriptet!
 *                     Csak teszteléskor jöhet elő.
 */
app.get("/api/products/:id", (req, res) => {
	if (!req.params.id || !PATH_ID_REGEX.test(req.params.id))
		return res.status(406).send();

	db.serialize(() => {
		const stmt = db.prepare(
			`SELECT rowid, name, description FROM products WHERE rowid = ?`,
			req.params.id
		);
		stmt.get((err, row) => {
			if (err) {
				console.log(err);
				return res.status(500).send();
			}

			if (!row) return res.status(404).send();

			return res.status(200).json({
				id: Number(row.rowid),
				name: row.name,
				description: row.description,
			});
		});
	});
});

app.listen(PORT, () => {
	console.log(`Backend fut http://127.0.0.1:${PORT}/`);
	console.log(`Swagger docs: http://127.0.0.1:${PORT}/api-docs/`);
});
