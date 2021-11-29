const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/, '');

// pt.1
const data = input.split('\n').
  map(s => s.replace(/[FL]/g, 0).replace(/[BR]/g, 1)).
  map(s => parseInt(s, 2)).
  map(i => {
    const left = (i & 0b1111111000) >> 3;
    const right = (i & 0b111);
    return left * 8 + right;
  }).
  sort((a, b) => b - a);

console.log('Part 1: ', data[0]);

// pt.2
const part2 =  data.filter((e, i, a) => e !== a[i + 1] + 1)[0] - 1;
console.log('Part 2: ', part2);