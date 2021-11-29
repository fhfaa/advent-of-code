
const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/, '');

/* *
input = `.#.
..#
###`;
/* */

// pt.1
const getIndex = (n1, n2, n3) => `${n1},${n2},${n3}`;

let map = input.split('\n').reduce((ret, s, iy) => {
  s.split('').forEach((x, ix) => {
    if (x === '#') {
      ret[getIndex(ix,iy,0)] = 1;
    }
  });
  return ret;
}, {});

let xymin = 0, xymax = input.split('\n').length;
let zmin = 0, zmax = 0;
let iterations = 0;

do {
  let newMap = {};
  xymin--; zmin--;
  xymax++; zmax++;

  for (let x = xymin; x <= xymax; x++) {
    for (let y = xymin; y <= xymax; y++) {
      for (let z = zmin; z <= zmax; z++) {
        const isActive = map[getIndex(x, y, z)] ? 1 : 0;

        const neighbours = [
          map[getIndex(x-1, y-1, z-1)], 
          map[getIndex(x-1,   y, z-1)], 
          map[getIndex(x-1, y+1, z-1)],
          map[getIndex(  x, y-1, z-1)], 
          map[getIndex(  x,   y, z-1)], 
          map[getIndex(  x, y+1, z-1)],
          map[getIndex(x+1, y-1, z-1)], 
          map[getIndex(x+1,   y, z-1)], 
          map[getIndex(x+1, y+1, z-1)], 
          // --
          map[getIndex(x-1, y-1, z)], 
          map[getIndex(x-1,   y, z)], 
          map[getIndex(x-1, y+1, z)],
          map[getIndex(  x, y-1, z)], 
          // map[getIndex(  x,   y, z)], 
          map[getIndex(  x, y+1, z)],
          map[getIndex(x+1, y-1, z)], 
          map[getIndex(x+1,   y, z)], 
          map[getIndex(x+1, y+1, z)], 

          map[getIndex(x-1, y-1, z+1)], 
          map[getIndex(x-1,   y, z+1)], 
          map[getIndex(x-1, y+1, z+1)],
          map[getIndex(  x, y-1, z+1)], 
          map[getIndex(  x,   y, z+1)], 
          map[getIndex(  x, y+1, z+1)],
          map[getIndex(x+1, y-1, z+1)], 
          map[getIndex(x+1,   y, z+1)], 
          map[getIndex(x+1, y+1, z+1)]
        ].filter(Boolean).length;
        
        if (isActive) {
          if (neighbours === 2 || neighbours === 3) {
            newMap[getIndex(x,y,z)] = 1;
          }
        } else {
          if (neighbours === 3) {
            newMap[getIndex(x,y,z)] = 1;
          }
        }
      }
    }
  }
  map = newMap;
} while (++iterations < 6);


console.log('Part 1: ', Object.keys(map).length);


// pt.2
map = input.split('\n').reduce((ret, s, iy) => {
  s.split('').forEach((x, ix) => {
    if (x === '#') {
      ret[`${ix},${iy},0,0`] = 1;
    }
  });
  return ret;
}, {});


xymin = 0; xymax = input.split('\n').length;
zmin = 0, zmax = 0;
iterations = 0;

