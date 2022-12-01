const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `1,9,10,3,2,3,11,0,99,30,40,50`;
/* */


const baseOps = input.
  split(',').
  map(s => parseInt(s, 10));

function run(noun, verb) {
  const ops = baseOps.slice();
  ops[1] = noun;
  ops[2] = verb;

  for (let i = 0; ops[i] !== 99; i += 4) {
    ops[ops[i + 3]] = ops[i] == 1 ?
      ops[ops[i + 1]] + ops[ops[i + 2]] :
      ops[ops[i + 1]] * ops[ops[i + 2]]; 
  }
  return ops[0];
}

// pt.1
console.log('Part 1: ', run(12, 2));


// pt.2
outer: for (let noun = 0; noun <= 99; noun += 1) {
  for (let verb = 0; verb <= 99; verb += 1) {
    if (19690720 === run(noun, verb)) {
      console.log('Part 2: ', 100 * noun + verb);
      break outer;
    }
  }
}