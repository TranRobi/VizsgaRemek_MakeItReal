/*
 * Ez a fajl kriptografiaval kapcsolatos segedfuggvenyeket tartalmaz
 */

'use strict';

import { randomBytes, pbkdf2Sync } from 'node:crypto';
import CONFIG from './config.js';

export const generate_salt = () => randomBytes(CONFIG.SALT_SIZE).toString('hex');
export const hash_password = (password, salt) => pbkdf2Sync(password,
                                                            salt,
                                                            CONFIG.HASH_ITERATIONS,
                                                            CONFIG.PASSWORD_HASH_SIZE,
                                                            'sha512').toString('hex');
