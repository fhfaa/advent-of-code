const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8');

/* */
input = `Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...`;
/* */


size = 10

// We also need the reverse "hashes" in case the tile is flipped
const hashSide = pixels => [
  parseInt(pixels.join(''), 2),
  parseInt(pixels.slice().reverse().join(''), 2)
];

const hashSides = pixelData => {
  const firstCol = pixelData.map(row => row[0]);
  const lastCol = pixelData.map(row => row[size - 1]);
  return [
    ...hashSide(pixelData[0]),
    ...hashSide(lastCol),
    ...hashSide(pixelData[size - 1]),
    ...hashSide(firstCol)
  ];
};

const tiles = input.split('\n\n').reduce((ret, block) => {
  let [idRow, ...pixelData] = block.split('\n');
  pixelData = pixelData.map(row => row.split('').map(c => c === '#' ? 1 : 0));
  
  ret.push({
    id: +idRow.replace(/\D/g, ''),
    data: pixelData,
    hashes: hashSides(pixelData)
  });
  
  return ret;
}, [])


// pt.1

// Count how often each hash exists across all tiles
const hashCounts = tiles.reduce((ret, tile) => {
  for (hash of tile.hashes) {
    ret[hash] = (ret[hash] || 0) +  1
  }
  return ret;
}, {});

// Find the four tiles that have combined hash occurence of 12:
// Corners have 12 = (2 sides * 2 directions * 2 counterparts) + (2 sides * 2 directions)
// Edges have 14
// Inner pieces have 16
const part1 = tiles.
  filter(tile => {
    return 12 === tile.hashes.reduce((sum, hash) => sum + hashCounts[hash], 0)
  }, {}).
  reduce((a, b) => a * b.id, 1);

console.log('Part 1: ', part1);



/* 
const hashSide = pixels => [parseInt(pixels.join(''), 2), parseInt(pixels.slice().reverse().join(''), 2)];
const hashSides = (pixelData) => {
  const firstCol = pixelData.map(row => row[0]);
  const lastCol = pixelData.map(row => row[size - 1]);
  return [pixelData[0], lastCol, pixelData[size - 1], firstCol].map(hashSide);
}

const tiles = input.split('\n\n').reduce((ret, block) => {
  let [idRow, ...pixelData] = block.split('\n');
  pixelData = pixelData.map(row => row.split('').map(c => c === '#' ? 1 : 0));
  
  ret.push({
    id: +idRow.replace(/\D/g, ''),
    data: pixelData,
    hashes: hashSides(pixelData)
  });
  
  return ret;
}, [])


// pt.1
const hashCounts = tiles.reduce((ret, tile) => {
  for (let i = 0; i < 4; i++) {
    ret[tile.hashes[i][0]] = (ret[tile.hashes[i][0]] || 0) + 1;
    ret[tile.hashes[i][1]] = (ret[tile.hashes[i][1]] || 0) + 1;
  }
  return ret;
}, {});

const part1 = tiles.filter(tile => {
  let totalCount = 0;
  for (let i = 0; i < 4; i++) {
    totalCount += hashCounts[tile.hashes[i][0]] + hashCounts[tile.hashes[i][1]];
  }
  // Corners have 12 = (2 sides * 2 directions * 2 counterparts) + (2 sides * 2 directions)
  // Edges have 14
  // Inner pieces have 16
  return totalCount === 12;
}, {}); //.

console.log();*/