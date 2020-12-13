const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8');

const [min, max] = input.split('-').map(parseFloat);

// pt.1
let count = 0;
for (let i = min; i <= max; i++) {
  const s = '' + i;
  if ((s[0] == s[1] || s[1] == s[2] || s[2] == s[3] || s[3] == s[4] || s[4] == s[5]) &&
    (s[0] <= s[1] && s[1] <= s[2] && s[2] <= s[3] && s[3] <= s[4] && s[4] <= s[5])) {
      count++;
    }
} 
console.log('Part 1: ', count);


// pt.2
count = 0;
const two = /(\d)\1/, more = /(\d)\1{2,}/g;
for (let i = min; i <= max; i++) {
  const s = '' + i;
  if (s[0] > s[1] || s[1] > s[2] || s[2] > s[3] || s[3] > s[4] || s[4] > s[5]) {
    continue;
  }
  if (two.test(s.replace(more, ''))) {
    count++;
  }
} 
console.log('Part 2: ', count);