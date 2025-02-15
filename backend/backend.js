"use strict";

import sqlite3 from "sqlite3";
import express from "express";
import swagger_jsdoc from "swagger-jsdoc";
import swagger_ui from "swagger-ui-express";
import body_parser from "body-parser";
const { urlencoded } = body_parser;
import cookie_parser from "cookie-parser";
import cors from "cors";

import CONFIG from './config.js';
import { generate_salt, hash_password } from './secret.js';

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

const PATH_ID_REGEX = new RegExp('^[0-9]+$');

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

// TODO valami hashelos token generalas kellene
const user_token_from_credentials = (email, password) => password + email;

/**
 * @swagger
 * /api/login:
 *     post:
 *         summary: Belépés
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
 *                             password:
 *                                 type: string
 *                                 description: Jelszó
 *                         required:
 *                             - email-address
 *                             - password
 *         security: []
 *         responses:
 *             "201":
 *                 description:
 *                     Sikeres belépés, a `LOGIN_TOKEN` sütit beállítja,
 *                     melyet a logint igénylő végpontok innentől el fognak várni
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
            if (hashed_input !== stored_hash)
                return res.status(401).send();

            const token = generate_salt();
		    if (logged_in_users.find(elem => elem.id === row.rowid)) {
		    	return res.status(409).send();
		    }
		    logged_in_users.push({
                id: row.rowid,
                token: token
            });
            console.log(token);
		    res.cookie("LOGIN_TOKEN", token);
		    return res.status(201).send();
        });
	});
});

/**
 * @swagger
 * /api/logout:
 *     post:
 *         summary: Kilépés
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
app.post('/api/logout', (req, res) => {
    console.log(req.cookies);
    if (!req.cookies || !req.cookies['LOGIN_TOKEN'] || !logged_in_users.find(elem => elem.token === req.cookies['LOGIN_TOKEN']))
        return res.status(404).send();
    logged_in_users.splice(logged_in_users.indexOf(elem => elem.token === req.cookies['LOGIN_TOKEN']), 1);
    res.clearCookie('LOGIN_TOKEN');
    return res.status(200).send();
});

/**
 * @swagger
 * /api/delivery-information:
 *     post:
 *         summary: Szállítási adatok rögzítése az adatbázisba
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
 *                             county:
 *                                 type: string
 *                                 description: Megye/Állam
 *                             city:
 *                                 type: string
 *                                 description: Város/Község
 *                             postal-code:
 *                                 type: number
 *                                 description: Postakód
 *                             street-number:
 *                                 type: string
 *                                 description: Utca, házszám
 *                             phone-number:
 *                                 type: string
 *                                 description: Telefonszám
 *                             name:
 *                                 type: string
 *                                 description: Név
 *         responses:
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
app.post("/api/delivery-information", (req, res) => {
	if (!req.cookies) return res.status(403).send();
	const token = req.cookies["LOGIN_TOKEN"];
	const user = logged_in_users.find(elem => elem.token === token);
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
		country.length > 64 ||
		county.length > 128 ||
		city.length > 128 ||
		street_number.length > 128 ||
		name.length > 64 ||
		postal_code < 1
	) {
		return res.status(406).send();
	}

	const [set_error, get_error] = new_db_error_ctx();
	db.serialize(() => {
		let stmt = db.prepare(
			`INSERT INTO address VALUES
            (?, ?, ?, ?, ?, ?, ?) RETURNING rowid`,
			country,
			county,
			city,
			postal_code,
			street_number,
			phone_number,
			name,
			set_error
		);
		if (get_error()) {
			return res.status(500).send();
		}
		let address_id = undefined;
		stmt.get((err, row) => {
			if (err) {
				console.log(err);
				return res.status(500).send();
			}
			address_id = row.rowid;
		});
		// frissitjuk a users tablat
		stmt = db.prepare(
			`UPDATE users
            SET address_id = ?
            WHERE rowid = ?`,
			address_id,
			user_id
		);
		stmt.run(set_error);
		if (get_error()) return res.status(500).send();
		else return res.status(201).send();
	});
});

/**
 * @swagger
 * /api/products:
 *     get:
 *         summary: Termékek listázása
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
app.get('/api/products', (req, res) => {
    db.serialize(() => {
        const stmt = db.prepare(`SELECT rowid, name, description FROM products`);
        stmt.all((err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).send();
            }

            const json = rows.map(row => ({
                id: Number(row.rowid),
                name: row.name,
                description: row.description
            }));
            return res.status(200).json(json);
        });
    });
});

/** @swagger
 * /api/products/{id}:
 *     get:
 *         summary: Egy termék visszaadása
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
app.get('/api/products/:id', (req, res) => {
    if (!req.params.id || !PATH_ID_REGEX.test(req.params.id))
        return res.status(406).send();

    db.serialize(() => {
        const stmt = db.prepare(`SELECT rowid, name, description FROM products WHERE rowid = ?`, req.params.id);
        stmt.get((err, row) => {
            if (err) {
                console.log(err);
                return res.status(500).send();
            }

            if (!row)
                return res.status(404).send();

            return res.status(200).json({
                id: Number(row.rowid),
                name: row.name,
                description: row.description
            });
        });
    });
});

app.listen(PORT, () => {
	console.log(`Backend fut http://127.0.0.1:${PORT}/`);
	console.log(`Swagger docs: http://127.0.0.1:${PORT}/api-docs/`);
});
