const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8');


// pt.1
const part1 = input.
  split('\n').
  reduce((sum, e) => sum + (+e/3)|0, 0);

console.log('Part 1: ', part1);


// pt.2
const part2 = input.
  split('\n').
  reduce((sum, e, fuel) => {
    do {
      e = ((+e/3) | 0) - 2
      sum += Math.max(e, 0); 
    } while (e > 0);
    return sum;
  }, 0);

console.log('Part 2: ', part2);