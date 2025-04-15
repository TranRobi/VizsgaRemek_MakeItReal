import {
  async_get,
  async_get_all,
  async_run,
  file_name_from_date,
  first_letter_uppercase,
} from "./util.js";
import { generate_salt, hash_password } from "./secret.js";
import { slice_stl_to_gcode, get_gcode_price } from "./slicer.js";
import { JOB_COLOURS, JOB_MATERIALS, JOB_STATES } from "./config.js";
import { existsSync, unlinkSync } from "node:fs";
import { unlink } from 'node:fs/promises';

export const query_user_address_id = (db, user) =>
  new Promise((resolve, reject) => {
    db.serialize(() => {
      const stmt = db.prepare(
        `
            SELECT address_id FROM users WHERE rowid = ?
        `,
        user,
        (err) => reject(err)
      );
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
) =>
  new Promise((resolve, reject) => {
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
      console.log("rossz inputok query_insert_delivery_info()-ba");
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
      (row) => {
        resolve(row);
      },
      (err) => {
        console.log(err);
        reject(undefined);
      }
    );
  });

export const query_insert_payment_info = (
  db,
  card_name,
  card_number,
  cvv,
  expiration_date
) =>
  new Promise((resolve, reject) => {
    if (
      !expiration_date ||
      !card_name ||
      !cvv ||
      !card_number ||
      !expiration_date.match(/[0-9]{2}\/[0-9]{2}/) ||
      card_number.length > 19 ||
      card_name.length > 64 ||
      cvv.length > 4
    ) {
      console.log("ROSSZ PAYMENT INFO");
      reject(new Error("Rossz payment info"));
    }
    const expiration_month = expiration_date.split("/")[0];
    const expiration_year = expiration_date.split("/")[1];
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
      (row) => {
        resolve(row);
      },
      (err) => {
        console.log(err);
        reject(undefined);
      }
    );
  });

const query_get_product_stl_file = (db, product_id) =>
  new Promise((resolve, reject) => {
    async_get(
      db,
      `SELECT stl_file_path FROM products WHERE rowid = ?`,
      product_id
    ).then(
      (row) => resolve(row.stl_file_path),
      (err) => reject(err)
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
  state,
  cost_per_piece
) =>
  new Promise((resolve, reject) => {
    if (
      !payment_info_id ||
      !address_id ||
      !email_address ||
      !colour ||
      !material ||
      !quantity ||
      !state
    ) {
      return reject(new Error("hibas adatok"));
    }
    state = state.toLowerCase();
    if (
      !Object.values(JOB_COLOURS)
        .map((c) => c.toLowerCase())
        .includes(colour.toLowerCase())
    ) {
      return reject(new Error(`rossz colour ${colour.toLowerCase()}`));
    }
    if (
      !Object.values(JOB_MATERIALS)
        .map((m) => m.toLowerCase())
        .includes(material.toLowerCase())
    ) {
      return reject(new Error(`rossz material ${material}`));
    }
    if (quantity <= 0 || !Number.isInteger(quantity)) {
      return reject(new Error(`rossz quantity ${quantity}`));
    }
    if (cost_per_piece <= 0 || !Number.isInteger(cost_per_piece)) {
      return reject(new Error(`rossz cost_per_piece ${cost_per_piece}`));
    }
    if (!existsSync(gcode_file_path)) {
      return reject(new Error("nem letezo gcode"));
    }
    if (!Object.values(JOB_STATES).includes(state)) {
      return reject(new Error(`rossz state ${state}`));
    }

    async_get(
      db,
      `INSERT INTO jobs
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING rowid, *`,
      product_id,
      email_address,
      payment_info_id,
      address_id,
      gcode_file_path,
      quantity,
      material.toUpperCase(),
      first_letter_uppercase(colour),
      state,
      cost_per_piece
    ).then(
      (row) => {
        return resolve(row);
      },
      (err) => {
        return reject(err);
      }
    );
  });

export const query_place_order = (db, req, res, user, products) => {
  const is_guest = user === undefined;

  const colour = req.body["colour"];
  const material = req.body["material"];
  const quantity = Number(req.body["quantity"]);
  const name = req.body["name"];
  const card_number = req.body["card-number"];
  const cvv = req.body["cvv"];
  const expiration_date = req.body["expiration-date"];

  for (const p of products) {
    if (!p.colour || !p.material || !p.quantity) {
      return res.status(406).send("Missing parameter!");
    }
    if (
      !Object.values(JOB_COLOURS)
        .map((c) => c.toLowerCase())
        .includes(p.colour.toLowerCase())
    ) {
      return res.status(406).send(`Invalid colour ${colour}!`);
    }
    if (
      !Object.values(JOB_MATERIALS)
        .map((m) => m.toLowerCase())
        .includes(p.material.toLowerCase())
    ) {
      return res.status(406).send(`Invalid material ${material}!`);
    }
    if (p.quantity <= 0 || !Number.isInteger(p.quantity)) {
      return res.status(406).send(`Invalid quantity ${quantity}!`);
    }
    if (!existsSync(p.stl_path)) {
      return res.status(404).send();
    }
  }
  console.log("product checkek");

  query_insert_payment_info(db, name, card_number, cvv, expiration_date).then(
    (payment_info) => {
      console.log("payment info");
      console.log(payment_info);
      if (is_guest) {
        console.log("vendég");
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
        const email_address = req.body["email-address"];

        // guest dolgait eltárolni, hogy meg is legyen a rendelés
        query_insert_delivery_info(
          db,
          country,
          county,
          city,
          postal_code,
          street_number,
          phone_number,
          name
        ).then(
          (delivery_info) => {
            console.log(delivery_info);
            console.log(payment_info);
            Promise.all(
              products.map(
                (product) =>
                  new Promise((resolve, reject) => {
                    const gcode_file_path = `./gcode/${file_name_from_date()}.gcode`;
                    slice_stl_to_gcode(product.stl_path, gcode_file_path);
                    get_gcode_price(gcode_file_path, product.material).then(
                      (price) => {
                        if (price === -1) {
                          console.log("Nem sikerült kiszámolni a gcode árát!");
                          reject(
                            new Error(
                              `nem sikerült kiszámolni a gcode árát ${product.stl_path} filenak`
                            )
                          );
                        }
                        console.log(`price ${price}`);
                        query_insert_job(
                          db,
                          product.id,
                          email_address,
                          payment_info.rowid,
                          delivery_info.rowid,
                          gcode_file_path,
                          product.quantity,
                          product.material.toUpperCase(),
                          product.colour,
                          "pending",
                          price
                        ).then(
                          (job) => {
                            resolve({
                              quantity: product.quantity,
                              material: product.material,
                              colour: product.colour,
                              state: job.state,
                              "product-id": product.id,
                              "price-per-product": price,
                              "total-price": price * product.quantity,
                            });
                          },
                          (err) => {
                            console.log("job insert buko");
                            unlinkSync(gcode_file_path);
                            reject(err);
                          }
                        );
                      },
                      (err) => {
                        console.log("get_gcode_price buko");
                        unlinkSync(gcode_file_path);
                        reject(err);
                      }
                    );
                  })
              )
            ).then(
              (jobs) => {
                return res.status(201).json({
                  "card-number": payment_info.card_number,
                  name: payment_info.card_name,
                  cvv: payment_info.cvv,
                  "expiration-date":
                    payment_info.expiration_month +
                    "/" +
                    payment_info.expiration_year,
                  country: delivery_info.country,
                  county: delivery_info.county,
                  city: delivery_info.city,
                  "postal-code": delivery_info.postal_code,
                  "street-number": delivery_info.street_number,
                  "phone-number": delivery_info.phone_number,
                  "email-address": email_address,
                  jobs: jobs,
                });
              },
              (err) => {
                console.log(err);
                return res.status(500).send();
              }
            );
          },
          (err) => {
            console.log(err);
            console.log("delivery insert buko");
            return res.status(500).send();
          }
        );
      } else {
        console.log("nem guest");
        async_get(
          db,
          `SELECT address.rowid AS address_id,
                        users.email_address AS email_address,
                        address.country, address.county, address.city,
                        address.postal_code, address.street_number, address.phone_number
                    FROM users
                    JOIN address ON users.address_id = address.rowid
                    WHERE users.rowid = ?`,
          user.id
        ).then((row) => {
          console.log("user adatok");
          console.log(row);
          Promise.all(
            products.map(
              (product) =>
                new Promise((resolve, reject) => {
                  const gcode_file_path = `./gcode/${file_name_from_date()}.gcode`;
                  slice_stl_to_gcode(product.stl_path, gcode_file_path);
                  get_gcode_price(gcode_file_path, product.material).then(
                    (price) => {
                      if (price === -1) {
                        console.log("Nem sikerült kiszámolni a gcode árát!");
                        reject(
                          new Error(
                            `nem sikerült kiszámolni a gcode árát ${product.stl_path} filenak`
                          )
                        );
                      }
                      console.log(price);
                      query_insert_job(
                        db,
                        product.id,
                        row.email_address,
                        payment_info.rowid,
                        row.address_id,
                        gcode_file_path,
                        product.quantity,
                        product.material.toUpperCase(),
                        product.colour,
                        "pending",
                        price
                      ).then(
                        (job) => {
                          resolve({
                            quantity: product.quantity,
                            material: product.material,
                            colour: product.colour,
                            "product-id": product.id,
                            state: job.state,
                            "price-per-product": price,
                            "total-price": price * product.quantity,
                          });
                        },
                        (err) => {
                          console.log("job insert buko");
                          unlinkSync(gcode_file_path);
                          reject(err);
                        }
                      );
                    },
                    (err) => {
                      console.log("get_gcode_price buko");
                      unlinkSync(gcode_file_path);
                      reject(err);
                    }
                  );
                })
            )
          ).then(
            (jobs) => {
              return res.status(201).json({
                "card-number": payment_info.card_number,
                name: payment_info.card_name,
                cvv: payment_info.cvv,
                "expiration-date": expiration_date,
                country: row.country,
                county: row.county,
                city: row.city,
                "postal-code": row.postal_code,
                "street-number": row.street_number,
                "phone-number": row.phone_number,
                "email-address": row.email_address,
                jobs: jobs,
              });
            },
            (err) => {
              console.log(err);
              return res.status(500).send();
            }
          );
        });
      }
    },
    (err) => {
      console.log(err);
      return res.status(406);
    }
  );
};

export const query_get_user_by_email = (db, email) => new Promise((resolve, reject) => {
    async_get(
        db,
        `SELECT rowid FROM users WHERE email_address = ?`,
        email
    ).then(
        row => resolve(row),
        err => reject(err),
    );
});

export const query_insert_user = (db, email, display_name, password) => new Promise((resolve, reject) => {
  const salt = generate_salt();
  const password_hash = hash_password(password, salt);
  async_get(
      db,
      `INSERT INTO users (email_address, display_name, password_hash, salt, address_id) VALUES
      (?, ?, ?, ?, ?) RETURNING email_address, display_name`,
      email,
      display_name,
      password_hash,
      salt,
      null
  ).then(
      row => resolve(row),
      err => reject(err)
  );
});

export const query_get_user_statistics = (db, user_id) => new Promise((resolve, reject) => {
    async_get_all(
        db,
        `SELECT product_id, quantity, cost_per_piece FROM jobs
         WHERE product_id IN (
            SELECT rowid FROM products WHERE uploader_id = ?
         )`,
        user_id
    ).then(
        rows => {
            console.log(rows);
            let total = 0;
            let user_earnings = 0;
            const product_count = rows.reduce((accum, row) => accum += row.quantity, 0);
            for (const row of rows) {
                total += row.quantity * row.cost_per_piece;
                // profit 40%-a jar a usernek
                user_earnings = Math.round(row.quantity * row.cost_per_piece / 1.5 * 1.2);
            }
            resolve({
                'product-count': product_count,
                'user-earnings': user_earnings,
                total: total
            });
        },
        err => reject(err)
    );
});

const query_delete_products_by_user = (db, user_id) => new Promise((resolve, reject) => {
    async_get_all(
        db,
        `DELETE FROM products
         WHERE uploader_id = ?
         RETURNING stl_file_path, display_image_file_path`,
        user_id
    ).then(
        rows => {
            console.log(rows);
            // Ez a szörnyeteg kitöröl minden STL és PNG fájlt, amiket eltároltunk
            Promise.all(rows.map(row => unlink(row.stl_file_path)).concat(rows.map(row => unlink(row.display_image_file_path)))).then(
                success => resolve(true),
                err => reject(err)
            );
        },
    );
});

export const query_delete_user = (db, user_id) => new Promise((resolve, reject) => {
    query_delete_products_by_user(db, user_id).then(
        () => {
            async_run(
                db,
                `DELETE FROM users WHERE rowid = ?`,
                user_id
            ).then(
                () => resolve(true),
                err => reject(err)
            );
        },
        err => reject(err)
    );
});
