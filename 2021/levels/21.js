const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/, '');

/* */
input = `Player 1 starting position: 4
Player 2 starting position: 8`;
/* */

pos = input.split('\n').map(s => +s.split(' ').pop())

// pt.1
const part1 = pos;
console.log('Part 1: ', part1);


// pt.2
const part2 = 'TODO';
console.log('Part 2: ', part2);