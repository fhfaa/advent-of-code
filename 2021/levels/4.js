const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/, '');

/* *
input = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`;
/* */

// Turn list of drawn numbers and each board into 1d arrays of numbers
const numbers = input.split('\n')[0].split(',').map(parseFloat);
const boards = input.split('\n\n').slice(1).
  map(str => str.trimStart().replace(/\n/g, ' ').split(/\s+/).map(parseFloat));


// Draw number and replace all occurrences on all boards with -1
function draw(numbers, boards) {
  const next = numbers.shift();

  for (let board of boards) {
    board.forEach((n, idx, arr) => arr[idx] = n !== next ? n : -1);
  }
  return next;
}


// Check 5 numbers (-1 = crossed off)
// Starting from index <pos> and increasing index by <jump> per number
function checkRow(board, [pos, jump]) {
  for (let i = 0; i < 5; i++, pos += jump) {
    if (board[pos] > -1) {
      return false;
    }
  }
  return true;
}


// Check for crossed off rows, columns [and diagonals]
// Return true if any of the checks passes.
function checkBoard(board) {
  const checks = [
    [0, 1], [5, 1], [10, 1], [15, 1], [20, 1], // Horizontal
    [0, 5], [1, 5], [ 2, 5], [ 3, 5], [ 4, 5], // Vertical
    // [0, 6], [4, 4]                          // Diagonal :(
  ];

  return checks.some(check => checkRow(board, check));
}


function runGame(numbers, boards, fn) {
  // Make a copy of the input for this game
  numbers = numbers.slice();
  boards = boards.map(b => b.slice());

  let winner, lastNum;

  draw(numbers, boards);
  draw(numbers, boards);
  draw(numbers, boards);
  draw(numbers, boards);
  
  while (numbers.length) {
    lastNum = draw(numbers, boards);
    if (winner = fn(boards)) {
      break;
    }
  }

  // Multiply last num with the sum of all remaining numbers (not -1)
  return lastNum * winner.reduce((a, b) => a + Math.max(0, b), 0)
}


// pt.1
const part1 = runGame(numbers, boards, (boards2) => {
  for (let board of boards2) {
    if (checkBoard(board)) {
      return board;
    }
  }
});

console.log('Part 1: ', part1);




// pt.2
const part2 = runGame(numbers, boards, (boards2) => {
  let i = boards2.length;

  // Check each board and remove winning boards from list of boards
  // Safe because input contains ALL numbers, so all boards win at some point
  // If the board to be removed is the last board, return it.
  while (i --> 0) {
    if (checkBoard(boards2[i])) {
      if (boards2.length === 1) {
        return boards2[i];
      }
      boards2.splice(i, 1);
    }
  }
});

console.log('Part 2: ', part2);