const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`;
/* */


// Walk the input string and count occurrences of both chars and pairs
// "NNNCB" => {
//   count: {N: 3, C: 1, B: 1},
//   pairs: {NN: 2, NC: 1, CN: 1}
// }
let data = input.split('\n\n')[0].split('').reduce((ret, chr, i, arr) => {
  ret.count[chr] = (ret.count[chr] || 0) + 1;
  if (i > 0) {
    const pair = arr[i - 1] + chr;
    ret.pairs[pair] = (ret.pairs[pair] || 0) + 1;
  }
  return ret;
}, {count: {}, pairs: {}});

// Turn rules into a map of inserted obj + the names of the resulting new  pairs
// "AB -> C" becomes {"AB" => ["C", "AC", "CB"]}, i.e. [insert, newLeft, newRight]
const rules = input.
  split('\n\n')[1].
  split('\n').
  map(s => s.split(' -> ')).
  reduce((ret, [from, to]) => {
    ret[from] = [to, from[0] + to, to + from[1]];
    return ret;
  }, {});


const getResult = (countMap) => {
  const sortedVals = Object.values(countMap).sort((a, b) => b - a);
  return sortedVals[0] - sortedVals[sortedVals.length - 1]
}


for (let i = 1; i <= 40; i++) {
  const next = {count: data.count, pairs: {}};

  for (let [pairName, pairCount] of Object.entries(data.pairs)) {

    // e.g. {CH: [ 'B', 'CB', 'BH' ], ...}
    const [inserted, left, right] = rules[pairName]; 

    // Increment count by new insertions
    next.count[inserted] = (next.count[inserted] || 0) + pairCount;

    // Remember new pairs for next iteraton
    next.pairs[left] = (next.pairs[left] || 0) + pairCount;
    next.pairs[right] = (next.pairs[right] || 0) + pairCount;
  }
  
  data = next;
  
  if (i === 10) {
    console.log('Part 1: ', getResult(data.count));
  }
}

console.log('Part 2: ', getResult(data.count));