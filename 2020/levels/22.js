const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8');

/* *
input = `Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10`;
/* */


// pt.1
const [p1, p2] = input.
  replace(/Player \d:\r?\n/g, '').
  split('\n\n').
  map(s =>s.split('\n').map(parseFloat));

while (p1.length && p2.length) {
  if (p1[0] > p2[0]) {
    p1.push(p1.shift(), p2.shift());
  } else {
    p2.push(p2.shift(), p1.shift());
  }
}

const part1 = (p1.length ? p1 : p2).
  reverse().
  reduce((score, card, idx) => score + card * (idx + 1), 0);

console.log('Part 1: ', part1);