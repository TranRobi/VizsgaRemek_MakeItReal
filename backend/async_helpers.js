/*
 * promised-sqlite3 csomag helyett írva,
 * mert a csomaggal egy totál új API-n
 * keresztül kell interaktálni mindennel,
 * és az async programozás rákos
 *
 * így kevesebb kódot kell újraírni, mert szimplán
 * átadjuk a sima sqlite3.Database objektumot
 */

const async_get = (db, sql, ...params) => new Promise((resolve, reject) => {
    const stmt = db.prepare(sql, params, err => {
        if (err) reject(err);
    });
    stmt.get((err, row) => {
        if (err) reject(err);
        else resolve(row);
    });
});

const async_run = (db, sql, ...params) => new Promise((resolve, reject) => {
    const stmt = db.prepare(sql, params, err => {
        if (err) reject(err);
    });
    stmt.run(err => {
        if (err) reject(err);
    });
    stmt.finalize(err => {
        if (err) reject(err);
        else resolve();
    });
});

export {
    async_get,
    async_run
};
