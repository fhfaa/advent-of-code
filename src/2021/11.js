const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`;
/* */

input = input.split('\n');

// total grid size for part2 stop condition
const maxPossibleFlashes = input.length * input[0].length; 

const neighbours = [
  [ -1, -1], [ 0, -1], [ 1, -1], 
  [ -1,  0],           [ 1,  0],
  [ -1,  1], [ 0,  1], [ 1,  1]
];



function draw(input) {
  console.log(
    input.map(row => row.map(chr => {
        if (chr === 10 || chr === 0) return `\u001b[31mX\u001b[0m`;
        if (chr === -Infinity) return '';
        return chr;
      }).join('')
    ).join('\n')
  );
}


function run(input, stopFn) {
  let flashCountTotal = 0, step = 0;
  let result;

  // Clone input, turn it into int[][] wrapped with a border of -Infinity
  input = input.map(s => [-Infinity, ...s.split('').map(parseFloat), -Infinity]);
  input.unshift(input[0].slice().fill(-Infinity));
  input.push(input[0].slice().fill(-Infinity));

  do {
    // number of flashes this step only
    let flashes = [];
    step++;

    // Increment all and count initial flashes
    for (let y = 1, ylen = input.length - 1; y < ylen; y++) {
      for (let x = 1, xlen = input[0].length - 1; x < xlen; x++) {
        if (++input[y][x] === 10) {
          // Remember all new flashes
          flashes.push([x, y]);
        }
      }
    }

    // process each flash, increment neighbours
    // if we already know that they were going to flash, skip them
    // if this increment makes them flash, append them to the list of flashes 
    // and increment/check THEIR neighbours later
    while (flashes.length) {
      const [x, y] = flashes.shift();
      for (let [dx, dy] of neighbours) {
        if (input[y + dy][x + dx] === 10) {
          continue;
        }
        if (++input[y + dy][x + dx] === 10) {
          flashes.push([x + dx, y + dy]);
        }
      }
    }

    // Count flashes (10s) and turn them into 0s again
    flashCount = 0;
    for (let y = 1, ylen = input.length - 1; y < ylen; y++) {
      for (let x = 1, xlen = input[0].length - 1; x < xlen; x++) {
        if (input[y][x] === 10) {
          flashCount++;
          input[y][x] = 0;
        }
      }
    }
    flashCountTotal += flashCount;

    // Run callback to figure out when to stop
    // with step number and number of flashes this round + overall
    // condition for part2 is that the number this round is the max possible number
    result = stopFn(step, flashCount, flashCountTotal);

  } while (!result); 
  return result;
}

// pt.1
const part1 = run(input, (step, flashesRound, flashesTotal) => step === 100 ? flashesTotal : null);
console.log('Part 1: ', part1);

// pt.2
const part2 = run(input, (step, flashesRound, flashesTotal) => flashesRound === maxPossibleFlashes ? step : null);
console.log('Part 2: ', part2);