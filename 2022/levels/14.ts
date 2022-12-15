import { Puzzle } from "../../puzzle";

const SPAWN = [500, 0] as Point;
const X = 0;
const Y = 1;
const ROCK = '#';
const SAND = 'o';

type Point = [number, number];
type Line = Point[];
type CaveMap = string[][];
type ParsedCave = {
  lines: Line[];
  xMin: number;
  xMax: number;
  yMax: number;
}
type CaveInfo = {
  caveMap: CaveMap;
  xLen: number;
  yMax: number; 
  spawn: [number, number]; // with fixed coords for pt.1
}


function drawCave(cave: CaveInfo): void {
  console.log(
    '\n' + 
    cave.caveMap.map((row, y) => {
      const ret = [];
      for (let x = 0; x < cave.xLen; x++) {
        ret.push(row[x] ?? '.');
      }
      if (cave.spawn[Y] === y) {
        ret[cave.spawn[X]] = 'x';
      }
      return ret.join('');
    }).join('\n') +
    '\n'
  );
}


function parseCave(input: string): ParsedCave {
  let xMin = +Infinity, xMax = -Infinity, yMax = -Infinity;

  // Find points on all lines, note overall min/max coords
  const lines: Line[] = input.
    split('\n').
    map(line => line.
      split(' -> ').
      map(point => {
        let [x, y]: number[] = point.split(',').map(parseFloat);
        xMin = Math.min(x, xMin);
        xMax = Math.max(x, xMax);
        yMax = Math.max(y, yMax);
        return [x, y]as Point;
      }) as Line);
  
  return {
    lines,
    xMin,
    xMax,
    yMax
  };
}


// Part 1:
// Normalize coordinates to allow us to only save/show the relevant rows/cols
// Walk all lines and mark every visited point as ROCK on the map
function markRocks(parsed: ParsedCave, [spawnX, spawnY]: Point): CaveInfo {
  // Initialize empty arrays for all possible y coords 
  const caveMap: CaveMap = [];
  for (let i = 0; i <= parsed.yMax; i++) {
    caveMap.push([]);
  }

  for (let line of parsed.lines) {
    // Take start of line & normalize x coord
    let cur = line.shift();
    cur[X] = cur[X] - parsed.xMin + 1;
    
    // For each other point on this line
    for (let next of line) {
      // Normalize x coord, then mark starting point as rock
      next[X] = next[X] - parsed.xMin + 1;
      caveMap[cur[Y]][cur[X]] = ROCK;

      // Get delta/direction per step to reach next point
      const dirX = Math.sign(next[X] - cur[X]);
      const dirY = Math.sign(next[Y] - cur[Y]);

      // Walk towards next step and mark all points as rock
      while (cur[X] !== next[X] || cur[Y] !== next[Y]) {
        cur[X] += dirX;
        cur[Y] += dirY;
        caveMap[cur[Y]][cur[X]] = ROCK;
      }
    }
  }
  
  // Return all info, including spawn point with normalized x coord
  return {
    caveMap: caveMap,
    xLen: parsed.xMax - parsed.xMin + 3, // +2 more to add 1 empty col left/right
    yMax: parsed.yMax,
    spawn: [spawnX - parsed.xMin + 1, spawnY]
  } as CaveInfo;
}


// Part 1:
// Simulate single grains of sand dropping
// Return true if the grain landed and stopped, false if it fell over the edge
function dropSand(cave: CaveInfo): boolean {
  const sand = [cave.spawn[X], cave.spawn[Y]];
  while (true) {
    // If we reach the bottom of the relevant map, we know the 
    // sand will keep falling forever. 
    if (sand[Y] === cave.yMax) {
      return false;
    }

    // Keep trying to drop down / down-left / down-right
    if (!cave.caveMap[sand[Y] + 1][sand[X]]) {
      sand[Y] += 1;
      continue;
    }
    if (!cave.caveMap[sand[Y] + 1][sand[X] - 1]) {
      sand[Y] += 1;
      sand[X] -= 1;
      continue;
    }
    if (!cave.caveMap[sand[Y] + 1][sand[X] + 1]) {
      sand[Y] += 1;
      sand[X] += 1;
      continue;
    }

    // If no move is possible, the sand stops. Mark it on the map
    cave.caveMap[sand[Y]][sand[X]] = SAND;
    return true;
  }
}


// Part 2:
// Same as markRocks(), but without coord normalization and returning a map,
// instead of a char/string matrix.
function prepareMemo(parsed: ParsedCave): object {
  const memo = {}

  for (let line of parsed.lines) {
    // take start of line
    let cur = line.shift();
    
    // For each other point on this line
    for (let next of line) {
      // Normalize x coord, then mark starting point as rock
      memo[`${cur[X]},${cur[Y]}`] = ROCK;

      // Get delta/direction per step to reach next point
      const dirX = Math.sign(next[X] - cur[X]);
      const dirY = Math.sign(next[Y] - cur[Y]);

      // Walk towards next point and mark everything in between as rock
      while (cur[X] !== next[X] || cur[Y] !== next[Y]) {
        cur[X] += dirX;
        cur[Y] += dirY;
        memo[`${cur[X]},${cur[Y]}`] = ROCK;
      }
    }
  }
  return memo;
}


// Part 2:
// Something something naive flood fill
function floodSand(memo: object, spawn: Point, yMax: number): number {
  const queue: Point[] = [spawn];
  let count = 0;
  
  while (queue.length) {
    const [x, y] = queue.pop();
    if (memo[`${x},${y}`]) {
      continue;
    }

    count++;
    memo[`${x},${y}`] = SAND;
    

    if (y < yMax) {
      queue.push([x - 1, y + 1]);
      queue.push([x    , y + 1]);
      queue.push([x + 1, y + 1]);
    }
  }
  return count;
}


/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */


export const P = new Puzzle({
  year: 2022,
  day: 14,

  /* ************************************************************************* */

  part1: (input: string, isTest: boolean) => {
    const parsed = parseCave(input);
    const cave = markRocks(parsed, SPAWN);

    let count = 0;
    while (dropSand(cave) && ++count);

    // drawCave(cave);
    return count;
  },

  /* ************************************************************************* */

  part2: (input: string, isTest: boolean) => {
    const parsed = parseCave(input);
    const memo = prepareMemo(parsed);
    return floodSand(memo, SPAWN, parsed.yMax + 1);
  },

  /* ************************************************************************* */

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 24,
    inputFile: 'example',
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 93,
    inputFile: 'example'
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 745,
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 27551,
  }]
});
