const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/, '');

/* *
input = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`;
/* */

input = input.split('\n').map(s => s.replace(' -> ', ',').split(',').map(parseFloat));

function markPoint(obj, x, y, diagonal) {
  const key = `${x},${y}`;

  // diagonal lines are only countred in part2
  if (!diagonal) {
    obj.part1[key] = (obj.part1[key] || 0) + 1;
  }
  obj.part2[key] = (obj.part2[key] || 0) + 1;
}

// pt.1 + 2
const coords = input.reduce((ret, [x1, y1, x2, y2]) => {
  const dx = x1 === x2 ? 0 : (x1 < x2 ? 1 : -1);
  const dy = y1 === y2 ? 0 : (y1 < y2 ? 1 : -1);
  const diagonal = x1 !== x2 && y1 !== y2;
  
  markPoint(ret, x1, y1, diagonal);
  while (y1 !== y2 || x1 !== x2) {
    x1 += dx;
    y1 += dy;
    markPoint(ret, x1, y1, diagonal);
  }
  return ret;
}, {part1: {}, part2: {}});
console.log('Part 1: ', Object.values(coords.part1).reduce((a, b) => a + (b > 1 ? 1 : 0), 0));


// pt.2
console.log('Part 2: ', Object.values(coords.part2).reduce((a, b) => a + (b > 1 ? 1 : 0), 0));