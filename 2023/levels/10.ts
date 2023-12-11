import { Puzzle } from "../../puzzle";

// "from" is the direction U/D/L/R we came from in the previous step
// A pipe has faces two directions, so removing the one we came from
// tells us where we go next.
type Pipe = {
  x: number;
  y: number;
  from?: number; 
};

// Directions and special marker for the start
const U = 2 ** 0;
const R = 2 ** 1;
const D = 2 ** 2;
const L = 2 ** 3;
const START = 2 ** 4;

// Map pipe symbols in input to directions in our 2d array
const pipeTypes = {
  '|': U | D,
  '-': L | R,
  '7': L | D,
  'F': R | D,
  'J': U | L,
  'L': U | R,
  'S': START
};

// Pt 2
type Constraints = {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
};


const findStartAndNext = (rows: number[][]): Pipe[] => {
  let start: Pipe;

  // Find start coord (S)
  for (let y = 0; y < rows.length; y+= 1) {
    const x = rows[y].indexOf(START);
    if (x > -1) {
      start = { y, x };
      break;
    }
  }

  // Since the start pipe doesn't tell us where it is facing, find an adjacent
  // pipe that is pointed towards the start. Then return the coords of both start
  // and whichever of the two connected pipes we find first.
  const possibleNext: [number, number, number][] = [
    [-1,  0, R], [ 1,  0, L],
    [ 0, -1, D], [ 0,  1, U]
  ];

  for (let [ dx, dy, dirNeeded ] of possibleNext) {
    const adjacent = rows[start.y + dy]?.[start.x + dx];
    if (adjacent && (adjacent & dirNeeded) > 0) {
      return [start, {
        y: start.y + dy,
        x: start.x + dx,
        from: dirNeeded,
      }];
    }
  }
}


const findLoop = (map: number[][]): Pipe[] => {
  const pipes = findStartAndNext(map);
    
  while (true) {
    const current = pipes.at(-1);

    let next: Pipe;
    // We know where we are and where we came from.
    // We use the direction we came from to figure out the next direction
    switch (map[current.y][current.x] & ~current.from) {
      case L: next = { x: current.x - 1, y: current.y, from: R }; break;
      case R: next = { x: current.x + 1, y: current.y, from: L }; break;
      case U: next = { x: current.x, y: current.y - 1, from: D }; break;
      case D: next = { x: current.x, y: current.y + 1, from: U }; break;
    }

    // The loop has finished when we're back at the start
    if (map[next.y][next.x] === START) {
      break;
    }
    pipes.push(next);
  }

  return pipes;
}


// Figure out what kind of tile the start really is -
// i.e. what directions it is connected to.
const fixStart = (map: number[][], pipes: Pipe[]) => {
  // An ugly (dir<<<2) with 4 bit.
  const invertDir = (dir: number) => {
    const shifted = dir << 2;
    return ((shifted & 0b110000) >> 4) | (shifted & 0b1111);
  }
  
  // The first direction of our start tile is the opposite 
  // direction of start.next.from
  const dir1 = invertDir(pipes[1].from);

  // The second direction of our start tile is:
  // <both directions of the last pipe> minus <the one it came from>
  const last = pipes.at(-1);
  const dir2 = invertDir(map[last.y][last.x] &~ last.from);
  map[pipes[0].y][pipes[0].x] = dir1 | dir2;
}


// Get min/max y/x coords of the pipe loop to optimize our for-loops
const getConstraints = (pipes: Pipe[]): Constraints => {
  const xs = pipes.map(pipe => pipe.x);
  const ys = pipes.map(pipe => pipe.y);
  return {
    xmin: Math.min(...xs),
    xmax: Math.max(...xs),
    ymin: Math.min(...ys),
    ymax: Math.max(...ys),
  }
}


/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */


export const P = new Puzzle({
  year: 2023,
  day: 10,

  /* ************************************************************************* */

  part1: (input: string, isTest: boolean) => {
    const map = input.
      split('\n').
      map(line => line.
        split('').
        map(chr => pipeTypes[chr] || 0)
      );

    const pipes = findLoop(map);

    // The furthest point is half the length of the whole pipe away
    return pipes.length / 2
  },

  /* ************************************************************************* */

  part2: (input: string, isTest: boolean) => {
    let map: number[][] = input.
      split('\n').
      map(line => line.
        split('').
        map(chr => pipeTypes[chr] || 0)
      );

      const pipes = findLoop(map);
      fixStart(map, pipes);

      // Replace all tiles on the mapthat are not part of the pipe loop
      // with zeroes. The 0s are the places that we will then examine to
      // see if they're inside the loop.
      const pipeCoords = pipes.reduce((ret, pipe) => {
        ret[`${pipe.x},${pipe.y}`] = true;
        return ret;
      }, {});
      map = map.
        map((row, y) => row.
          map((chr, x) => pipeCoords[`${x},${y}`] ? chr : 0)
        );
      
    // Find the min/max points that the pipe occupies and only check
    // those points. The ones outside can't be inside (duh).
    const { xmin, xmax, ymin, ymax } = getConstraints(pipes);
    
    let numInside = 0;
    for (let y = ymin; y <= ymax; y++) {
      let inside = false;

      for (let x = xmin; x <= xmax; x++) {
        // A pipe that belongs to the loop.
        // Only count tiles that go up (L, | and J -- but not F and 7)!
        // If we're past an odd number of these we're inside.
        if (map[y][x]) {
          if (map[y][x] & U) {
            inside = !inside;
          }
        
        // We hit a non-loop tile. If we're currently inside
        // the loop as per the check above, count it (adds 0 if false)
        } else {
          numInside += +inside;
        }
      }
    }

    return numInside;
  },

  /* ************************************************************************* */

  tests: [{
    name: 'Part 1 example 1',
    part: 1,
    expected: 4,
    inputFile: 'example',
  }, {
    name: 'Part 1 example 2',
    part: 1,
    expected: 8,
    inputFile: 'example1b',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 6870,
  }, {
    name: 'Part 2 example A',
    part: 2,
    expected: 4,
    inputFile: 'example2a',
  }, {
    name: 'Part 2 example B',
    part: 2,
    expected: 8,
    inputFile: 'example2b',
  }, {
    name: 'Part 2 example C',
      part: 2,
    expected: 10,
    inputFile: 'example2c',
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 287,
  }]
});
