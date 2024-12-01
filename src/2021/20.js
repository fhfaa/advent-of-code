const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###`;
/* */

const neighbours = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0], [0,  0], [1,  0],
  [-1,  1], [0,  1], [1,  1]
];


function print(img) {
  console.log(img.map(r => r.map(c => c ? '#' : '.').join('')).join('\n') + '\n');
}


function enhance(img, algo, defaultState) {
  img2 = [];

  // Walk every pixel plus one pixel border outside of the image
  for (let y = -1, ylen = img.length + 1; y <= ylen; y++) {
    const newRow = [];

    for (let x = -1, xlen = img[0].length + 1; x <= xlen; x++) {
      let algoIdx = 0;

      // For each of those, check all neighbours.
      // Join together their bits to find the algorithm index.
      // Use that to get the new bit value. Remember all news bits.
      for (let [dx, dy] of neighbours) {
        algoIdx = (algoIdx << 1) | (img[y + dy]?.[x + dx] ?? defaultState);
      }
      newRow.push(algo[algoIdx]);
    }
    img2.push(newRow);
  }

  return img2;
}

function count(img) {
  return img.reduce((sum, row) => sum + row.reduce((a, b) => a + b), 0);
}

// Convert # to 1 and . to 0
let [algo, image] = input.split('\n\n');
algo = algo.split('').map(chr => chr === '#' ? 1 : 0)
image = image.split('\n').map(row => row.split('').map(chr => chr === '#' ? 1 : 0));


for (let i = 0, defaultState = 0; i < 50; i++) {
  
  image = enhance(image, algo, defaultState);

  // Default state for untracked infinite pixels, derived from
  // algorithm state for all-9-fields ON or all-9-fields OFF.
  defaultState = algo[defaultState ? 0x1FF : 0];

  
  if (i === 1) console.log('Part 1: ', count(image));
}
console.log('Part 2: ', count(image));
