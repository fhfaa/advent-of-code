const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/, '');

/*input = `1721
979
366
299
675
1456`;*/


const data = input.
  split('\n').
  map(s => parseInt(s, 10)).
  reduce((ret, e, i ,a) => {
    if (ret) { return ret; }
    const match = a.find((e2, i2) => i !== i2 && e + e2 === 2020);
    return match ? e * match : null;
  }, null);

// pt.1
console.log('Part 1: ', data);


const data2 = input.
  split('\n').
  map(s => parseInt(s, 10)).
  sort((a, b) => a - b);

const len = input.length;
let result;


outer: for (let i = 0; i < len; i += 1) {
  for (let j = 0; j < len; j += 1) {
    for(let k = len - 1; k >= 0; k -= 1) {
      // AcKcHyUaLly: i != j && i != k && j != k 
      if (data2[i] + data2[j] + data2[k ] === 2020) {
        result = data2[i] * data2[j] * data2[k ];
        break outer;
      }
    }
  }
}

// pt.2
console.log('Part 2: ', result);