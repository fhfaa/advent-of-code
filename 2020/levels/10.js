const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `16
10
15
5
1
11
7
19
6
12
4`;

/* *
input = `28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`;
/* */

const data = input.split('\n').map(parseFloat).sort((a, b) => a - b);

// pt.1
const part1 = data.reduce((ret, num, i, a) => {
  const diff = num - (a[i - 1] || 0);
  ret[diff] = (ret[diff] || 0) + 1; 
  return ret;
}, {3: 1})
console.log('Part 1: ', part1[1] * part1[3]);


// pt.2
const part2 = [0, ...data, 3 + data[data.length - 1]].
  reverse().
  reduce((memo, num, i, a) => {
    const nextCounts = a.
      slice(Math.max(0, i - 3), Math.max(0, i)).
      filter(othr => (othr - num) <= 3).
      map(n => memo[n]);
      
    memo[num] = nextCounts.length ? nextCounts.reduce((a, b) => a + b, 0) : 1;
    return memo;
  }, {});

console.log('Part 2: ', part2[0]);