const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/, '');

/* *
input = `class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12`;
/* */

/* *
input = `class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12`;
/* */

function prepareRanges() {
  let ranges = input.split('\n\n')[0].match(/(?<=\D|^)\d+?-\d+/g).map(s => s.split('-').map(s => +s));
  
  while (ranges.some(r1 => {
    return ranges.some(r2 => {
      if (r1 !== r2 && (
        (r1[0] - 1 <= r2[0] && r2[0] <= r1[1] + 1) || 
        (r1[0] - 1 <= r2[1] && r2[1] <= r1[1] + 1)
        )) {
        // console.log('Combining ', r1, ' and ', r2, ' to: ', [Math.min(r1[0], r2[0]), Math.max(r1[1], r2[1])]);
        ranges = [...ranges.filter(r => r !== r1 && r !== r2), [Math.min(r1[0], r2[0]), Math.max(r1[1], r2[1])]];
        return true;
      }
      return false;
    });
  })) {};
  return ranges;
}
const ranges = prepareRanges();

// pt.1
const part1 = input.split('nearby tickets:\n')[1].split('\n').reduce((ret, ticket) => {
  const nums = ticket.split(',').map(num => +num);
  nums.forEach(num => {
    if (!ranges.some(range => range[0] <= num && num <= range[1])) {
      ret += num;
    }
  });
  return ret;
}, 0)

console.log('Part 1: ', part1);


// pt.2
// Prepare field names and ranges
const fieldNames = [];
const fieldsMap = input.
  split('\n\n')[0].
  split('\n').
  reduce((ret, s) => {
    const [name, ...vals] = s.replace(': ', '-').replace(' or ', '-').split('-');

    fieldNames.push(name);
    ret[name] = vals.map(s => +s);
    return ret;
  }, {});
const numFields = fieldNames.length;

// Init possible solutions per field to cross off: [[0, 1, 2...], [0, 1, 2,...], ...]
const possible = [[...Array(fieldNames.length).keys()]];
for (let i = 1; i < numFields; i++) {
  possible.push(possible[0].slice());
}

// Recursively clean up possible solutions once a column is solved
function cleanup(fi) {
  const onlyValidCol = possible[fi][0];
  possible.forEach((oldArr, possIdx) => {
    
    if (fi === possIdx) {
      return;
    }
    const oldLen = oldArr.length;
    const newArr = oldArr.filter(poss => poss !== onlyValidCol);
    possible[possIdx] = newArr;
    if (oldLen > 1 && newArr.length === 1) {
      cleanup(possIdx);
    }
  });
}

// Tickets including our own as int[][]
const ticketStrings = input.split('your ticket:\n')[1].replace('\n\nnearby tickets:', '').split('\n');
const tickets = ticketStrings.
  map(ticket => ticket.split(',').map(num => +num)).
  filter(nums => nums.every(num => ranges.some(range => range[0] <= num && num <= range[1])));
const numTickets = tickets.length;


field: for (let fi = 0; fi < numFields; fi++) {
  const range = fieldsMap[fieldNames[fi]];

  column: for (let ci = 0; ci < numFields; ci++) {
    ticket: for (let ti = 0; ti < numTickets; ti++) {
      const val = tickets[ti][ci];

      // Number in column "ci" on ticket "ti" doesn't match the ranges for field "fi".
      // That means column "ci" cannot belong to field "fi".
      // Remove "ci" as a possible solution for "fi" and try the next "ci".
      if (!((range[0] <= val && val <= range[1]) || (range[2] <= val && val <= range[3]))) {
        possible[fi] = possible[fi] = possible[fi].filter(e => e != ci);
        continue column;
      }
    }
  }
  
  // All numbers in this column "ci" match the range for "fi".
  // If we only have one solution left, it MUST be here.
  // Remove it as a possible solution for all other columns. Recurse to clean up more, if necessary.
  if (possible[fi].length === 1) {
    cleanup(fi);    
  };
}

/*
console.log(possible);
[
  [ 4 ],  [ 0 ],  [ 16 ],
  [ 17 ], [ 7 ],  [ 10 ],
  [ 3 ],  [ 11 ], [ 5 ],
  [ 13 ], [ 1 ],  [ 14 ],
  [ 6 ],  [ 2 ],  [ 12 ],
  [ 8 ],  [ 19 ], [ 18 ],
  [ 9 ],  [ 15 ]
]
*/
console.log('Part 2: ', possible.slice(0, 6).reduce((part2, idx) => part2 * tickets[0][idx], 1));
