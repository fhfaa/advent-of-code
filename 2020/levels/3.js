const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/, '');

/*input = `..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`;*/


const data = input.
  split('\n').
  map(s => s.split('').map(c => c === '#' ? 1 : 0));

function count(right, down) {
  let count = 0, x = 0, xlen = data[0].length;
  for (let i = 0; i < data.length - 1; i += down) {
    
    x = (x + right) % xlen;
    count += data[i + down][x] ? 1 : 0;
  }
  return count;
}


// pt.1
console.log('Part 1: ', count(3,1));

// pt.2
console.log('Part 2: ', 
  count(1,1) *
  count(3,1) *
  count(5,1) *
  count(7,1) *
  count(1,2)
);