do {
  let newMap = {};
  xymin--; zmin--;
  xymax++; zmax++;

  for (let x = xymin; x <= xymax; x++) {
    for (let y = xymin; y <= xymax; y++) {
      for (let z = zmin; z <= zmax; z++) {
        for (let w = zmin; w <= zmax; w++) {
          const isActive = map[`${x},${y},${z},${w}`] ? 1 : 0;

          const neighbours = [
            map[`${x-1},${y-1},${z-1},${w-1}`], 
            map[`${x-1},${y},${z-1},${w-1}`], 
            map[`${x-1},${y+1},${z-1},${w-1}`],
            map[`${x},${y-1},${z-1},${w-1}`], 
            map[`${x},${y},${z-1},${w-1}`], 
            map[`${x},${y+1},${z-1},${w-1}`],
            map[`${x+1},${y-1},${z-1},${w-1}`], 
            map[`${x+1},${y},${z-1},${w-1}`], 
            map[`${x+1},${y+1},${z-1},${w-1}`], 
            
            map[`${x-1},${y-1},${z},${w-1}`], 
            map[`${x-1},${y},${z},${w-1}`], 
            map[`${x-1},${y+1},${z},${w-1}`],
            map[`${x},${y-1},${z},${w-1}`], 
            map[`${x},${y},${z},${w-1}`], 
            map[`${x},${y+1},${z},${w-1}`],
            map[`${x+1},${y-1},${z},${w-1}`], 
            map[`${x+1},${y},${z},${w-1}`], 
            map[`${x+1},${y+1},${z},${w-1}`], 

            map[`${x-1},${y-1},${z+1},${w-1}`], 
            map[`${x-1},${y},${z+1},${w-1}`], 
            map[`${x-1},${y+1},${z+1},${w-1}`],
            map[`${x},${y-1},${z+1},${w-1}`], 
            map[`${x},${y},${z+1},${w-1}`], 
            map[`${x},${y+1},${z+1},${w-1}`],
            map[`${x+1},${y-1},${z+1},${w-1}`], 
            map[`${x+1},${y},${z+1},${w-1}`], 
            map[`${x+1},${y+1},${z+1},${w-1}`],
            // -------------------------
            map[`${x-1},${y-1},${z-1},${w}`], 
            map[`${x-1},${y},${z-1},${w}`], 
            map[`${x-1},${y+1},${z-1},${w}`],
            map[`${x},${y-1},${z-1},${w}`], 
            map[`${x},${y},${z-1},${w}`], 
            map[`${x},${y+1},${z-1},${w}`],
            map[`${x+1},${y-1},${z-1},${w}`], 
            map[`${x+1},${y},${z-1},${w}`], 
            map[`${x+1},${y+1},${z-1},${w}`], 
            
            map[`${x-1},${y-1},${z},${w}`], 
            map[`${x-1},${y},${z},${w}`], 
            map[`${x-1},${y+1},${z},${w}`],
            map[`${x},${y-1},${z},${w}`], 
            // map[`${x},${y},${z},${w}`], 
            map[`${x},${y+1},${z},${w}`],
            map[`${x+1},${y-1},${z},${w}`], 
            map[`${x+1},${y},${z},${w}`], 
            map[`${x+1},${y+1},${z},${w}`], 

            map[`${x-1},${y-1},${z+1},${w}`], 
            map[`${x-1},${y},${z+1},${w}`], 
            map[`${x-1},${y+1},${z+1},${w}`],
            map[`${x},${y-1},${z+1},${w}`], 
            map[`${x},${y},${z+1},${w}`], 
            map[`${x},${y+1},${z+1},${w}`],
            map[`${x+1},${y-1},${z+1},${w}`], 
            map[`${x+1},${y},${z+1},${w}`], 
            map[`${x+1},${y+1},${z+1},${w}`],
            // -------------------------
            map[`${x-1},${y-1},${z-1},${w+1}`], 
            map[`${x-1},${y},${z-1},${w+1}`], 
            map[`${x-1},${y+1},${z-1},${w+1}`],
            map[`${x},${y-1},${z-1},${w+1}`], 
            map[`${x},${y},${z-1},${w+1}`], 
            map[`${x},${y+1},${z-1},${w+1}`],
            map[`${x+1},${y-1},${z-1},${w+1}`], 
            map[`${x+1},${y},${z-1},${w+1}`], 
            map[`${x+1},${y+1},${z-1},${w+1}`], 
            
            map[`${x-1},${y-1},${z},${w+1}`], 
            map[`${x-1},${y},${z},${w+1}`], 
            map[`${x-1},${y+1},${z},${w+1}`],
            map[`${x},${y-1},${z},${w+1}`], 
            map[`${x},${y},${z},${w+1}`], 
            map[`${x},${y+1},${z},${w+1}`],
            map[`${x+1},${y-1},${z},${w+1}`], 
            map[`${x+1},${y},${z},${w+1}`], 
            map[`${x+1},${y+1},${z},${w+1}`], 

            map[`${x-1},${y-1},${z+1},${w+1}`], 
            map[`${x-1},${y},${z+1},${w+1}`], 
            map[`${x-1},${y+1},${z+1},${w+1}`],
            map[`${x},${y-1},${z+1},${w+1}`], 
            map[`${x},${y},${z+1},${w+1}`], 
            map[`${x},${y+1},${z+1},${w+1}`],
            map[`${x+1},${y-1},${z+1},${w+1}`], 
            map[`${x+1},${y},${z+1},${w+1}`], 
            map[`${x+1},${y+1},${z+1},${w+1}`]
          ].filter(Boolean).length;
          
          if (isActive) {
            if (neighbours === 2 || neighbours === 3) {
              newMap[`${x},${y},${z},${w}`] = 1;
            }
          } else {
            if (neighbours === 3) {
              newMap[`${x},${y},${z},${w}`] = 1;
            }
          }
        }
      }
    }
  }
  map = newMap;
} while (++iterations < 6);

console.log('Part 2: ', Object.keys(map).length);