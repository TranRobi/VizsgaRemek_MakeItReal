import { async_get, file_name_from_date, first_letter_uppercase } from './util.js';
import { slice_stl_to_gcode } from './slicer.js';
import { JOB_COLOURS, JOB_MATERIALS } from "./config.js";
import { existsSync } from 'node:fs';

export const query_user_address_id = (db, user) => new Promise((resolve, reject) => {
    db.serialize(() => {
        const stmt = db.prepare(`
            SELECT address_id FROM users WHERE rowid = ?
        `,
        user,
        err => reject(err));
        stmt.get((err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
});

export const query_place_order = (db, req, res, user, stl_path, product_id) => {
    const is_guest = user === undefined;

    const colour = req.body['colour'];
    const material = req.body['material'];
    const quantity = Number(req.body['quantity']);

    if (!colour || !material || !quantity) {
        return res.status(406).send('Missing parameter!');
    }
    if (!Object.values(JOB_COLOURS).map(c => c.toLowerCase()).includes(colour.toLowerCase())) {
        return res.status(406).send(`Invalid colour ${colour}!`);
    }
    if (!Object.values(JOB_MATERIALS).map(m => m.toLowerCase()).includes(material.toLowerCase())) {
        return res.status(406).send(`Invalid material ${material}!`);
    }
    if (quantity <= 0 || !Number.isInteger(quantity)) {
        return res.status(406).send(`Invalid quantity ${quantity}!`);
    }
    if (!existsSync(stl_path)) {
        return res.status(404).send();
    }

    const gcode_file_path = `./gcode/${file_name_from_date()}.gcode`;

    if (is_guest) {
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
        const card_number = req.body['card-number'];
        const cvv = req.body['cvv'];
        const expiration_date = req.body['expiration-date'];
        const email_address = req.body['email-address'];
    } else {
        async_get(
            db,
            `SELECT payment_info.rowid AS payment_info_id, address.rowid AS address_id, users.email_address AS email_address
            FROM users
            JOIN address ON users.address_id = address.rowid
            JOIN payment_info ON users.payment_info_id = payment_info.rowid
            WHERE users.rowid = ?`,
            user.id)
            .then(
                row => {
                    if (!row.payment_info_id) {
                        console.log('No payment information set!');
                        return res.status(401).send("No payment information set!");
                    }
                    if (!row.address_id) {
                        console.log('No delivery information set!');
                        return res.status(401).send("No delivery information set!");
                    }

                    slice_stl_to_gcode(stl_path, gcode_file_path);

                    async_get(
                        db,
                        `INSERT INTO jobs
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        product_id, row.email_address, row.payment_info_id,
                        row.address_id, gcode_file_path, quantity,
                        material.toUpperCase(),
                        first_letter_uppercase(colour),
                        'pending'
                    ).then(
                        () => {
                            return res.status(201).send();
                        },
                        err => {
                            console.log(err);
                            return res.status(500).send();
                        },
                    );
                },
                err => {
                    console.log(err);
                    return res.status(500).send();
                }
        );
    }
};
