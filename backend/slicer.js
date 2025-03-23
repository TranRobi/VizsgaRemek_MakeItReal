'use strict';

import os from 'node:os';
import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

import { file_name_from_date } from './util.js';

const mkdir_wrapper = dirname => {
    try {
        mkdirSync(dirname);
    } catch (e) {
        // hasznos olvasmány: unix hibakódok
        if (e.code !== 'EEXIST') {
            throw e;
        }
    }
};

export const slicer_init_directories = () => {
    mkdir_wrapper('./stl');
    mkdir_wrapper('./product-images');
};

export const is_slicer_installed = () => {
    if (os.type() === 'Windows_NT') {
        try {
            execSync('prusa-slicer.exe --help');
            return true;
        } catch(e) {
            return false;
        }
        return false;
    } else {
        try {
            execSync('prusa-slicer --help');
            return true;
        } catch(e) {
            return false;
        }
    }
};

export const is_stl_thumb_installed = () => {
    if (os.type() === 'Windows_NT') {
        try {
            execSync('stl-thumb.exe --version');
            return true;
        } catch (e) {
            return false;
        }
    } else {
        try {
            execSync('stl-thumb --version');
            return true;
        } catch (e) {
            return false;
        }
    }
};

// TODO jobb keresés Windows exe fájlokra
const slicer = os.type() === 'Windows_NT' ? 'prusa-slicer.exe' : execSync('which prusa-slicer').toString().trim();
const stl_thumb = os.type() === 'Windows_NT' ? 'stl-thumb.exe' : execSync('which stl-thumb').toString().trim();

export const slice_stl_to_gcode = (stl_path, gcode_path) => {
    // TODO check success
    execSync(`${slicer} \\
        --output-file ${gcode_path} \\
        --slice ${stl_path} \\
        --pad-around-object \\
        --supports-enable`);
    return true;
};

export const generate_stl_thumbnail = stl_path => {
    const thumbnail_path = `product-images/${file_name_from_date()}.png`
    // TODO check success
    execSync(`${stl_thumb} \\
        --background 000000ff \\
        --size 640 \\
        ${stl_path} \\
        ${thumbnail_path}
        `);
    return thumbnail_path;
};
