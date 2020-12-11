const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8');

/* *
input = ``;
/* */

// pt.1
const data = input.split('\n');

console.log('Part 1: ', data);
console.log('Part 2: ', data);
