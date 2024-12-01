import { PuzzleDefinition } from '../puzzle';


type Point = {
  x: number;
  y: number;
}
type DirPoint = Point & { dir: Dir };
type Dir = 'U' | 'D' | 'L' | 'R';
const DELTAS: Record<Dir, [number, number]> = {
  'U': [ 0, -1],
  'L': [-1,  0],
  'D': [ 0,  1],
  'R': [ 1,  0],
};
const NEXT: Record<Dir, [Dir, Dir]> = {
  'R': ['U', 'D'],
  'L': ['U', 'D'],
  'U': ['R', 'L'],
  'D': ['R', 'L'],
}; 
type NotQueueEntry = {
  prio: number;
  val: DirPoint;
}
type NotQueue = NotQueueEntry[];


// Worst priority array-ueue ever, copypasted from 2022
function prioInsert(queue: NotQueue, x: number, y: number, prio: number, dir: Dir) {
  for (let i = 0, len = queue.length; i < len; i++) {
    // Elem in queue has higher prio --> insert our elem here 
    if (queue[i].prio > prio) {
      queue.splice(i, 0, {prio, val: {x, y, dir}} as NotQueueEntry);
      return;
    }
  }
  // If no place found before, add new item to end of queue
  queue.push({prio, val: {x, y, dir}});
}


function aStar(map: number[][], start: Point, finish: Point, MIN_STRAIGHT = 1, MAX_STRAIGHT = 3) {
  const heatLoss: Record<string, number> = {};
  const queue: NotQueue = [];

  for (let dir of Object.keys(DELTAS)) {
    heatLoss[`0,0,${dir}`] = 0;
    queue.push({ prio: 1, val: { ...start, dir: dir as Dir }});
  };
  
  outer: while (queue.length) {
    // Take first element from queue (lowest prio val = highest priority)
    const entry = queue.shift();
    const {x, y, dir} = entry.val;

    // If we've reached the end, return its score (heat loss)
    if (x === finish.x && y === finish.y) {
      return heatLoss[`${finish.x},${finish.y},${dir}`];
    }
    
    const [dx, dy] = DELTAS[dir]; 

    let newHeatLoss = heatLoss[`${x},${y},${dir}`];

    if (MIN_STRAIGHT > 1) {
      if (map[y + dy * MIN_STRAIGHT]?.[x + dx * MIN_STRAIGHT] === undefined) {
        continue outer;
      }
      for (let i = 1; i < MIN_STRAIGHT; i++) {
        newHeatLoss += map[y + dy * i][x + dx * i];
      }
    }


    // Try to walk 1..3 steps
    for (let steps = MIN_STRAIGHT; steps <= MAX_STRAIGHT; steps++) {
      const destX = x + dx * steps;
      const destY = y + dy * steps;

      // Abort if destionation doesn't exist (is outside of the map)
      if (map[destY]?.[destX] === undefined) {
        continue outer;
      }
      newHeatLoss += map[destY][destX];

      // For each destinatuon, see what the score would be if we went there from the current spot.
      // If it's better than the best result we already know (or Infinity), remember the score.
      let [dir1, dir2]: Dir[] = NEXT[dir];

      // If better path found, add the neighbor node to the queue, using new score to 
      // determine position in queue (lowest score first), so we try the most promising 
      // path first in the next iteration.
      if (newHeatLoss < (heatLoss[`${destX},${destY},${dir1}`] ?? +Infinity)) {
        heatLoss[`${destX},${destY},${dir1}`] = newHeatLoss;
        prioInsert(queue, destX, destY, newHeatLoss, dir1);
      }
      if (newHeatLoss < (heatLoss[`${destX},${destY},${dir2}`] ?? +Infinity)) {
        heatLoss[`${destX},${destY},${dir2}`] = newHeatLoss;
        if (map[destY])
        prioInsert(queue, destX, destY, newHeatLoss, dir2);
      }
    }
  }
  console.log('queue emoty')
  throw new Error('No way found!');
}


/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */

const def: PuzzleDefinition = {
  year: 2023,
  day: 17,

  /* ************************************************************************* */

  part1: (input: string, isTest: boolean) => {
    const map = input.
      split('\n').
      map((line) => line.
        split('').
        map((chr: string): number => +chr)
      );

    const start: Point = { x: 0, y: 0 };
    const finish: Point = { x: map[0].length - 1, y: map.length -1 };
    
    return aStar(map, start, finish, 1, 3);
  },

  /* ************************************************************************* */

  part2: (input: string, isTest: boolean) => {
    const map = input.
      split('\n').
      map((line) => line.
        split('').
        map((chr: string): number => +chr)
      );

    const start: Point = { x: 0, y: 0 };
    const finish: Point = { x: map[0].length - 1, y: map.length -1 };
    
    return aStar(map, start, finish, 4, 10);
  },

  /* ************************************************************************* */

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 102,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 694,
  }, {
    name: 'Part 2 example A',
    part: 2,
    expected: 94,
    inputFile: 'example'
  }, {
    name: 'Part 2 example B',
    part: 2,
    expected: 71,
    inputFile: 'example2'
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 829,
  }]
};

export default def;