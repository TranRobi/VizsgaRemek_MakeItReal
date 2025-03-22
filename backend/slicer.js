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
        } catch(e) {
            return false;
        }
        return true;
    }
};

export const slicer = () => os.type() === 'Windows_NT' ? '' : execSync('which prusa-slicer').toString();

export const slice_stl_to_gcode = (stl_path, gcode_path) => {
};
