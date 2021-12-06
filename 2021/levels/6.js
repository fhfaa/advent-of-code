const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/, '');

/* *
input = `3,4,3,1,2`;
/* */

// Count occurences per timer number. array index = timer value
input = input.split(',').reduce((ret, n) => {
  ret[+n]++;
  return ret;
}, Array(9).fill(0));

// pt.1 + 2
for (let i = 0; i < 256; i++) {
  // Shift out the 0s, effectively reducing all others by one,
  // Then add the 0s back as 6s and create new 8s
  const was0 = input.shift();
  input[8] = was0;
  input[6] += was0;
  if (i === 79) {
    console.log('Part 1: ', Object.values(input).reduce((a, b) => a + +b, 0))
  }
}
// wow such bigint
console.log('Part 2: ', Object.values(input).reduce((a, b) => a + +b, 0));