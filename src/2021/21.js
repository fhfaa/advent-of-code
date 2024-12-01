const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `Player 1 starting position: 4
Player 2 starting position: 8`;
/* */


// pt.1
let pos = input.split('\n').map(s => +s.split(' ').pop());
const score = [0, 0];
let dice = 1, rolls = 0;

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
pos = input.split('\n').map(s => +s.split(' ').pop());
const memo = {};

// Number of combinations per total dice roll
// We can calculate all combinations of the same total in one
// 7 can be rolled 6 times: 1+3+3 3+1+3 3+3+1 2+2+3 2+3+2 3+2+2
const combinations = [];
for (let roll1 = 1; roll1 <= 3; roll1++) {
  for (let roll2 = 1; roll2 <= 3; roll2++) {
    for (let roll3 = 1; roll3 <= 3; roll3++) {
      combinations[roll1 + roll2 + roll3] = (combinations[roll1 + roll2 + roll3] ?? 0) + 1;
    }
  }
}

const play2 = (pos1, pos2, score1, score2, isPlayer1) => {
  // Use all params to create a unique string key for each game state
  // If memory becomes a problem, generate an int key:
  // pos is 2*4 bit, score 2*5 bit, player 1 bit
  const key = `${pos1},${pos2},${score1},${score2},${isPlayer1}`;

  // Return immediately if game result already memoized or game is a new win
  if (memo[key]) { return memo[key]; }
  if (score1 >= 21) { return (memo[key] = [1, 0]); }
  if (score2 >= 21) { return (memo[key] = [0, 1]); }

  let wins = [0, 0];

  // For each possible total roll (die1 + die2 + die3)
  for (let totalRoll = 3, rWin; totalRoll <= 9; totalRoll++) {
    // Solve the next step recursively, once per total roll
    if (isPlayer1) {
      const newPos = ((pos1 + totalRoll) % 10) || 10;
      rWin = play2(newPos, pos2, score1 + newPos, score2, false);
    } else {
      const newPos = ((pos2 + totalRoll) % 10) || 10;
      rWin = play2(pos1, newPos, score1, score2 + newPos, true);
    }

    // Multiply number of winning universes from here on
    // by the number of combinations for this total roll
    wins[0] += rWin[0] * combinations[totalRoll];
    wins[1] += rWin[1] * combinations[totalRoll];
  }

  return (memo[key] = wins);
}

const part2 = play2(...pos, 0, 0, true);
console.log('Part 2: ', Math.max(...part2));