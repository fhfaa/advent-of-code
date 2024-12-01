const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/input/${lvl}.txt`, 'utf8').replace(/\r/g, '');


function getNumber(condition) {
  const startingNumbers = input.split(',').map(parseFloat);
  const memo = new Array(30000000).fill(-1);

  // prepare starting numbers (except last-seen pos for last item)
  startingNumbers.forEach((e, idx, arr) => {
    memo[e] = idx === arr.length - 1 ? -1 : idx + 1;
  });
  let lastNum = startingNumbers[startingNumbers.length - 1];

  for (let i = startingNumbers.length; i < condition; i++) {
    const secondLast = memo[lastNum] || -1;
    memo[lastNum] = i;

    lastNum = secondLast === -1 ?
      i - memo[lastNum] :
      memo[lastNum] - secondLast;
  }
  return lastNum;
}

console.log('Part 1: ', getNumber(2020));
console.log('Part 2: ', getNumber(30000000));