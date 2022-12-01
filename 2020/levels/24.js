const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew`;
/* */


const movements = {
  ne: [ 0, -1,  1],
  e:  [ 1, -1,  0],
  se: [ 1,  0, -1],
  sw: [ 0,  1, -1],
  w:  [-1,  1,  0],
  nw: [-1,  0,  1]
};

// pt.1
const data1 = input.
  split('\n').
  map(s => {
    return s.
      // Split after each w or e
      split(/(?<=[we])/).
      reduce((pos, next) => {
        // Apply move according to somewhere-between-2-and-3d hex grid
        move = movements[next];
        return [pos[0] + move[0], pos[1] + move[1], pos[2] + move[2]];
      },[0, 0, 0])
  }).
  reduce((memo, next) => {
    coords = next.join(',');
    memo[coords] = !memo[coords];
    return memo;
  }, {});

const part1 = Object.keys(data1).filter(key => data1[key] === true).length;
console.log('Part 1: ', part1);


// pt.2
// Convert black square data to {"x,y,z": [x, y, z]} objects
let data2 = data1;
data2 = Object.keys(data2).filter(key => data2[key]).reduce((ret, key) => {
  ret[key] = key.split(',').map(parseFloat);
  return ret;
}, {});


function check(oldMap, newMap, x, y, z) {
  const key = `${x},${y},${z}`;
  const wasBlack = oldMap[key];

  // Skipthis tile if already checked as a neighbour of another tile
  if (newMap[key]) { return; }

  let neighbours = [
    oldMap[`${x    },${y - 1},${z + 1}`],
    oldMap[`${x + 1},${y - 1},${z    }`],
    oldMap[`${x + 1},${y    },${z - 1}`],
    oldMap[`${x    },${y + 1},${z - 1}`],
    oldMap[`${x - 1},${y + 1},${z    }`],
    oldMap[`${x - 1},${y    },${z + 1}`]
  ].filter(Boolean).length;

  if ((wasBlack && neighbours === 1) || neighbours === 2) {
    newMap[key] = [x, y, z];
  }
}

for (i = 1; i <= 100; i++) {
  let newData = {};

  // For each black tile from the previous round
  for (let coordStr of Object.keys(data2)) {
    let [x, y, z] = data2[coordStr];

    // Check the tile itself and all of its neighbours
    check(data2, newData, x    , y - 1, z + 1);
    check(data2, newData, x + 1, y - 1, z    );
    check(data2, newData, x + 1, y    , z - 1);
    check(data2, newData, x    , y    , z    );
    check(data2, newData, x    , y + 1, z - 1);
    check(data2, newData, x - 1, y + 1, z    );
    check(data2, newData, x - 1, y    , z + 1);
  }
  // console.log('Round ', i, ' finished: ', Object.keys(newData).length, ' black.');
  data2 = newData;
}
console.log('Part 2: ', Object.keys(data2).length);
