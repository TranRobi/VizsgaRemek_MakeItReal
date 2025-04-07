export const rename_key = (object, old_key, new_key) => delete Object.assign(object, { [new_key]: object[old_key] })[old_key];
/*
 * Ez a függvény automata kiszedi a tokent a request-ből.
 *
 * INDOKLÁS:
 * Swagger UI nem támogatja a cookie authentication-t (industry-standard szoftver btw),
 * úgyhogy a backend tesztelhetősége érdekében header-ben is elfogadjuk a login token-t
 * */
export const get_api_key = req => {
    if (req.cookies && req.cookies['LOGIN_TOKEN'])
        return req.cookies['LOGIN_TOKEN'];
    const body_token = req.get('LOGIN_TOKEN');
    if (body_token)
        return body_token;
    else
        return undefined;
};

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
    let r = undefined;
    stmt.get((err, row) => {
        if (err) reject(err);
        else r = row;
    });
    stmt.finalize(err => {
        if (err) reject(err);
        else resolve(r);
    });
});

const async_get_all = (db, sql, ...params) => new Promise((resolve, reject) => {
    const stmt = db.prepare(sql, params, err => {
        if (err) reject(err);
    });
    let r = undefined;
    stmt.all((err, rows) => {
        if (err) reject(errs);
        else r = rows;
    });
    stmt.finalize(err => {
        if (err) reject(err);
        else resolve(r);
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

const file_name_from_date = () => Number(new Date()).toString('16');

export {
    async_get,
    async_get_all,
    async_run,
    file_name_from_date
};
