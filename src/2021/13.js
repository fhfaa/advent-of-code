const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`;
/* */

let points = input.split('\n\n')[0].split('\n').map(s => {
  const [x, y] = s.split(',');
  return [+x, +y];
});
const folds = input.split('\n\n')[1].split('\n').map(s => {
  const [axis, pos] = s.split('=');
  return {axis: axis[axis.length - 1], pos: +pos}
});
let step = 1;

for (let fold of folds) {
  const xyIndex = fold.axis === 'x' ? 0 : 1;
  // console.warn('Folding ', fold.axis, ' at ', fold.pos);

  // Fold coord system
  for (let point of points) {
    // Affected by fold
    if (point[xyIndex] >= fold.pos) {
      point[xyIndex] = fold.pos - (point[xyIndex] - fold.pos);
    }
  }

  // Sort points, remove duplicates
  points = points.
    sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]).
    filter((e, i, a) => !i || e[0] !== a[i - 1][0] || e[1] !== a[i - 1][1]);

  // pt.1
  if (step++ === 1) {
    console.log('Part 1: ', points.length);
  }
};


// pt.2
// Grid size = last folds (40x6)
const gridSize = folds.reduce((ret, f) => ({
  x: f.axis === 'x' && f.pos < ret.x ? f.pos : ret.x,
  y: f.axis === 'y' && f.pos < ret.y ? f.pos : ret.y,
}), {x: +Infinity, y: +Infinity});

const grid = Array(gridSize.y).fill('').map(() => new Array(gridSize.x).fill(' '));

for (let [x, y] of points) {
  grid[y][x] = '#';
}

console.log('Part 2: \n' + grid.map(s => s.join('')).join('\n'));