export const rename_key = (object, old_key, new_key) => delete Object.assign(object, { [new_key]: object[old_key] })[old_key];
