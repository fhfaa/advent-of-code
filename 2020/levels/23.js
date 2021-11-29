const fs = require('fs');
const { arch } = require('os');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/, '');

/* *
input = `389125467`;
/* */


let numbers = input.split('').map(parseFloat);

// pt.1
let pos = 0
const pickupSize = 3;
const numNumbers = numbers.length;

for (let i = 0; i < 100; i++) {
  // console.log('New array  :', numbers.map((n, i) => i === pos ? `(${n})` : n).join(','));
  
  // If necessary, rearrange array and pos to avoid wrap-around logic
  if (pos + pickupSize + 1 >= numNumbers) {
    numbers = [...numbers.slice(pos), ...numbers.slice(0, pos)];
    pos = 0;
    // console.log('Rearranged :', numbers.map((n, i) => i === pos ? `(${n})` : n).join(','));
  }

  // Pick up next three cups
  const spliced = numbers.splice(pos + 1, 3);
  // console.log("pick up    :", spliced);

  // Find next lowest number that wasn't taken
  // indexOf -1 --> not found because currently in `spliced`
  let destNum = numbers[pos], destIdx = -1;
  do {
    destNum = --destNum || numNumbers;
    destIdx = numbers.indexOf(destNum);
  } while (destIdx === -1);

  // Put cups back in
  numbers.splice(destIdx + 1, 0, ...spliced);

  // If cups were inserted before the current one, account for +3 position
  pos += destIdx < pos ? pickupSize + 1 : 1;
  // console.log(`destination: ${destNum} (index ${destIdx})\n`);
}

const pos1 = numbers.indexOf(1);
const part1 = [...numbers, ...numbers].slice(pos1 + 1, pos1 + numbers.length).join('');

console.log('Part 1: ', part1);





// pt.2
// Splicing and reorganizing the array takes way too long,
// even without the convencience thing at the top.
//
// A linked list should give us near-instant re-arranging,
// but turns out searching ( O(n) ) is WAY too slow,
// even after inlining all the list methods.
/*
class ListElem {
  constructor(val, next) {
    this.val = val;
    this.next = next || null;
  }
  closeLoop() {
    let cur = this;
    while (cur.next) {
      cur = cur.next;
    }
    cur.next = this;
  }
}


numbers = input.split('').map(parseFloat);
numbers = numbers.concat([...new Array(1_000_001).keys()].slice(10))
let current = numbers.reverse().reduce((next, num) => new ListElem(num, next), null);
current.closeLoop();

for (let i = 0; i < 10_000_000; i++) {
  // if ((i % 100_000) === 0) {
  //  console.log(i);
  // }

  // Take out the next three cups
  const spliced = current.next;
  current.next = spliced.next.next.next;

  // Figure out the next number to search for
  let destNum = current.val;
  do {
    destNum = destNum - 1 || numbers.length;
  } while (spliced.val === destNum || spliced.next.val === destNum || spliced.next.next.val === destNum);

  // Search list for that number number
  let destination = current.next;
  while (destination.val !== destNum) {
    destination = destination.next;
  }

  // Insert the removed cups
  spliced.next.next.next = destination.next;
  destination.next = spliced;

  current = current.next;
}

// Search list for `1`
while (current.val !== 1) {
  current = current.next;
}
console.log('Part 2: ', current.next.val * current.next.next.val);
*/


const startingNumbers = input.split('').map(parseFloat);
const numCups = 1_000_000;

numbers = Array(numCups + 1).fill().map((e, i) => i + 1);

startingNumbers.forEach((n, i) => {
  numbers[n] = startingNumbers[i + 1] || startingNumbers.length + 1
});
numbers[0] = numbers[numbers.length - 1] = startingNumbers[0];

let current = 0;
for (let i = 0; i <= 10_000_000; i++) {
  current = numbers[current];
  const cup1 = numbers[current];
  const cup2 = numbers[cup1];
  const cup3 = numbers[cup2];

  let ins = current;
  do {
    ins = ins - 1 || numCups;
  } while(ins === cup1 || ins === cup2 || ins === cup3);

  const tmp = numbers[cup3];
  numbers[cup3] = numbers[ins];
  numbers[ins] = numbers[current];
  numbers[current] = tmp;
}

console.log('Part 2: ', numbers[1] * numbers[numbers[1]]);
