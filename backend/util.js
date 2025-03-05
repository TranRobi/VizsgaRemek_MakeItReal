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
