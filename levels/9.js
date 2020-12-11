const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8');
let preamble = 25;

/* *
input = `35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`;
preamble = 5;
/* */

const numbers = input.split('\n').map(parseFloat);

// pt.1
let firstInvalid = 0;
all: for (let ni = preamble, nlen = numbers.length; ni < nlen; ni++) {
  const num = numbers[ni]
  const prev = numbers.slice(ni - preamble, ni).sort((a, b) => a - b);

  for (let i = 0, ilen = preamble - 1; i < ilen; i++) {
    for (let j = i + 1; j < preamble; j++) {

      const sum = prev[i] + prev[j];
      if (sum > num) { continue; }
      if (sum === num) {
        continue all;
      }
    }
  }
  firstInvalid = num;
  break all;
}

console.log('Part 1: ', firstInvalid);


// pt.2
outer: for (let ni = 0, nlen = numbers.length; ni < nlen; ni++) {
  let sum = numbers[ni];
  let nj = ni + 1;
  while (nj < nlen && sum < firstInvalid) {
    sum += numbers[nj];
    nj++;
  }

  if (sum === firstInvalid) {
    const seq = numbers.slice(ni, nj);
    console.log('Part 2: ', Math.max(...seq) + Math.min(...seq));
    break outer;
  }
}