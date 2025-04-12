"use strict";

import sqlite3 from "sqlite3";
import express from "express";
import swagger_jsdoc from "swagger-jsdoc";
import swagger_ui from "swagger-ui-express";
import body_parser from "body-parser";
const { urlencoded, json } = body_parser;
import cookie_parser from "cookie-parser";
import cors from "cors";
import multer from "multer";
import { cwd } from "node:process";

import CONFIG, { JOB_MATERIALS } from "./config.js";
import { generate_salt, hash_password } from "./secret.js";
import {
	rename_key,
	get_api_key,
	async_get,
	async_get_all,
	async_run,
	file_name_from_date,
} from "./util.js";
import { validate_delivery_information } from './validations.js';
import {
	generate_stl_thumbnail,
	convert_model_to_stl,
	get_model_price
} from "./slicer.js";
import { query_place_order } from './queries.js';

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
				apiKeyAuth: {
					type: "apiKey",
					in: "header",
					name: "LOGIN_TOKEN",
				},
			},
			schemas: {
				login_response: {
					type: "object",
					properties: {
						id: {
							type: "number",
							description: "Felhasználó ID-je",
						},
						token: {
							type: "string",
							description: "LOGIN_TOKEN Swagger miatt itt is elküldve",
						},
					},
				},
				product_post_request: {
					type: "object",
					properties: {
						name: {
							type: "string",
							description: "Termék neve",
							example: "Torment Nexus",
						},
						description: {
							type: "string",
							description: "Termék leírása",
							example:
								"We built the Torment Nexus from the sci-fi novel Do not build the Torment Nexus",
						},
						"stl-file": {
							type: "string",
							format: "binary",
						},
					},
					encoding: {
						"stl-file": {
							contentType: [
								"model/stl",
								"application/vnd.ms-pki.stl",
								"model/x.stl-ascii model/x.stl-binary",
							],
						},
					},
				},
				product_request: {
					type: "object",
					properties: {
						name: {
							type: "string",
							description: "Termék neve",
							example: "Torment Nexus",
						},
						description: {
							type: "string",
							description: "Termék leírása",
							example:
								"We built the Torment Nexus from the sci-fi novel Do not build the Torment Nexus",
						},
					},
				},
				product_response: {
					type: "object",
					properties: {
						id: {
							type: "integer",
							description: "Termék ID",
						},
						uploader_id: {
							type: "integer",
							description: "Feltöltő ID-je",
						},
						name: {
							type: "string",
							description: "Termék neve",
						},
						description: {
							type: "string",
							description: "Termék leírása",
						},
					},
				},
				order_history_element: {
					type: "object",
					properties: {
						id: {
							type: "integer",
							description: "Termék ID",
						},
						uploader_id: {
							type: "integer",
							description: "Feltöltő ID-je",
						},
						name: {
							type: "string",
							description: "Termék neve",
						},
						description: {
							type: "string",
							description: "Termék leírása",
						},
                        cost_per_piece: {
							type: "integer",
							description: "Darabár",
                        },
					},
				},
                order_history_response: {
                    type: 'array',
                    items: {
                        '$ref': '#/components/schemas/order_history_element',
                    },
                },
				delivery_information_request: {
					type: "object",
					properties: {
						country: {
							type: "string",
							description: "Ország",
							example: "Csád",
						},
						county: {
							type: "string",
							description: "Megye/Állam",
							example: "Kanto",
						},
						city: {
							type: "string",
							description: "Város",
							example: "Shenzen",
						},
						'postal-code': {
							type: "number",
							description: "Irányítószám",
							example: "6666",
						},
						"street-number": {
							type: "string",
							description: "Utca, házszám, emelet, ajtó, stb.",
							example: "308 Negra Arroyo Lane",
						},
						"phone-number": {
							type: "string",
							description: "Telefonszám",
							example: "+36701234567",
						},
						name: {
							type: "string",
							description: "Számlázási név",
							example: "John Buyer",
						},
					},
				},
                payment_information_request: {
                    type: 'object',
                    properties: {
                        'card-number': {
                            type: 'string',
                            description: 'Kártyaszám',
                            example: '1234567890123456789',
                        },
                        'cvv': {
                            type: 'string',
                            description: 'CVV',
                            example: '666',
                        },
                        'expiration-date': {
                            type: 'string',
                            description: 'Lejárati dátum (MM/YY)',
                            example: '03/28',
                        },
                    },
                },
                order_product_info: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'number',
                            description: 'Termék ID',
                            example: 1,
                        },
                        quantity: {
                            type: 'number',
                            description: 'Mennyiség',
                            example: 69,
                        },
                        material: {
                            type: 'string',
                            description: 'Anyag',
                            example: 'PLA',
                        },
                        colour: {
                            type: 'string',
                            description: 'Szín',
                            example: 'Blue',
                        },
                    },
                    required: [
                        'quantity',
                        'material',
                        'colour',
                    ],
                },
                order_request: {
                    type: 'object',
                    properties: {
						country: {
							type: "string",
							description: "Ország",
							example: "Csád",
						},
						county: {
							type: "string",
							description: "Megye/Állam",
							example: "Kanto",
						},
						city: {
							type: "string",
							description: "Város",
							example: "Shenzen",
						},
						'postal-code': {
							type: "number",
							description: "Irányítószám",
							example: "6666",
						},
						"street-number": {
							type: "string",
							description: "Utca, házszám, emelet, ajtó, stb.",
							example: "308 Negra Arroyo Lane",
						},
						"phone-number": {
							type: "string",
							description: "Telefonszám",
							example: "+36701234567",
						},
						name: {
							type: "string",
							description: "Számlázási név",
							example: "John Buyer",
						},
                        'card-number': {
                            type: 'string',
                            description: 'Kártyaszám',
                            example: '1234567890123456789',
                        },
                        'cvv': {
                            type: 'string',
                            description: 'CVV',
                            example: '666',
                        },
                        'expiration-date': {
                            type: 'string',
                            description: 'Lejárati dátum (MM/YY)',
                            example: '03/28',
                        },
                        'email-address': {
                            type: 'string',
                            description: 'E-mail cím',
                            example: 'mernok@homestead.moe',
                        },
                        products: {
                            type: 'array',
                            items: {
                                '$ref': '#/components/schemas/order_product_info',
                            },
                        },
                    },
                },
				order_response: {
					type: 'object',
					properties: {
						'card-number': {
							type: 'string',
                            description: 'Kártyaszám',
                            example: '1234567890123456789',
						},
                        name: {
							type: 'string',
                            description: 'Rendelő neve',
                            example: 'Gipsz Jakab',
						},
                        cvv: {
							type: 'string',
                            description: 'CVV kártyaszám',
                            example: '666',
						},
                        'expiration-date': {
							type: 'string',
                            description: '03/28',
                            example: 'Bankkártya lejárati dátuma',
						},
                        country: {
							type: 'string',
                            description: 'Cím ország része',
                            example: 'Csád',
						},
                        county: {
							type: 'string',
                            description: 'Cím megye/állam része',
                            example: 'Kanto',
						},
                        city: {
							type: 'string',
                            description: 'Cím város része',
                            example: 'Belgrád',
						},
                        'postal-code': {
							type: 'string',
                            description: 'Cím irányítószám része',
                            example: '6666',
						},
                        'street-number': {
							type: 'string',
                            description: 'Cím utca+házszám része',
                            example: '308 Negra Arroyo Lane',
						},
                        'phone-number': {
							type: 'string',
                            description: 'Telefonszám (szállításhoz)',
                            example: '+36701234567',
						},
                        'product-id': {
							type: 'integer',
                            description: 'Termék azonosító (null, ha egyedi rendelésst kap a backend)',
                            example: 2,
						},
                        'email-address': {
							type: 'string',
                            description: 'E-mail cím',
                            example: 'mernok@homestead.moe',
						},
                        quantity: {
							type: 'integer',
                            description: 'Rendelt mennyiség',
                            example: 5,
						},
                        material: {
							type: 'string',
                            description: 'Anyag',
                            example: 'ABS',
						},
                        colour: {
							type: 'string',
                            description: 'Szín',
                            example: 'Red',
						},
                        state: {
							type: 'string',
                            description: 'Rendelés feldolgozásának állapota',
                            example: 'pending',
						},
                        'price-per-product': {
							type: 'integer',
                            description: 'Termék darabonkénti ára',
                            example: 1000,
						},
                        'total-price': {
							type: 'integer',
                            description: 'Összár',
                            example: 10000,
						},
					},
				},
				checkout_response: {
					type: "object",
					properties: {
						id: {
							type: 'number',
							description: 'Termék ID',
							example: 1,
						},
						price: {
							type: 'number',
							description: 'Termék ára',
							example: 1000,
						},
					},
				},
			},
		},
		security: [
			{
				apiKeyAuth: [],
			},
		],
		servers: [
			{
				url: `http://localhost:${PORT}/`,
			},
		],
	},
	apis: ["./backend.js"],
};

