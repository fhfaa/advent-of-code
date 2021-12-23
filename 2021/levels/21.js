const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/, '');

/* *
input = `Player 1 starting position: 4
Player 2 starting position: 8`;
/* */

const pos = input.split('\n').map(s => +s.split(' ').pop());
const score = [0, 0];
let dice = 1, rolls = 0;

// pt.1
outer: while (true) {
  for (let player of [0, 1]) {
    rolls += 3;
    pos[player] = ((pos[player] + dice++ + dice++ + dice++) % 10) || 10;
    score[player] += pos[player];
    if (score[player] >= 1000) {
      console.log('Part 1: ', rolls * score[+!player]);
      break outer;
    }
  }
}


// pt.2
const part2 = 'TODO';
console.log('Part 2: ', part2);