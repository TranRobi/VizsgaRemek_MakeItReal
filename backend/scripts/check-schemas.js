import SWAGGER_SCHEMAS from '../schemas.js';

for (const [name, schema] of Object.entries(SWAGGER_SCHEMAS)) {
    if (!schema.required && name.includes('request')) {
        console.log(`Request schema ${name} has no required properties!`);
    }
}
