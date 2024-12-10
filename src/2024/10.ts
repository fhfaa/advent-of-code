import { PuzzleDefinition } from "../puzzle";
import { InputUtils } from "../utils/input.utils";
import { CoordsSet, MatrixUtils } from "../utils/matrix.utils";

type Parsed = {
  map: number[][],
  trailheads: CoordsSet
};

type NotASet = { [xy: string]: number };

const parseInput = (input: string): Parsed => {
  const map = MatrixUtils.addBorder(
    InputUtils.toNumberMatrix(input),
    -1
  );
  const trailheads = MatrixUtils.findCoords(map, 0);

  return { map, trailheads };
}


const getTrailheadScore1 = (map: number[][], xy: string): number => {
  let set = new Set<string>([xy]);

  // Next higher number to look for
  for (let i = 1; i <= 9; i++) {
    const next = new Set<string>();
    
    // For each coord with the previous number
    for (let xy2 of set.keys()) {
      const [x, y] = xy2.split(',').map(parseFloat);

      // Find unique neighbours that are one higher
      if (map[y - 1][x] === i) {
        next.add(`${x},${y - 1}`);
      }
      if (map[y + 1][x] === i) {
        next.add(`${x},${y + 1}`);
      }
      if (map[y][x - 1] === i) {
        next.add(`${x - 1},${y}`);
      }
      if (map[y][x + 1] === i) {
        next.add(`${x + 1},${y}`);
      }
    }

    if (set.size) {
      set = next;
    } else {
      // Abort if there aren't any
      return 0;
    }
  }

  // Return number of distinct nines reached
  return set.size;
}


const getTrailheadScore2 = (map: number[][], xy: string): number => {
  // Score: number of ways to get to this coord
  let set: NotASet = {[xy]: 1}

  for (let i = 1; i <= 9; i++) {
    const next: NotASet = {};
    
    for (let xy2 of Object.keys(set)) {
      const score = set[xy2];
      const [x, y] = xy2.split(',').map(parseFloat);

      // Find unique neighbours that are one higher
      // Keep counting the total number of ways to get to each
      // (sum of scores of coords one lower that lead here)
      if (map[y - 1][x] === i) {
        next[`${x},${y - 1}`] = (next[`${x},${y - 1}`] ?? 0) + score;
      }
      if (map[y + 1][x] === i) {
        next[`${x},${y + 1}`] = (next[`${x},${y + 1}`] ?? 0) + score;
      }
      if (map[y][x - 1] === i) {
        next[`${x - 1},${y}`] = (next[`${x - 1},${y}`] ?? 0) + score;
      }
      if (map[y][x + 1] === i) {
        next[`${x + 1},${y}`] = (next[`${x + 1},${y}`] ?? 0) + score;
      }
    }

    if (Object.keys(set).length) {
      set = next;
    } else {
      return 0;
    }
  }

  // Return sum of the numbers of distinct paths to each 9
  return Object.keys(set).reduce((sum, xy) => {
    return sum + set[xy];
  }, 0);
}


const def: PuzzleDefinition = {
  part1: (input, isTest = false): number => {
    const { map, trailheads } = parseInput(input);

    return Array.from(trailheads.keys()).reduce((total, trailheadXY) => {
      const score = getTrailheadScore1(map, trailheadXY);
      return total + score;
    }, 0);
  },


  part2: (input, isTest = false): number => {
    const { map, trailheads } = parseInput(input);

    return Array.from(trailheads.keys()).reduce((total, trailheadXY) => {
      const score = getTrailheadScore2(map, trailheadXY);
      return total + score;
    }, 0);
  },


  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 36,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 531,
  }, {
    name: 'Part 2 example small a',
    part: 2,
    expected: 3,
    inputFile: 'example2a'
  }, {
    name: 'Part 2 example small b',
    part: 2,
    expected: 13,
    inputFile: 'example2b'
  }, {
    name: 'Part 2 example small c',
    part: 2,
    expected: 227,
    inputFile: 'example2c'
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 81,
    inputFile: 'example'
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 1210,
  }]
};

export default def;