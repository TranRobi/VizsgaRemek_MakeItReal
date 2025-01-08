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
                url: `http://localhost:${PORT}/api`
            }
        ]
    },
    apis: [
        './backend.js'
    ]
};

const db = new sqlite3.Database(`./${DB_NAME}`);
const app = express();

app.use(urlencoded({ extended: true }));
app.use('/api', swagger_ui.serve, swagger_ui.setup(swagger_jsdoc(SWAGGER_OPTS)));

app.get('/', (req, res) => {
    res.send('<h1>lol</h1>');
});

app.post('/api/register', (req, res) => {
    const email = req.body.email-address;
    const password = req.body.password;
    const display_name = req.body.display-name;
    
    if (!email || !password || !display_name) {
        return res.status(400).send();
    }
    res.status(200).send();
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
    const email = req.body.email-address;
    const password = req.body.password;
});

app.listen(PORT, () => {
    console.log('Backend fut');
});
