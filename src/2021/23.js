const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = ``;
/* */

input = input.split('\n');

// pt.1
const part1 = 'TODO';
console.log('Part 1: ', part1);


// pt.2
const part2 = 'TODO';
console.log('Part 2: ', part2);