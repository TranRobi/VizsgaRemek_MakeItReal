'use strict';

import sqlite3 from 'sqlite3';
import express from 'express';
import swagger_jsdoc from 'swagger-jsdoc';
import swagger_ui from 'swagger-ui-express';
import pkg from 'body-parser';
const { urlencoded } = pkg;

const DB_NAME = 'makeitreal.db';
const PORT = 8080;
const SWAGGER_OPTS = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Make It Real API',
            description: 'Backend szolgáltatás API-ja',
            contact: {
                name: 'Zsolt Vadász',
                email: '20d_vadaszz@nyirszikszi.hu'
            }
        },
        servers: [
            {
                url: `http://localhost:${PORT}/`
            }
        ]
    },
    apis: [
        './backend.js'
    ]
};

// kenyelmi closure
const new_db_error_ctx = () => {
    let err_to_return = null;

    const error_handler = err => {
        if (err) console.log(err);
        err_to_return = err;
    };
    const getter = () => err_to_return;

    return [
        error_handler,
        getter,
    ];
};

const db = new sqlite3.Database(`./${DB_NAME}`);
const app = express();

app.use(urlencoded({ extended: true }));
app.use('/api-docs', swagger_ui.serve, swagger_ui.setup(swagger_jsdoc(SWAGGER_OPTS)));

const logged_in_users = new Map();


app.get('/', (req, res) => {
    return res.send('<h1>lol</h1>');
});

/**
 * @swagger
 * /api/register:
 *     post:
 *         summary: Regisztráció
 *         description: Beszúr egy sort a `users` táblába
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
 */
app.post('/api/register', (req, res) => {
    const email = req.body['email-address'];
    const password = req.body['password'];
    const display_name = req.body['display-name'];

    console.log(req.body);
    
    if (!email || !password || !display_name || email.length > 256 || display_name.length > 64 || password.length > 128) {
        return res.status(400).send();
    }

    const [query_callback, get_error] = new_db_error_ctx();
    db.serialize(() => {
        const stmt = db.prepare(`INSERT INTO users (email_address, display_name, password, address_id) VALUES
            (?, ?, ?, ?)`, email, display_name, password, null, query_callback);
        if (get_error()) {
            return res.status(400).send();
        }
        stmt.run(query_callback);
        if (get_error()) {
            return res.status(400).send();
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
 *         responses:
 *             "201":
 *                 description:
 *                     Sikeres belépés, a `token` sütit beállítja,
 *                     melyet a logint igénylő végpontok innentől el fognak várni
 *                 content:
 *                     text/plain:
 *                         schema:
 *                             type: string
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
app.post('/api/login', (req, res) => {
    const email = req.body['email-address'];
    const password = req.body['password'];

    if (!email || !password || email.length > 256 || password.length > 128)
        return res.status(406).send();

    const [set_error, get_error] = new_db_error_ctx();
    db.serialize(() => {
        const stmt = db.prepare(`SELECT rowid FROM users WHERE email_address = ? AND password = ?`, email, password, set_error);
        if (get_error()) {
            return res.status(500).send();
        }
        stmt.get((err, row) => {
            set_error(err);
            if (get_error()) {
                return res.status(404).send();
            }
            console.log(row);
            const token = user_token_from_credentials(email, password);
            if (logged_in_users.get(token)) {
                return res.status(409).send();
            }
            logged_in_users.set(token, row['rowid']);
            res.cookie('token', token);
            return res.status(201).send();
        });
    });

});

app.listen(PORT, () => {
    console.log(`Backend fut http://127.0.0.1:${PORT}/`);
    console.log(`Swagger docs: http://127.0.0.1:${PORT}/api-docs/`);
});
