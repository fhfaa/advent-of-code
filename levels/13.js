const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8');

/* *
input = ``;
/* */


// pt.1
const part1 = input.split('\n');
console.log('Part 1: ', part1);


// pt.2
const part2 = input.split('\n');
console.log('Part 2: ', part2);
