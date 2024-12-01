const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `target area: x=20..30, y=-10..-5`;
/* */


const [x1, x2, y1, y2] = input.split(/[^-\d]+/g).slice(1).map(Number);


// Given an x/y velocity, simulate a shot until we either hit or 
// know that we won't be able to hit anymore.
function simulateShot(vx, vy, x = 0, y = 0, maxY = -Infinity) {
  while (true) {
    x += vx;
    y += vy;
    vx -= Math.sign(vx);
    vy -= 1;
    maxY = Math.max(maxY, y);

    // Can't reach the target area anymore:
    // either already past it, or not there yet but no x-velocity left
    if (x > x2 || y < y1 || (x < x1 && vx <= 0)) {
      return false;
    }

    // [x,y] is inside of target area: hit!
    if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
      part1 = Math.max(maxY, part1);
      part2++;
      return true;
    }
  }
}


// Min X is the lowest Gauss sum to reach the nearest target tile (slowest possible shot)
// Max X is the position furthest target tile (fastest possible shot, direct)
// Y goes from lowest Y point to its inverse
// Guess these constraints only work if both x1 and x2 are >0 and both y1 and y2 are <0
const minX = ((sum = 1, i = 1) => {
  while ((sum += (++i)) <= x1);
  return i;
})();
const maxX = x2;
const minY = y1;
const maxY = Math.abs(y1);

let part1 = -Infinity; // Highest Y coord
let part2 = 0;         // Total working vx/vy combinations

// Bruteforce within constraints
for (let vx = minX; vx <= maxX; vx++) {
  for (let vy = minY; vy <= maxY; vy++) {
    simulateShot(vx, vy);
  }
}

console.log('Part 1: ', part1);
console.log('Part 2: ', part2);