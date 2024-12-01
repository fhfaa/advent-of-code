import { PuzzleDefinition } from '../puzzle';

type Point = {
  x: number;
  y: number;
}
type PathElem = {
  x: number;
  y: number;
  dir: number;
}
type Constraints = {
  min: number;
  max: number;
  len: number;
}
type ParsedMap = {
  map: string[][];
  commands: string[];
  xLimits: Constraints[];
  yLimits: Constraints[];
  maxLen: number;
  start: Point;
}

const RIGHT = 0, DOWN = 1, LEFT = 2, UP = 3;
const DELTAS = [
  [ 1, 0],
  [ 0, 1],
  [-1, 0],
  [0, -1],
];

function findXConstraints(line: string): Constraints {
  const min1 = line.indexOf('.'), min2 = line.indexOf('#');
  const max1 = line.lastIndexOf('.'), max2 = line.lastIndexOf('#');
  const min = min2 !== -1 ? Math.min(min1, min2) : min1;
  const max = max2 !== -1 ? Math.max(max1, max2) : max1;
  return { min, max, len: max - min };
}


function parse(input: string): ParsedMap {
  const [grid, dir] = input.split('\n\n');
  const xLimits: Constraints[] = [];
  const yLimits: Constraints[] = [];
  let maxLen = 0;

  const map = grid.
    split('\n').
    map(line => {
      maxLen = Math.max(maxLen, line.length);
      // Find x min/max per row
      xLimits.push(findXConstraints(line));
      return line.split('');
    });
  
  // Find y min/max per column
  for (let x = 0; x < maxLen; x++) {
    let min: number, max: number;
    for (let y = 0; y < map.length; y++) {
      if ((map[y]?.[x] ?? ' ') !== ' ') {
        min = y;
        break;
      }
    }
    for (let y = map.length - 1; y >= 0; y--) {
      if ((map[y]?.[x] ?? ' ') !== ' ') {
        max = y;
        break;
      }
    }
    yLimits.push({min, max, len: max - min});
  }

  const commands = dir.split((/(?<=\D)(?=\d)|(?<=\d)(?=\D)/));
  const start = {
    x: xLimits[0].min,
    y: 0,
  }

  return { map, commands, xLimits, yLimits, maxLen, start }
}


function drawPath(map: string[][], path: PathElem[]) {
  const arrows = ['>', 'v', '<', '^'];

  for (let {x, y, dir} of path) {
    map[y][x] = arrows[dir];
  }
  console.log(map.map(lineArr => lineArr.join('')).join('\n') + '\n');
}

/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */

const def: PuzzleDefinition = {
  year: 2022,
  day: 22,

  /* ************************************************************************* */

  part1: (input: string, isTest: boolean) => {
    const { map, xLimits, yLimits, commands, start: pos } = parse(input);
    let DIR: number = RIGHT;
    // const path: PathElem[] = [];

    for (let cmd of commands) {
      // Turn left or right
      if (cmd === 'L') {
        DIR = (DIR - 1 + 4) % 4;
        // path.at(-1).dir = DIR;
        continue; 
      }
      if (cmd === 'R') {
        DIR = (DIR + 1) % 4;
        // path.at(-1).dir = DIR;
        continue; 
      }

      let steps = parseInt(cmd);

      walk: while (steps --> 0) {
        // path.push({x: pos.x, y: pos.y, dir: DIR});
        let nextX: number, nextY: number;

        switch (DIR) {
          case RIGHT:
            nextX = pos.x !== xLimits[pos.y].max ? pos.x + 1 : xLimits[pos.y].min;
            nextY = pos.y;
            break;
          case DOWN :
            nextX = pos.x;
            nextY = pos.y !== yLimits[pos.x].max ? pos.y + 1 : yLimits[pos.x].min;
            break;
          case LEFT :
            nextX = pos.x !== xLimits[pos.y].min ? pos.x - 1 : xLimits[pos.y].max;
            nextY = pos.y;
            break;
          case UP:
            nextX = pos.x;
            nextY = pos.y !== yLimits[pos.x].min ? pos.y - 1 : yLimits[pos.x].max;
            break;
        }

        // Next tile would be a wall. Stop walking into this direction
        if (map[nextY]?.[nextX] === '#') {
          // path.at(-1).dbg = 'WALL';
          break walk;
        }
        pos.x = nextX;
        pos.y = nextY;

      }
    }
    // path.push({x: pos.x, y: pos.y, dir: DIR});
    // draw(map, path);
    return 1000 * (pos.y + 1) + 4 * (pos.x + 1) + DIR;
  },

  /* ************************************************************************* */

  part2: (input: string, isTest: boolean) => {
    if (!isTest) { return 'TODO'; }
    return 'TODO';
  },

  /* ************************************************************************* */

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 6032,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 65368,
  },/* {
    name: 'Part 2 example',
    part: 2,
    expected: 45000,
    inputFile: 'example'
  } */]
};

export default def;