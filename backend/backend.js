'use strict';

import sqlite3 from 'sqlite3';
import express from 'express';
import pkg from 'body-parser';
const { urlencoded } = pkg;

const DB_NAME = 'makeitreal.db';
const PORT = 8080;

const db = new sqlite3.Database(`./${DB_NAME}`);
const app = express();

app.use(urlencoded({ extended: true }));

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

app.listen(PORT, () => {
    console.log('Backend fut');
});
