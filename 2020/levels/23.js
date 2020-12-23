const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8');

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

console.log('Part 1: ', part1, 67384529);