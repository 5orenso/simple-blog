'use strict';

const util = require('../lib/utilities');
const config = require('../config/config.js');

if (!process.argv[2]) {
    const scriptName = process.argv[1].replace(/^.+\//, './');
    console.log('Usage: ');
    console.log(`\tnode ${scriptName} <email>`);
    process.exit(1);
}

console.log('Your jwtToken:');
console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
console.log(util.makeJwtToken({ email: process.argv[2] }, config))
console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
