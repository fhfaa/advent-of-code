
const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8');

/* *
input = ``;
/* */

const part1 = input.split('\n');
console.log('Part 1: ', 'TODO');
