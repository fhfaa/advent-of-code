const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`;
/* */

input = input.split('\n');

// pt.1
const part1 = input.
  // count 1's per column
  reduce((ret, s) => {
    s.split('').forEach((chr, i) => ret[i] += +chr);
    return ret;
  }, new Array(input[0].length).fill(0)).
  // build binary strings for rates
  reduce((ret, n) => {
    const mostly1 = n > input.length / 2;
    return {
      γ: ret.γ + (mostly1 ? '1' : '0'),
      ε: ret.ε + (mostly1 ? '0' : '1')
    };
  }, {γ: '', ε: ''});

console.log('Part 1: ', parseInt(part1.γ, 2) * parseInt(part1.ε, 2));


// pt.2
function pt2(data, isOxygen) {
  for (let i = 0, len = data[0].length; i < len; i += 1) {
    const half = data.length / 2;
    const count = data.reduce((ret, s) => ret + +s[i], 0);
    
    // xor magic to shorten (isOxy ? count > half : count < half)
    let needed = count !== half ? 
      ((count < half ^ isOxygen) ? '1' : '0') :
      (isOxygen ? '1' : '0');

    data = data.filter(s => s[i] === needed);
    
    // co2 is resolved one column earlier
    if (data.length === 1) {
      return data[0];
    }
  }
}

const part2 = {
  o2: pt2(input.slice(), true),
  co2: pt2(input.slice(), false)
};
console.log('Part 2: ', parseInt(part2.o2, 2) * parseInt(part2.co2, 2));