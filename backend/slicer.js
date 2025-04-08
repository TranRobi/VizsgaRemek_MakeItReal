'use strict';

import os from 'node:os';
import { execSync } from 'node:child_process';
import { mkdirSync, unlinkSync, rmSync } from 'node:fs';

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

const rm_dir = dirname => {
    rmSync(dirname, { recursive: true, force: true });
};

export const slicer_init_directories = () => {
    mkdir_wrapper('./stl');
    mkdir_wrapper('./product-images');
    mkdir_wrapper('./gcode');
};

export const slicer_cleanup_directiories = () => {
    // XXX stl mappat nem toroljuk, giten van tarolva nehany elem
    rm_dir('./product-images');
    rm_dir('./gcode');
};

/*
 * Egy `stl-thumb` hiányosságot szűr ki
 *
 * Egy STL fájl lehet bináris, vagy szöveges formátumú.
 * A szöveges formátum hivatalos neve STEP, amit az
 * `stl-thumb` NEM támogat:
 * https://github.com/unlimitedbacon/stl-thumb/issues/77
 *
 * Ez a függvény bináris STL fájl-lá konvertálja,
 * majd kitörli a régit
 */
export const convert_model_to_stl = model_file => {
    const stl_path = `stl/${file_name_from_date()}.stl`
    execSync(`${slicer} --output ${stl_path} --export-stl ${model_file}`);
    unlinkSync(model_file);
    return stl_path;
};

console.log(`
A backend a PrusaSlicer és az STL-Thumb külső programokat használja
G-Code és termék-kép generálásra.

Ezeket így telepítheti Windows rendszeren:
winget install -e --id Prusa3D.PrusaSlicer
winget install -e --id UnlimitedBacon.STL-Thumb
`);

// TODO jobb keresés Windows exe fájlokra
let slicer = undefined;
try {
    slicer = os.type() === 'Windows_NT' ?
        `"${execSync('where /r "C:\\Program Files" prusa-slicer.exe').toString().trim()}"` :
        execSync('which prusa-slicer').toString().trim();
} catch (e) {
    console.log('PrusaSlicer nincs telepítve! Így telepítheti:');
    console.log('winget install -e --id Prusa3D.PrusaSlicer');
    process.exit(1);
}
let stl_thumb = undefined;
try {
    stl_thumb = os.type() === 'Windows_NT' ?
        `"${execSync('where /r "C:\\Program Files" stl-thumb.exe').toString().trim()}"` :
        execSync('which stl-thumb').toString().trim();
} catch (e) {
    console.log('stl-thumb nincs telepítve! Így telepítheti:');
    console.log('winget install -e --id UnlimitedBacon.STL-Thumb');
    process.exit(1);
}

export const slice_stl_to_gcode = (stl_path, gcode_path) => {
    // TODO check success
    execSync(`${slicer} --output ${gcode_path} --slice ${stl_path} --pad-around-object --supports-enable`);
    return true;
};

export const generate_stl_thumbnail = stl_path => {
    const thumbnail_path = `product-images/${file_name_from_date()}.png`
    // TODO check success
    execSync(`${stl_thumb} --background 000000ff --size 640 ${stl_path} ${thumbnail_path}`);
    return thumbnail_path;
};
