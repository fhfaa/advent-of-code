const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/, '');

/* *
input = `2199943210
3987894921
9856789892
8767896789
9899965678`;
/* */

// Surround the input with a border 9s, then turn it into an int[][] array
// Running inside this "safe" border requires no bounds checks in either pt.1 or 2
input = input.split('\n').map(row => `9${row}9`.split('').map(parseFloat));
input.unshift(input[0].slice().fill(9));
input.push(input[0].slice().fill(9));

// pt.1
let part1 = 0;
const lowPoints = []; // remember low points for part 2

for (let y = 1, lastRow = input.length - 1; y < lastRow; y++) {
  forx: for (let x = 1, lastCol = input[0].length - 1; x < lastCol; x++) {
    const middle = input[y][x];

    if (
      input[y - 1][x] <= middle || input[y + 1][x] <= middle ||
      input[y][x - 1] <= middle || input[y][x + 1] <= middle) {
      continue forx;
    }

    lowPoints.push([x, y]);

    part1 += middle + 1;
    x++; // if this one is a low point, the one next to it can't be one
  }
}

console.log('Part 1: ', part1);


// pt.2
function floodFill(x, y, memo = {}) {
  // remember visited coords so they're only counted once
  if (memo[`${x},${y}`] === undefined && (input[y][x] < 9)) {
    memo[`${x},${y}`] = 1;
    return 1 +
      floodFill(x - 1, y, memo) +
      floodFill(x + 1, y, memo) +
      floodFill(x, y - 1, memo) +
      floodFill(x, y + 1, memo);
  }
  return 0;
}

const part2 = lowPoints.
  map(point => floodFill(...point)).
  sort((a, b) => b - a).
  slice(0, 3).
  reduce((a, b) => a * b);

console.log('Part 2: ', part2);