'use strict';

export const CONFIG = {
    DB_NAME: 'makeitreal.db',
    HASH_ITERATIONS: 128,
    SALT_SIZE: 32,
    PASSWORD_HASH_SIZE: 128
};

/* konstansok query-khez */
export const JOB_MATERIALS = {
    PLA: 'PLA',
    PETG: 'PETG',
    ABS: 'ABS',
};

export const JOB_STATES = {
    PENDING: 'pending',
    IN_PRODUCTION: 'in_production',
    SHIPPED: 'shipped',
    DONE: 'done',
};

export const JOB_COLOURS = {
    RED: 'Red',
    GREEN: 'Green',
    BLUE: 'Blue',
    YELLOW: 'Yellow',
    BLACK: 'Black',
    WHITE: 'White',
    GRAY: 'Gray',
};

export default CONFIG;
