const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

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


// pt.2
function game(d1, d2, returnDeck) {
  const memo = {};

  // While both have cards
  while (d1.length && d2.length) {
    const memoKey = `${d1.join(',')}/${d2.join(',')}`
    if (memo[memoKey]) {
      return 1;
    }
    memo[memoKey] = 1;

    // Enough cards to recurse
    if (d1[0] < d1.length && d2[0] < d2.length) {
      const winner = game(d1.slice(1, d1[0] + 1), d2.slice(1, d2[0] + 1));
      if (winner === 1) {
        d1.push(d1.shift(), d2.shift());
      } else {
        d2.push(d2.shift(), d1.shift());
      }
    }

    // Regular game 
    else {
      if (d1[0] > d2[0]) {
        d1.push(d1.shift(), d2.shift());
      } else {
        d2.push(d2.shift(), d1.shift());
      }
    }
  }

  return returnDeck ? (d1.length ? d1 : d2) : (d1.length ? 1 : 0);
}

const [d1, d2] = input.
  replace(/Player \d:\r?\n/g, '').
  split('\n\n').
  map(s =>s.split('\n').map(parseFloat));

const part2 = game(d1, d2, true).
  reverse().
  reduce((score, card, idx) => score + card * (idx + 1), 0);

console.log('Part 2: ', part2);

