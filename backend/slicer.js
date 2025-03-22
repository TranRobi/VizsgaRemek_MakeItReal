'use strict';

import os from 'node:os';
import { execSync } from 'node:child_process';

export const is_slicer_installed = () => {
    if (os.type() === 'Windows_NT') {
        // TODO windows
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

export const slicer = () => os.type() === 'Windows_NT' ? '' : execSync('which prusa-slicer').toString();

export const slice_stl_to_gcode = (stl_path, gcode_path) => {
    // TODO check success
    execSync(`${slicer()}
        --output-file ${gcode_path}
        --slice ${stl_path}
        --pad-around-object
        --supports-enable`);
    return true;
};
