const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `199
200
208
210
200
207
240
269
260
263`;
/* */

input = input.split('\n').map(parseFloat);

// pt.1
// arr[0] doesn't need nullcheck because a[-1] is undefined, and (undefined < anything) is false
const part1 = input.filter((e, i, a) => a[i - 1] < e).length;

console.log('Part 1: ', part1);


// pt.2
const part2 = input.
  slice(2).
  map((e, i) => input[i] + input[i + 1] + e). // e === input[i + 2] after slice
  filter((e, i, a) => a[i - 1] < e).length;

console.log('Part 2: ', part2);