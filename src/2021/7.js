const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `16,1,2,0,4,2,7,1,2,14`;
/* */
input = input.split(',').map(parseFloat).sort((a, b) => a - b);


// pt.1
/*
// got lucky here at first, but wouldn't have worked for other inputs
const median = input[Math.floor(input.length / 2)];
const part1 = input.reduce((ret, n) => ret + Math.abs(n - median), 0);
*/
// reusing the uglier pt.2 way here instead
let minCost = +Infinity;
// for each point between smallest and highest crab position
for (let pos = input[0], last = input[input.length - 1]; pos <= last; pos++) {
  // sum up all fuel costs, remember only the smallest sum
  const totalCost = input.reduce((sum, crabPos) => sum + Math.abs(crabPos - pos), 0);
  minCost = Math.min(minCost, totalCost);
}

console.log('Part 1: ', minCost);


// pt.2
function fuelCost(from, to) {
  const dist = Math.abs(from - to);
  // sum of 1..n is n*(n+1)/2
  return dist * (dist + 1) / 2;
}

minCost = +Infinity;
// for each point between smallest and highest crab position
for (let pos = input[0], last = input[input.length - 1]; pos <= last; pos++) {
  // sum up all fuel costs, remember only the smallest sum
  const totalCost = input.reduce((sum, crabPos) => sum + fuelCost(crabPos, pos), 0);
  minCost = Math.min(minCost, totalCost);
}

console.log('Part 2: ', minCost);