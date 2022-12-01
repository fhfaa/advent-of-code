const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`;
/* */

/* *
input = `.......#.
...#.....
.#.......
.........
..#L....#
....#....
.........
#........
...#.....`;
/* */

const rowlen = input.indexOf('\n');
const data = input.replace(/\r?\n/g, '').split('');
const seatIdxs = data.map((e, i) => e !== '.' ? i : -1).filter(e => e > -1);

function dump(arr) {
  for (i = 0; i <= arr.length; i += rowlen) {
    console.log(arr.slice(i , i + rowlen).join(''));
  }
}

// pt.1
function gameOfLife(arr)  {
  let arr2 = arr.slice();
  for (let i of seatIdxs) {
    const edge = (i + 1) % rowlen;
    let seats = +(arr[i - rowlen] === '#') + +(arr[i + rowlen] === '#');

    if (edge !== 1) {
      seats += +(arr[i - 1 - rowlen] === '#') + +(arr[i - 1] === '#') + +(arr[i - 1 + rowlen] === '#');
    }
    if (edge !== 0) {
      seats += +(arr[i + 1 - rowlen] === '#') + +(arr[i + 1] === '#') + +(arr[i + 1 + rowlen] === '#');
    }
    arr2[i] = arr[i] === '#' ?
      (seats >= 4 ? 'L' : '#') : 
      (seats === 0 ? '#' : 'L');
  }
  return arr2;
}

let prev, cur = '', d = data, SAFETY = 0;
do {
  d = gameOfLife(d);
  prev = cur;
  cur = d.join('');
} while (prev !== cur && SAFETY++ < 10000);

console.log('Part 1: ', d.reduce((ret, a) => ret + (a === '#' ? 1 : 0), 0));


// pt.2
const rowcount = data.length / rowlen;
const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0],  [1, 1]];

function scan(arr, i, dx, dy, distance) {
  for (let j = 1; j <= distance; j++) {
    const c = arr[i + dx * j + dy * j * rowlen];
    if (c !== '.') { return c === '#' ? 1 : 0; }
  }
  return 0;
}

function gameOfLife2(arr)  {
  const arr2 = arr.slice();

  for (let i of seatIdxs) {
    const n = (i / rowlen) | 0;
    const s = rowcount - n - 1;
    const w = (i % rowlen) 
    const e = rowlen - w - 1;

    const distances = [Math.min(n, w), n, Math.min(n, e), w, e, Math.min(s, w), s, Math.min(s, e)];
    const seats = directions.reduce((sum, dir, iDir) => sum + scan(arr, i, dir[1], dir[0], distances[iDir]), 0);

    arr2[i] = arr[i] === '#' ?
      (seats >= 5 ? 'L' : '#') : 
      (seats === 0 ? '#' : 'L');
  }
  return arr2;
}

let prev2, cur2 = '', d2 = data, SAFETY2 = 1;
do {
  d2 = gameOfLife2(d2);
  prev2 = cur2;
  cur2 = d2.join('');
} while (prev2 !== cur2 && SAFETY2++ < 10000);

console.log('Part 2: ', d2.reduce((ret, a) => ret + (a === '#' ? 1 : 0), 0));