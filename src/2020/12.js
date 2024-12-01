const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `F10
N3
F7
R90
F11`;
/* */

/* *
// rotation check
input = `F10
R90
L90
R270
L270
L180
R180`;
/* */

// pt.1
const part1 = input.split('\n').reduce((o, next) => {
  const val = +next.substr(1);

  let op = next[0] !== 'F' ? next[0] : o.dirs[o.dir];
  switch (op) {
    case 'N': o.y -= val; break;
    case 'S': o.y += val; break;
    case 'W': o.x -= val; break;
    case 'E': o.x += val; break;
    case 'L': o.dir = (o.dir - (val / 90) + 4) % 4; break;
    case 'R': o.dir = (o.dir + (val / 90)) % 4; break;
  }
  return o;
}, {x: 0, y: 0, dir: 1, dirs: ['N', 'E', 'S', 'W']});

console.log('Part 1: ', Math.abs(part1.x) + Math.abs(part1.y));


// pt.2
const part2 = input.split('\n').reduce((o, next) => {
  let val = +next.substr(1);

  switch (next[0]) {
    case 'N': o.wy -= val; break;
    case 'S': o.wy += val; break;
    case 'W': o.wx -= val; break;
    case 'E': o.wx += val; break;
    case 'F':
      o.x += o.wx * val;
      o.y += o.wy * val;
      break;
    case 'L':
      val = 360 - val;
    case 'R':
      switch (val) {
        case 90:
          const wx = o.wy * -1;
          o.wy = o.wx;
          o.wx = wx;
          break;
        case 180:
          o.wx *= -1;
          o.wy *= -1;
          break;
        case 270:
          const wy = o.wx * -1;
          o.wx = o.wy;
          o.wy = wy;
          break;
      }
  }
  return o;
}, {x: 0, y: 0, wx: 10, wy: -1});

console.log('Part 2: ', Math.abs(part2.x) + Math.abs(part2.y));
