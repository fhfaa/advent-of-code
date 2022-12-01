const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/, '');

/* *
input = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;
/* */

const elves = input.
  split('\n\n').
  map(lines => lines.
    split('\n').
    reduce((a, b) => a + parseInt(b, 10), 0)
  );

// pt.1
const part1 = Math.max(...elves);
console.log('Part 1: ', part1);


// pt.2
const part2 = elves.
  sort((a, b) => b - a).
  slice(0, 3).
  reduce((a, b) => a + b);

console.log('Part 2: ', part2);