const stl_storage = multer.diskStorage({
	destination: "./stl",
	filename: (req, file, callback) =>
		callback(null, file_name_from_date() + ".stl"),
});

const stl_upload = multer({
	storage: stl_storage,
});

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
app.use(json({ extended: true }));
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
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/login_response'
 *
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
			return res.status(201).json({ token: token, id: row.rowid });
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
 *         responses:
 *             "200":
 *                 description:
 *                     Sikeres kilépés, kitörli a `LOGIN_TOKEN` sütit
 *             "404":
 *                 description:
 *                     Nincs ilyen belépett felhasználó
 */
app.post("/api/logout", (req, res) => {
	const token = get_api_key(req);
	console.log(`token: ${token}`);
	if (!token || !logged_in_users.find((elem) => elem.token === token))
		return res.status(404).send();
	logged_in_users.splice(
		logged_in_users.indexOf((elem) => elem.token === token),
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
 *         requestBody:
 *             required: true
 *             content:
 *                 application/x-www-form-urlencoded:
 *                     schema:
 *                         $ref: '#/components/schemas/delivery_information_request'
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
	const token = get_api_key(req);
	console.log(`token: ${token}`);
	if (!token) return res.status(403).send();
	const user = logged_in_users.find((elem) => elem.token === token);
	if (!user) return res.status(404).send();
	const country = req.body["country"];
    console.log(country);
	const county = req.body["county"];
    console.log(county);
	const city = req.body["city"];
    console.log(city);
	const postal_code = req.body["postal-code"];
    console.log(postal_code);
	const street_number = req.body["street-number"];
    console.log(street_number);
	const phone_number = req.body["phone-number"];
    console.log(phone_number);
	const name = req.body["name"];
    console.log(name);
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
		async_get(db, `SELECT address_id FROM users WHERE rowid = ?`, user.id).then(
			(row) => {
				console.log(row);
				if (!row.address_id) {
					console.log(`hozzaad, user id ${user.id}`);
					// uj sor
					async_get(
						db,
						`INSERT INTO address VALUES
                        (?, ?, ?, ?, ?, ?, ?) RETURNING rowid`,
						country,
						county,
						city,
						postal_code,
						street_number,
						phone_number,
						name
					).then(
						(row) => {
							console.log(`inserted rowid ${row.rowid}`);
							async_run(
								db,
								`UPDATE users
                            SET address_id = ?
                            WHERE rowid = ?`,
								row.rowid,
								user.id
							).then(() => {
								console.log("siker");
								return res.status(200).send();
							});
						},
						(err) => {
							console.log(err);
							return res.status(500).send();
						}
					);
				} else {
					// TODO frissites
					console.log("frissul");
					async_run(
						db,
						`UPDATE address SET
                            country = ?,
                            county = ?,
                            city = ?,
                            postal_code = ?,
                            street_number = ?,
                            phone_number = ?,
                            name = ? WHERE rowid = ?`,
						country,
						county,
						city,
						postal_code,
						street_number,
						phone_number,
						name,
						row.address_id
					).then(
						() => {
							return res.status(200).send();
						},
						(err) => {
							console.log(err);
							return res.status(500).send();
						}
					);
				}
			},
			(err) => {
				console.log(err);
				return res.status(500).send();
			}
		);
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
 *         responses:
 *             200:
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/delivery_information_request'
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
	const token = get_api_key(req);
	if (!token) {
		return res.status(403).send();
	}
	const user = logged_in_users.find((e) => e.token === token);
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
 * /api/order-history:
 *     get:
 *         summary: Felhasználó előző rendelései
 *         tags:
 *           - Termékek
 *         description: Visszaadja a múltban rendelt termékek listáját, rendelt termékek mennyiségét
 *         responses:
 *             200:
 *                 description:
 *                     Visszaadja a felhasználó múltban rendelt termékeit
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/order_history_response'
 *             403:
 *                 description:
 *                     Frontend nem küldte el a `LOGIN_TOKEN` cookie-t
 *             404:
 *                 description:
 *                     Nincs ilyen BELÉPETT felhasználó
 *             500:
 *                 description:
 *                     Nincs a backendnek `products` táblája, futtasd az `init_db.js` scriptet!
 *                     Csak teszteléskor jöhet elő.
 */
app.get('/api/order-history', (req, res) => {
    const token = get_api_key(req);
    if (!token) {
        return res.status(403).send();
    }
	const user = logged_in_users.find((e) => e.token === token);
	console.log(user);
	if (!user) {
		return res.status(404).send();
	}

    db.serialize(() => {
        async_get_all(db,
            `SELECT jobs.quantity, jobs.material, jobs.state, jobs.colour, jobs.cost_per_piece, products.name, products.rowid AS product_id FROM jobs JOIN products
            ON jobs.product_id = products.rowid
            WHERE address_id = (SELECT address_id FROM users WHERE rowid = ${user.id})`
        ).then(
            rows => {
                return res.status(200).json(rows);
            },
            err => {
                return res.status(500).send();
            },
        );
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
 *                             $ref: '#/components/schemas/product_response'
 *             500:
 *                 description:
 *                     Nincs a backendnek `products` táblája, futtasd az `init_db.js` scriptet!
 *                     Csak teszteléskor jöhet elő.
 */
app.get("/api/products", (req, res) => {
	db.serialize(() => {
		const stmt = db.prepare(
			`SELECT rowid AS id, uploader_id, name, description FROM products`
		);
		stmt.all((err, rows) => {
			if (err) {
				console.log(err);
				return res.status(500).send();
			}

			return res.status(200).json(rows);
		});
	});
});

/**
 * @swagger
 * /api/products/{id}:
 *      patch:
 *         summary: Termék módosítása
 *         tags:
 *           - Termékek
 *         description: Módosít egy már létező termék sort
 *         parameters:
 *             - in: path
 *               name: id
 *               schema:
 *                   type: integer
 *               required: true
 *               description: Termék ID
 *         requestBody:
 *             required: true
 *             content:
 *                 application/x-www-form-urlencoded:
 *                     schema:
 *                         $ref: '#/components/schemas/product_request'
 *         responses:
 *             200:
 *                 description:
 *                     Termék sikeresen módosítva
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/product_response'
 *
 *             401:
 *                 description:
 *                     Nincs belépve a felhasználó
 *                     vagy a frontend nem küldte
 *                     el a `LOGIN_TOKEN` cookie-t
 *             404:
 *                 description:
 *                     Nincs ilyen ID!
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
app.patch("/api/products/:id", (req, res) => {
	const token = get_api_key(req);
	console.log(`token ${token}`);
	if (!token) return res.status(401).send();
	const user = logged_in_users.find((elem) => elem.token === token);
	if (!user) return res.status(401).send();
	console.log(`user id ${user.id}`);
	const { name, description } = req.body;
	console.log(req.body);
	if (!name || !description || description.length > 512 || name.length > 64) {
		return res.status(406).send();
	}
	db.serialize(() => {
		async_get(
			db,
			`UPDATE products SET
                name = ?,
                description = ?
            WHERE rowid = ?
            RETURNING rowid AS id, uploader_id, name, description`,
			name,
			description,
			req.params.id
		).then(
			(row) => {
				if (!row) {
					return res.status(404).send();
				}
				console.log(row);
				return res.status(201).json(row);
			},
			(err) => {
				console.log(err);
				// TODO lekezelni a különböző hibákat
				if (err === SQLITE_ERROR) {
					return res.status(500).send();
				} else {
					return res.status(500).send();
				}
			}
		);
	});
});

/**
 * @swagger
 * /api/products:
 *     post:
 *         summary: Termék hozzáadása
 *         tags:
 *           - Termékek
 *         description: Hozzáad egy terméket az adatbázishoz
 *         requestBody:
 *             required: true
 *             content:
 *                 multipart/form-data:
 *                     schema:
 *                         $ref: '#/components/schemas/product_post_request'
 *         responses:
 *             201:
 *                 description:
 *                     Termék sikeresen létrehozva
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/product_response'
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
app.post("/api/products", stl_upload.single("stl-file"), (req, res) => {
	console.log(req.file);
	console.log(req.body);
	console.log(req.cookies);
	console.log(`header token ${req.get("LOGIN_TOKEN")}`);
	if (!get_api_key(req)) return res.status(401).send();
	const user = logged_in_users.find((elem) => elem.token === get_api_key(req));
	console.log(`user ${user}`);
	if (!user) return res.status(401).send();
	const { name, description } = req.body;
	console.log(req.body);
	if (
		!name ||
		!description ||
		description.length > 512 ||
		name.length > 64 ||
		!req.file ||
		!req.file.path
	) {
		if (!req) console.log("no req");
		if (!req.file) console.log("no file");
		if (!req.file.path) console.log("aaaaaa");
		return res.status(406).send();
	}
	const stl_path = convert_model_to_stl(req.file.path);
	const thumbnail = generate_stl_thumbnail(stl_path);
	db.serialize(() => {
		async_get(
			db,
			`INSERT INTO products (
                name,
                description,
                uploader_id,
                stl_file_path,
                display_image_file_path
            ) VALUES (?, ?, ?, ?, ?)
            RETURNING rowid AS id, uploader_id, name, description
            `,
			name,
			description,
			user.id,
			stl_path,
			thumbnail
		).then(
			(row) => {
				console.log(row);
				return res.status(201).json(row);
			},
			(err) => {
				console.log(err);
				return res.status(500).send();
			}
		);
	});
});

/** @swagger
 * /api/products/images/{id}:
 *     get:
 *         summary: Egy termék képének visszaadása
 *         tags:
 *           - Termékek
 *         description: Visszaadja a megadott termék képét
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
 *                     Visszaad egy PNG képet
 *                 content:
 *                     image/png:
 *                         type: string
 *                         format: binary
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
app.get("/api/products/images/:id", (req, res) => {
	if (!req.params.id || !PATH_ID_REGEX.test(req.params.id))
		return res.status(406).send();
	console.log(req.params.id);

	db.serialize(() => {
		async_get(
			db,
			`SELECT display_image_file_path AS thumbnail FROM products
            WHERE rowid = ?`,
			req.params.id
		).then(
			(row) => {
				console.log(row);
				if (!row) return res.status(500).send();
				return res.status(200).sendFile(row.thumbnail, {
					root: cwd(),
				});
			},
			(err) => {
				return res.status(404).send();
			}
		);
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
 *                             $ref: '#/components/schemas/product_response'
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
			`SELECT rowid, name, uploader_id, description FROM products WHERE rowid = ?`,
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

/**
 * @swagger
 * /api/checkout:
 *      put:
 *         summary: Termék módosítása
 *         tags:
 *           - Rendelés
 *         description: Lekéri a kosárban levő termékek árait
 *         requestBody:
 *             required: true
 *             content:
 *                 application/json:
 *                     schema:
 *                         type: array
 *                         items:
 *                             type: object
 *                             properties:
 *                                 id:
 *                                     type: integer
 *                                 material:
 *                                     type: string
 *                                 quantity:
 *                                     type: integer
 *                         required:
 *                             - id
 *                             - material
 *                             - quantity
 *                         description: Szükséges adatok a kosár elemeiből
 *                         example:
 *                             - id: 1
 *                               material: 'PLA'
 *                               quantity: 3
*                             - id: 3
 *                               material: 'PETG'
 *                               quantity: 1
 *                             - id: 4
 *                               material: 'ABS'
 *                               quantity: 2
 *         responses:
 *             200:
 *                 description:
 *                     Termék sikeresen módosítva
 *                 content:
 *                     application/json:
 *                         schema:
 *                             type: array
 *                             items:
 *                                 $ref: '#/components/schemas/checkout_response'
 *             404:
 *                 description:
 *                     Az egyik ID nem létező termékre utal!
 *             406:
 *                 description:
 *                     Nem JSON, hibás JSON
 *             500:
 *                 description:
 *                     Nincs a backendnek `products` táblája, futtasd az `init_db.js` scriptet!
 *                     Csak teszteléskor jöhet elő.
 */
app.put('/api/checkout', (req, res) => {
	const token = get_api_key(req);
	const user = logged_in_users.find(elem => elem.token === get_api_key(req));
	const is_guest = user === undefined;

	if (!req.body || req.body.length === 0) {
		return res.status(406).send();
	}

    const cart_contents = req.body.map(elem => ({
        id: Number(elem.id),
        material: elem.material.toUpperCase(),
        quantity: Number(elem.quantity),
    }));

	cart_contents.forEach(elem => {
		if (!Number.isInteger(elem.id) ||
            !Number.isInteger(elem.quantity) ||
            !Object.values(JOB_MATERIALS).includes(elem.material)) {
			return res.status(406).send();
		}
	});
    const product_ids = cart_contents.map(e => e.id);


	async_get_all(
		db,
		`SELECT rowid, stl_file_path FROM products WHERE rowid IN (${product_ids.join(',')})`
	).then(	
		rows => {
			if (rows.length !== cart_contents.length) {
				return res.status(404).send();
			}
			const response_promise = (id, stl_path, material) => new Promise(async (resolve, reject) => {
				const price = await get_model_price(stl_path, material);
				if (price === -1) {
					console.log('error');
					console.log(price);
					reject({});
				}
				resolve({price: price, id: id});
			});

			Promise.all(
                rows.map(
                    row => response_promise(
                        row.rowid,
                        row.stl_file_path,
                        // A sorok sorrendje lehet más lenne, mint a request-ben
                        // levő azonosítóké, így viszont garantált a működés
                        cart_contents.find(e => e.id === row.rowid).material
                    )
                )
            ).then(
				prices => {
					return res.status(200).json(prices);
				},
				err => {
					console.log(err);
					return res.status(500).send();
				}
			);
		},
		err => {
			console.log(err);
			return res.status(500).send();
		}
	)
});

/** @swagger
 * /api/order:
 *     post:
 *         summary: Egy feltöltött termék megrendelése
 *         tags:
 *             - Rendelés
 *         description:
 *             Vendég/belépett felhasználó megrendelhet egy az oldalra feltöltött terméket
 *         requestBody:
 *             required: false
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: '#/components/schemas/order_request'
 *         responses:
 *             201:
 *                 description:
 *                     Sikeres rendelés
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/order_response'
 *             404:
 *                 description:
 *                     Nincs ilyen termék!
 *             401:
 *                 description:
 *                     Nem vendégként rendelt, de még vannak hiányzó adatok (fizetés, szállítás)
 *             406:
 *                 description:
 *                     Vendégként rendelt, de nem küldött el minden szükséges adatot, vagy szimplán rossz a formdata
 *             500:
 *                 description:
 *                     A backenden valami nagyon nem jó, ha a backendes nem béna,
 *                     ez sose történik meg
 */
app.post('/api/order', (req, res) => {
    const token = get_api_key(req);
	const user = logged_in_users.find((e) => e.token === token);
	console.log(`user: ${user}`);

    if (!req.body || !req.body['products'])
        return res.status(406).send('No products in request body');

    const products = req.body.products;
    console.log(products);
    const product_ids = products.map(p => p.id);
    for (const id of product_ids) {
        if (id <= 0 || !Number.isInteger(id)) {
            return res.status(406).send(`Invalid id ${id}!`);
        }
    }

    async_get_all(
        db,
        `SELECT rowid, stl_file_path FROM products WHERE rowid IN (${product_ids.join(',')})`
    ).then(
        rows => {
            products.forEach(p => {
                const match = rows.find(e => e.rowid === p.id);
                p.stl_path = match.stl_file_path;
            });
            return query_place_order(db, req, res, user, products);
        },
        err => {
            console.log(err);
            return res.status(404).send();
        },
    );
});

app.listen(PORT, () => {
	console.log(`Backend fut http://127.0.0.1:${PORT}/`);
	console.log(`Swagger docs: http://127.0.0.1:${PORT}/api-docs/`);
});
