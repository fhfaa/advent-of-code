import { PuzzleDefinition } from "../puzzle";
import { InputUtils } from "../utils/input.utils";
import { MatrixUtils } from "../utils/matrix.utils";

type CoordsMemo = { [xy: string]: boolean; };

// x, y, direction in which the fence is placed
type Fence = [number, number, number];

type PlotInfo = {
  area: number;
  fences: Fence[];
}

const BORDER = '.';

const U = 0, R = 1, D = 2, L = 3;
const X = 0, Y = 1, DIR = 2;
const DIRECTIONS = [ [-1, 0, L], [1, 0, R], [0, -1, U], [0, 1, D] ];

// Given x/y coords, discovers the area of the plot that this point is part of,
// and a list of fences positions/directions of the fences around it.
const detectPlot = (map: string[][], checkedCoords: CoordsMemo, xx: number, yy: number, group: PlotInfo) => {
  checkedCoords[`${xx},${yy}`] = true;
  group.area += 1;

  for (let [dx, dy, wallDir] of DIRECTIONS) {
    const nX = xx + dx; // neighbourX
    const nY = yy + dy; // neighbourY
    // Neighbour different: +1 perimeter
    if (map[yy][xx] !== map[nY][nX]) {
      group.fences.push([xx, yy, wallDir]);
    // Neighbour same and not yet chacked: add it to group
    } else if(!checkedCoords[`${nX},${nY}`]) {
      detectPlot(map, checkedCoords, nX, nY, group);
    }
  }
  return group;
};


// Count the number of sides in a set of fences
// Two or more adjacent fences facing the same direction count as one side
const countSides = (fences: Fence[]): number => {
  fences = fences
    .sort((a, b) => {
      // Sort by direction first
      if (a[DIR] !== b[DIR]) {
        return a[DIR] < b[DIR] ? -1 : 1;
      }
      // Sort _ fences by y, then by x
      if (a[DIR] === U || a[DIR] === D) {
        if (a[Y] !== b[Y]) {
          return a[Y] < b[Y] ? -1 : 1;
        }
        return a[X] < b[X] ? -1 : 1;
      }
      // Sort | fences by x, then by y
      if (a[X] !== b[X]) {
        return a[X] < b[X] ? -1 : 1;
      }
      return a[Y] < b[Y] ? -1 : 1;
    });


  // _ fences:
  // remove a fence if the next fence is the one on its right
  const horizontal = fences
    .filter((fence) => fence[DIR] === U || fence[DIR] === D)
    .filter((fence, idx, arr) => {
      const next = arr[idx + 1];
      return !(next
        && next[DIR] === fence[DIR]
        && next[Y] === fence[Y]
        && next[X] === fence[X] + 1
      );
    }).length;

  // | fences
  // remove a fence if the next fence is the one below it
  const vertical = fences
    .filter((fence) => fence[DIR] === L || fence[DIR] === R)
    .filter((fence, idx, arr) => {
      const next = arr[idx + 1];
      return !(next
        && next[DIR] === fence[DIR]
        && next[X] === fence[X]
        && next[Y] === fence[Y] + 1
      );
    }).length;

  return horizontal + vertical;
}

const def: PuzzleDefinition = {
  part1: (input, isTest = false): number => {
    const map = MatrixUtils.addBorder(
      InputUtils.toCharMatrix(input),
      BORDER
    );
    
    let price = 0;
    const checkedCoords: CoordsMemo = {};

    // first non-border tile to last non-border tile
    for (let y = 1, ylen = map.length - 1; y < ylen; y++) {
      for (let x = 1, xlen = map[0].length - 1; x < xlen; x++) {

        // For each field that we haven't checked yet (i.e. wasn't touched as part of a previous group yet):
        // Find area + perimeter of its group
        if (!checkedCoords[`${x},${y}`]) {
          const plot = detectPlot(map, checkedCoords, x, y, { area: 0, fences: [] });
          price += (plot.area * plot.fences.length);
        }
      }
    }

    return price;
  },


  part2: (input, isTest = false): number => {
    const map = MatrixUtils.addBorder(
      InputUtils.toCharMatrix(input),
      BORDER
    );
    
    let price = 0;
    const checkedCoords: CoordsMemo = {};
    
    for (let y = 1, ylen = map.length - 1; y < ylen; y++) {
      for (let x = 1, xlen = map[0].length - 1; x < xlen; x++) {

        if (!checkedCoords[`${x},${y}`]) {
          const plot = detectPlot(map, checkedCoords, x, y, { area: 0, fences: [] });
          price += plot.area * countSides(plot.fences);
        }
      }
    }

    return price;
  },


  tests: [{
    name: 'Part 1 example XO',
    part: 1,
    expected: 772,
    input: `OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`,
  }, {
    name: 'Part 1 example small',
    part: 1,
    expected: 140,
    inputFile: 'example',
  }, {
    name: 'Part 1 example large',
    part: 1,
    expected: 1930,
    inputFile: 'example2',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 1359028,
  }, {
    name: 'Part 2 example ABCD',
    part: 2,
    expected: 80,
    inputFile: 'example',
  }, {
    name: 'Part 2 example XE',
    part: 2,
    expected: 236,
    input: `EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`,
  }, {
    name: 'Part 2 example AB',
    part: 2,
    expected: 368,
    input: `AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`,
  }, {
    name: 'Part 2 example large',
    part: 2,
    expected: 1206,
    inputFile: 'example2',
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 839780,
  }]
};

export default def;