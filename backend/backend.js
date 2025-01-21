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

app.get('/', (req, res) => {
    res.send('<h1>lol</h1>');
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
            res.status(400).send();
            return;
        }
        stmt.run(query_callback);
        if (get_error()) {
            res.status(400).send();
        } else {
            res.status(200).send();
        }
    });
});

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
 *                 description: Sikeres belépés
 *                 content:
 *                     text/plain:
 *                         schema:
 *                             type: string
 *             "400":
 *                 description:
 *                     Nem formdata, vagy a formdata-ban a mezők nevei rosszak,
 *                     vagy nem rendes email cím lett küldve
 */
app.post('/api/login', (req, res) => {
    const email = req.body['email-address'];
    const password = req.body['password'];
});

app.listen(PORT, () => {
    console.log(`Backend fut http://127.0.0.1:${PORT}/`);
    console.log(`Swagger docs: http://127.0.0.1:${PORT}/api-docs/`);
});
