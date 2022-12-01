const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`;
/* */


// pt.1
const data = input.
  split('\n').
  map(s => s.split(/-|:? /g)).
  reduce((num, [min, max, c, s]) => {
    s = s.replace(new RegExp(`[^${c}]`, 'g'), '');
    return num + (s.length >= +min && s.length <= +max ? 1 : 0);
  }, 0)

  console.log('Part 1: ', data);



// pt.2
const data2 = input.
  split('\n').
  map(s => s.split(/-|:? /g)).
  reduce((num, [min, max, c, s]) => {
    return num + ((s.charAt(+min - 1)) === c ^ (s.charAt(+max - 1) === c) ? 1 : 0);
  }, 0)

console.log('Part 2: ', data2);