const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/, '');

/* *
input = ``;
/* */

input = input.split('\n').map(parseFloat);

// pt.1
const part1 = input;
console.log('Part 1: ', part1);

