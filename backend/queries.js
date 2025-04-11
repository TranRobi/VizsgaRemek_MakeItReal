import { async_get, file_name_from_date, first_letter_uppercase } from './util.js';
import { slice_stl_to_gcode, get_gcode_price } from './slicer.js';
import { JOB_COLOURS, JOB_MATERIALS, JOB_STATES } from "./config.js";
import { existsSync, unlinkSync } from 'node:fs';

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

export const query_insert_delivery_info = (
    db,
    country,
    county,
    city,
    postal_code,
    street_number,
    phone_number,
    name
) => new Promise((resolve, reject) => {
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
        console.log('rossz inputok query_insert_delivery_info()-ba');
		reject(undefined);
	}

    async_get(
        db,
        `INSERT INTO address VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING rowid, *`,
        country,
        county,
        city,
        postal_code,
        street_number,
        phone_number,
        name
    ).then(
        row => {
            resolve(row);
        },
        err => {
            console.log(err);
            reject(undefined);
        },
    );
});

export const query_insert_payment_info = (
    db,
    card_name,
    card_number,
    cvv,
    expiration_date
) => new Promise((resolve, reject) => {
    if (!expiration_date ||
        !card_name ||
        !cvv ||
        !card_number ||
        !expiration_date.match(/[0-9]{2}\/[0-9]{2}/) ||
        card_number.length > 19 ||
        card_name.length > 64 ||
        cvv.length > 4) {
        reject(undefined);
    }
    const expiration_month = expiration_date.split('/')[0];
    const expiration_year = expiration_date.split('/')[1];
    async_get(
        db,
        `INSERT INTO payment_info VALUES
        (?, ?, ?, ?, ?)
        RETURNING rowid, *`,
        card_number,
        card_name,
        cvv,
        expiration_year,
        expiration_month
    ).then(
        row => {
            resolve(row);
        },
        err => {
            console.log(err);
            reject(undefined);
        }
    );
});

export const query_insert_job = (
    db,
    product_id,
    email_address,
    payment_info_id,
    address_id,
    gcode_file_path,
    quantity,
    material,
    colour,
    state
) => new Promise((resolve, reject) => {
    if (!payment_info_id || !address_id || !email_address || !colour || !material || !quantity || !state) {
        return reject(new Error('hibas adatok'));
    }
    state = state.toLowerCase();
    if (!Object.values(JOB_COLOURS).map(c => c.toLowerCase()).includes(colour.toLowerCase())) {
        return reject(new Error('rossz colour'));
    }
    if (!Object.values(JOB_MATERIALS).map(m => m.toLowerCase()).includes(material.toLowerCase())) {
        return reject(new Error('rossz material'));
    }
    if (quantity <= 0 || !Number.isInteger(quantity)) {
        return reject(new Error('rossz quantity'));
    }
    if (!existsSync(gcode_file_path)) {
        return reject(new Error('nem letezo gcode'));
    }
    if (!Object.values(JOB_STATES).includes(state)) {
        return reject(new Error('rossz state'));
    }

    async_get(
        db,
        `INSERT INTO jobs
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING rowid, *`,
        product_id, email_address, payment_info_id,
        address_id, gcode_file_path, quantity,
        material.toUpperCase(),
        first_letter_uppercase(colour),
        state
    ).then(
        row => {
            return resolve(row);
        },
        err => {
            return reject(err);
        },
    );
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

        // guest dolgait eltárolni, hogy meg is legyen a rendelés
        query_insert_delivery_info(
            db, country, county,
            city, postal_code,
            street_number,
            phone_number,
            name
        ).then(
            delivery_info => {
                console.log(delivery_info);
                query_insert_payment_info(
                    db, name, card_number,
                    cvv, expiration_date
                ).then(
                    payment_info => {
                        console.log(payment_info);
                        slice_stl_to_gcode(stl_path, gcode_file_path);
                        get_gcode_price(gcode_file_path, material).then(
                            price => {
                                if (price === -1) {
                                    console.log('Nem sikerült kiszámolni a gcode árát!');
                                    return res.status(500).send();
                                }
                                console.log(price);
                                query_insert_job(
                                    db,
                                    req.params.id,
                                    email_address,
                                    payment_info.rowid,
                                    delivery_info.rowid,
                                    gcode_file_path,
                                    quantity,
                                    material,
                                    colour,
                                    'pending'
                                ).then(
                                    job => {
                                        return res.status(201).json({
                                            'card-number': payment_info.card_number,
                                            name: payment_info.card_name,
                                            cvv: payment_info.cvv,
                                            'expiration-date': payment_info.expiration_month +
                                                '/' +
                                                payment_info.expiration_year,
                                            country: delivery_info.country,
                                            county: delivery_info.county,
                                            city: delivery_info.city,
                                            'postal-code': delivery_info.postal_code,
                                            'street-number': delivery_info.street_number,
                                            'phone-number': delivery_info.phone_number,
                                            'product-id': product_id,
                                            'email-address': email_address,
                                            quantity: quantity,
                                            material: material,
                                            colour: colour,
                                            state: job.state,
                                            'price-per-product': price,
                                            'total-price': price * quantity,
                                        });
                                    },
                                    err => {
                                        console.log('job insert buko');
                                        console.log(err);
                                        unlinkSync(gcode_file_path);
                                        return res.status(500).send();
                                    }
                                );
                            },
                            err => {
                                console.log('get_gcode_price buko');
                                console.log(err);
                                return res.status(500).send();
                            }
                        );
                    },
                    fail => {
                        console.log('payment insert buko');
                        return res.status(500).send();
                    }
                );
            },
            fail => {
                console.log('delivery insert buko');
                return res.status(500).send();
            }
        );

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
