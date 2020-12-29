const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8');

/* *
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



// pt.1
// We also need the reverse "hashes" in case the tile is flipped
const hashSide = pixels => [
  parseInt(pixels.join(''), 2),
  parseInt(pixels.slice().reverse().join(''), 2)
];

const hashSides = pixelData => {
  const size = pixelData[0].length;
  const firstCol = pixelData.map(row => row[0]);
  const lastCol = pixelData.map(row => row[size - 1]);
  return [
    ...hashSide(pixelData[0]),
    ...hashSide(lastCol),
    ...hashSide(pixelData[size - 1].slice()),
    ...hashSide(firstCol.slice())
  ];
};


// Extract tile info and create a list of edge "hashes" (should be unique)
// to compare with those of the other tiles 
const tiles = input.split('\n\n').reduce((ret, block) => {
  let [idRow, ...pixelData] = block.split('\n');
  pixelData = pixelData.map(row => row.split('').map(c => c === '#' ? 1 : 0));
  
  ret.push({
    id: +idRow.replace(/\D/g, ''),
    data: pixelData,
    hashes: hashSides(pixelData)
  });
  
  return ret;
}, []);


// Count how often each "hash" exists across all tiles
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
    tile.hashOccurrences = tile.hashes.reduce((sum, hash) => sum + hashCounts[hash], 0);
    return 12 === tile.hashOccurrences;
  }, {}).
  reduce((a, b) => a * b.id, 1);

console.log('Part 1: ', part1);





// pt.2
// Re-used for Nessie
function rot90(data) {
  let newData = [];
  let numNewRows = data[0].length;

  for (let i = 0; i < numNewRows; i++) {
    let newRow = [];
    for (let j = data.length - 1; j >= 0; j--) {
      newRow.push(data[j][i]);
    }
    newData.push(newRow);
  }
  return newData;
}


function tileRot90(tile) {
  tile.data = rot90(tile.data);
  [tile.top, tile.right, tile.bottom, tile.left] = [tile.left, tile.top, tile.right, tile.bottom];
  return tile;
}

// Re-used for Nessie
function flipTB(data) {
  return data.slice().reverse();
}

function tileFlipTB(tile) {
  tile.data = flipTB(tile.data);
  [tile.top, tile.bottom] = [tile.bottom, tile.top];
  return tile;
}


function tileFlipLR(tile) {
  tile.data = tile.data.map(row => row.reverse());
  [tile.left, tile.right] = [tile.right, tile.left];
  return tile;
}


function setLinks(tile) {
  tile.top    = tiles.find(t => t !== tile && t.hashes.indexOf(tile.hashes[0]) > -1) || null;
  tile.right  = tiles.find(t => t !== tile && t.hashes.indexOf(tile.hashes[2]) > -1) || null;
  tile.bottom = tiles.find(t => t !== tile && t.hashes.indexOf(tile.hashes[4]) > -1) || null;
  tile.left   = tiles.find(t => t !== tile && t.hashes.indexOf(tile.hashes[6]) > -1) || null;
}


function arrangeTiles() {
  const edgeLen = Math.sqrt(tiles.length);
  const firstCorner = tiles.find(tile => tile.hashOccurrences === 12);
  setLinks(firstCorner);

  while (firstCorner.top !== null || firstCorner.left !== null) {
    tileRot90(firstCorner);
  }

  // First row
  let currentTile = firstCorner, prev = null;
  for (let col = 1; col < edgeLen; col++) {
    prev = currentTile;
    currentTile = currentTile.right;
    
    setLinks(currentTile);

    while (currentTile.left !== prev) {
      tileRot90(currentTile);
    }
    if (currentTile.top !== null) {
      tileFlipTB(currentTile);
    }
  }

  // Other rows
  firstInCol = firstCorner;
  for (let col = 0; col < edgeLen; col++) {
    let currentTile = firstInCol, prev = null;
    for (let row = 1; row < edgeLen; row++) {

      prev = currentTile;
      currentTile = currentTile.bottom;
      
      const expectedLeft = (prev && prev.left && prev.left.bottom) || null;
      
      setLinks(currentTile);

      while (currentTile.top !== prev) {
        tileRot90(currentTile);
      }
      if (currentTile.left !== expectedLeft) {
        tileFlipLR(currentTile);
      }
    }
    firstInCol = firstInCol.right;
  }

  // Convert to 2d array (we could have done that above but oh well)
  let ret = [];
  let row = firstCorner;
  while (row) {
    let arr = [];
    let col = row;
    while(col) {
      arr.push(col);
      col = col.right;
    }
    row = row.bottom;
    ret.push(arr);
  }
  return ret;
}


function nessieCoords(nessie) {
  let coords = [];
  nessie.forEach((row, rowIdx) => {
    row.forEach((chr, chrIdx) => {
      if (chr === 1) {
        coords.push([chrIdx, rowIdx]);
      } 
    });
  });
  return coords;
}


function detectNessies(image, nessie) {
  // There are a thousand ways this could be optimized,
  // but at this point I really just want to get it over with.
  let nessies = 0;
  const coords = nessieCoords(nessie);
  const nessieW = nessie[0].length;
  const nessieH = nessie.length;
  
  // Brute force: for each point (except those closer to edge than nessie's size)
  for (let y = 0, ymax = image.length - nessieH; y <= ymax; y++) {
    second: for (let x = 0, xmax = image[0].length - nessieW; x < xmax; x++) {
      // Check all nessie '#' coords relative to that point
      // Continue if any of them is does not match
      for (let point of coords) {
        if (!image[y + point[1]][x + point[0]]) {
          continue second;
        }
      }
      
      // Unset the # in all of Nessie's coords so we can count the non-Nessie #'s 
      for (let point of coords) {
        image[y + point[1]][x + point[0]] = 0;
      }
      nessies++;
    }
  }
  return !nessies ? 0 : image.reduce((sum, row) => {
    return sum + row.filter(Boolean).
      reduce((a, b) => a + b, 0);
  }, 0);
}



const image = arrangeTiles(tiles).
  // Take all but first and row, then all but first and last char of thise
  map(tRow => tRow.map(t => t.data.slice(1, -1).map(row => row.slice(1, -1)))).
  // Now turn the separate tiles into one big 2d array
  reduce((ret, tileRow) => {
    // For each row of pixels in the first tile
    tileRow[0].forEach((pixelRow, idx) => {
      ret.push(tileRow.reduce((arr, tile) => [...arr, ...tile[idx]], []));
    });
    return ret;
  }, []);


// Turn nessie into 1s and 0s, similar to the input
let nessie = [
  '                  # ', 
  '#    ##    ##    ###',
  ' #  #  #  #  #  #   '
].map(row => row.replace(/#/g, 1).replace(/ /g, 0).split('').map(parseFloat));

// Rotate Nessie instead of the whole image
let transforms = [nessie => nessie, rot90, rot90, rot90, flipTB, rot90, rot90, rot90];
while (transforms.length) {
  nessie = transforms.pop()(nessie);
  const found = detectNessies(image, nessie);

  if (found) {
    console.log('Part 2: ', found);
    break;
  }
}