const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/input/${lvl}.txt`, 'utf8').replace(/\r/g, '');
let isExample = false;

/* *
input = `939
7,13,x,x,59,x,31,19`;
isExample = true;
/* */

/* *
input = `939
1789,37,47,1889`;
isExample = true;
/* */

let [time, buses] = input.split('\n');
time = +time;

// pt.1
const part1 = buses.
  split(',').
  filter(s => s !== 'x').
  map(s => +s).
  map(num => {
    const wait = ((((time / num) | 0) + 1) * num) % time;
    return { num, wait };
  }).
  sort((a, b) => a.wait < b.wait ? -1 : 1)[0]
  
console.log('Part 1: ', part1.num * part1.wait);


// pt.2
/*
// Way too slow
let buses2 = buses.
  split(',').
  map((s, idx) => s === 'x' ? null : {num: +s, i: idx}).
  filter(Boolean);

const busWithMaxNo = buses2.sort((a, b) => b.num - a.num)[0];
const maxBusNo = busWithMaxNo.num;
const maxBusIdx = busWithMaxNo.i;

// Make indices relative to highest bus no.
buses2 = buses2.map(b => ({num: b.num, i: b.i - maxBusIdx}));

const start = isExample ? maxBusNo : 100000000000000;
outer: for (let i = start ;; i += maxBusNo) {
  for (let bus of buses2) {
    if ((i + bus.i) % bus.num !== 0) {
      continue outer;
    }
  }
  console.log('Part 2: ', i - maxBusIdx); 
  break outer;
}
*/

const buses2 = buses.
  split(',').
  map((n, i) => n === 'x' ? null : {
    num: +n,
    r: i ? +n - (i % +n) : 0
  }).
  filter(Boolean);

let part2 = 0;
let multiplier = 1;

for (let i = 0; i < buses2.length; i++) {
  while ((part2 % buses2[i].num) !== buses2[i].r) {
    part2 += multiplier;
  }
  multiplier *= buses2[i].num;
}

console.log('Part 2: ', part2);