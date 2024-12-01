const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `...>...
.......
......>
v.....>
......>
.......
..vvv..`;
/* */

/* *
input = `v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>`;
/* */

let grid = input.split('\n').map(row => row.split(''));

const xlen = grid[0].length;
const ylen = grid.length;

let lastGrid = '';

for (let i = 1; i < 10_000; i++) {
  let moves = [];

  // Find all possible '>' moves in current grid
  for (let x = 0 ; x < xlen; x++) {
    for (let y = 0; y < ylen; y++) {
      if (grid[y][x] === '>' && grid[y][(x + 1) % xlen] === '.') {
        moves.push([x, y]);
      }
    }
  }
  // Then handle them all at once (so '>>.' becomes '>.>', not '.>>')
  for (const [x, y] of moves) {
    grid[y][x] = '.';
    grid[y][(x + 1) % xlen] = '>';
  }

  // Repeat for 'v' moves
  moves = [];
  for (let x = 0; x < xlen; x++) {
    for (let y = 0; y < ylen; y++) {
      if (grid[y][x] === 'v' && grid[(y + 1) % ylen][x] === '.') {
        moves.push([x, y]);
      }
    }
  }
  for (const [x, y] of moves) {
    grid[y][x] = '.';
    grid[(y + 1) % ylen][x] = 'v';
  }

  // Compare current grid to previous grid. Stop if no moves mode.
  const thisGrid = grid.map(row => row.join('')).join('\n');
  if (thisGrid === lastGrid) {
    console.log('Part 1: ', i);
    break;
  }
  lastGrid = thisGrid;
}