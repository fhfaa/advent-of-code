const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`
/* */

const ops = input.split('\n').map(s => {
  const [op, n] = s.split(' ');
  return [op, +n]; 
});

function accOrNull(ops, returnAccIfLoop) {
  let memo = {}, pos = 0, acc = 0, len = ops.length;

  while(!memo[pos] && pos < len) {
    memo[pos] = 1;
    switch (ops[pos][0]) {
      case 'nop': pos++; break;
      case 'jmp': pos += ops[pos][1]; break;
      case 'acc': acc += ops[pos][1]; pos++; break;
    }
  }
  return (pos >= len || returnAccIfLoop) ? acc : null;
}

// pt.1
console.log('Part 1: ', accOrNull(ops, true));


// pt.2
ops.some((op, i, a) => { // for each op
  const tmp = op[0];
  if (tmp === 'acc') { return false; }  // ignore acc & continue
  op[0] = tmp === 'jmp' ? 'nop' : 'jmp'; // swap jmp/nop

  const res = accOrNull(a);
  if (res !== null) {
    console.log('Part 2: ', res);
    return true;
  }

  op[0] = tmp; // restore original op
}) 