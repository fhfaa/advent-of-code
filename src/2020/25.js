const fs = require('fs');
const { getHeapCodeStatistics } = require('v8');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `5764801
17807724`;
/* */


// pt.1
const [cardPub, doorPub] = input.split('\n').map(parseFloat);

function transform(subject, loopSize) {
  let val = 1;
  while (loopSize --> 0) {
    val = (val * subject) % 20201227; 
  }
  return val;
}

function getLoopSize(publicKey) {
  const subject = 7;
  let val = 1, i = 0;
  while (publicKey !== val) {
    i++;
    val = (val * subject) % 20201227;
  }
  return i;
}

const part1 = transform(doorPub, getLoopSize(cardPub));
console.log('Part 1: ', part1);