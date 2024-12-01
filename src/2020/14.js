const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`;
/* */

/* *
input = `mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`;
/* */


// pt.1
function pad36(s) {
  return (new Array(36 - s.length + 1)).join('0') + s;
}

const data = input.split('\n').
  reduce((ret, e) => {
    let [left, right] = e.split(' = ');

    if (left === 'mask') {
      ret.mask = right;
    } else {
      right = +right;
      right = pad36(right.toString(2));

      let s = '';
      for (let i = 0; i < 36; i++) {
        s += ret.mask[i] === 'X' ? right[i] : ret.mask[i];
      }
      
      ret.mem[left.replace(/\D/g, '')] = parseInt(s, 2);
    }
    return ret;
  }, {mask: '', mem: {}}).mem;

const part1 = Object.keys(data).reduce((sum, a) => sum + data[a], 0);
console.log('Part 1: ', part1);


// p2.2
function applyMask2(obj, addr, val) {
  addr = pad36(addr.toString(2));

  const mask2 = obj.mask.split('').map((c, i) => c === '0' ? addr[i] : c);
    
  let i = 0, len = mask2.length;
  let rem = [];
  let backtrack = [];
  let backtracking = false;

  while (i < len) {
    const cur = mask2[i];
    if (cur !== 'X') {
      rem[i] = cur;

    } else if (backtracking) {
      rem[i] = '0';
      backtracking = false;

    } else {
      rem[i] = '1';
      backtrack.push(i);
    }

    if (++i === 36) {
      const solution = rem.join('');
      const solutionInt = parseInt(solution, 2);

      obj.mem[solutionInt] = val;

      if (backtrack.length) {
        i = backtrack.pop();
        backtracking = true;
        continue;
      } else {
        break;
      }
    }
  }
}

const data2 = input.split('\n').
  reduce((ret, e) => {
    const [left, right] = e.split(' = ');
    if (left === 'mask') {
      ret.mask = right;
    } else {
      applyMask2(ret, +left.replace(/\D/g, ''), +right);
    }
    return ret;
  }, {mask: '', mem: {}}).mem;

const part2 = Object.keys(data2).reduce((sum, a) => sum + data2[a], 0);
console.log('Part 2: ', part2);