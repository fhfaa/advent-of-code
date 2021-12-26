const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/, '');


const SERIAL_LEN = 14;
const DIV = [], N1 = [], N2 = [], MAXZ = [];

// Parse input, but only return operator and second num. We don't need the first,
// and we only need the ones with numbers, so we don't care if parsing the others
// fails.
input = input.split('\n').map(line => [line.substring(0,3), +line.substring(6)]);

// The number of instructions is the same per digit of input
// Extract magic numbers from input by line offsets
const nextInputIdx = input.slice(1).findIndex(([op]) => op === 'inp') + 1;
for (let i = 0, len = input.length; i < len; i += nextInputIdx) {
  DIV.push(input[i + 4][1]);  // line  5: "div z 26" OR "div z 1" ? --> 1 | 26
  N1.push(+input[i + 5][1]);  // line  6: "add x ???" --> first magic number
  N2.push(+input[i + 15][1]); // line 16: "add y ???" --> second magic number
}


for (let len = SERIAL_LEN - 1, tmp = 1; len >= 0; len--) {
  tmp *= DIV[len];
  MAXZ[len] = tmp;
}
MAXZ[SERIAL_LEN] = 0; // add one more so we can check before recursing


// Apart from magic numbers, the code is the same for each digit.
// Many instruction cans be simplified, e.g.:
// "mul x 0; add x y; mul x z" => "x = y * z"
// "eql x w; eql x 0" => "x != w ? 1 : 0"

// Each iteration in the instructions is based on the previous one (z remains intact).
// The instructions basically work on base26 numbers. Each iteration either
// adds or removes one lower base26 "byte". With that knowledge and the
// DIV magic numbers (either 26 or 1) we can figure out a maximum possible "z"
// per iteration so abort early.
function getZ(i, w, z) {
  if ((z % 26) + N1[i] === w) {
    return Math.floor(z / DIV[i]);
  } else {
    return 26 * Math.floor(z / DIV[i]) + w + N2[i];
  }
}


// Bruteforce downwards from 99999999999999
function searchHighest(digitPos, z, solution) {
  if (digitPos < SERIAL_LEN) {
    for (let digit = 9; digit >= 1; digit--) {
      solution[digitPos] = digit;

      const newZ = getZ(digitPos, digit, z);
      if (newZ <= MAXZ[digitPos + 1] && searchLowest(digitPos + 1, newZ, solution)) {
        return solution;
      }
    }
    return false;
  }
  return z === 0;
}


// Same as above, but upwards from 11111111111111
function searchLowest(digitPos, z, solution) {
  if (digitPos < SERIAL_LEN) {
    for (let digit = 1; digit <= 9; digit++) {
      solution[digitPos] = digit;

      const newZ = getZ(digitPos, digit, z);
      if (newZ <= MAXZ[digitPos + 1] && searchLowest(digitPos + 1, newZ, solution)) {
        return solution;
      }
    }
    return false;
  }
  return z === 0;
}

console.log('Part 1: ', searchHighest(0, 0, []).join(''));
console.log('Part 2: ', searchLowest(0, 0, []).join(''));