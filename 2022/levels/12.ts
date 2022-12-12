import { Puzzle } from "../../puzzle";

type Point = {
  x: number;
  y: number;
  elevation: number;
}
type Scores = Record<string, number>;
type NotQueueEntry = {
  prio: number;
  val: Point;
}
type NotQueue = NotQueueEntry[];


// Worst priority array-ueue ever
function prioInsert(queue: NotQueue, val: Point, prio: number) {
  for (let i = 0, len = queue.length; i < len; i++) {
    if (queue[i].val === val) {
      return;
    }
    // Elem in queue has higher prio --> insert our elem here
    if (queue[i].prio > prio) {
      queue.splice(i, 0, {prio, val});
      return;
    }
  }
  // If no place found before, add new item to end of queue
  queue.push({prio, val});
}


function simpleAStar(map: Point[][], start: Point, finish: Point, score: Scores) {
  const neighbors = [[-1, 0], [0, -1], [1, 0], [0, 1]];

  score[`${start.x},${start.y}`] = 0;
  const queue: NotQueue = [{val: start, prio: 1}]; // init queue with starting point

  // Use manhattan distance or height distance (which ever is higher) as estimate for distance.
  // Could leave it out for this input and implementation. Difference in perf is negligible.
  const estimate = (point: Point) => Math.max(
    Math.abs(start.x - point.x) + Math.abs(start.y - point.y),
    Math.abs(finish.elevation - point.elevation)
  );
  
  while (queue.length) {
    // Take first element from queue (with lowest priority / score)
    const current = queue.shift().val;

    // If we've reached the end, return its score (= number of steps)
    if (current === finish) {
      return score[`${finish.x},${finish.y}`];
    }

    // For each neighbour, see what the score would be if we went there from the current spot.
    // If it's better than the best result we already know (or Infinity), remember the score.
    for (let [dx, dy] of neighbors) {
      const neighbor = map[current.y + dy]?.[current.x + dx];

      // Skip if neighbour doesn't exit (we're at the edge of the map)
      // Or if the neighbour is too high (elevation delta > 1)
      if (!neighbor || neighbor.elevation - current.elevation > 1) {
        continue;
      }

      const newScore =  score[`${current.x},${current.y}`] + 1;

      if (newScore < score[`${neighbor.x},${neighbor.y}`]) {
        score[`${neighbor.x},${neighbor.y}`] = newScore;
        
        // IF better path found, add the neighbor node to the queue, using new score to 
        // determine position in queue (lowest score first), so we try the most promising 
        // path first in the next iteration.
        prioInsert(queue, neighbor, newScore + estimate(neighbor));
      }
    }
  }
  throw new Error('No way found!');
}



export const P = new Puzzle({
  year: 2022,
  day: 12,


  part1: (input: string, isTest: boolean) => {
    let start: Point, finish: Point;
    const score: Scores = {}

    const map = input.
      split('\n').
      map((s, y) => s.split('').map((c: string, x: number): Point => {
        score[`${x},${y}`] = +Infinity; 

        switch (c) {
          case 'S':
              start = {x, y, elevation: 0}; // 1 lower than the lowest (a)
              return start;
          case 'E':
            finish = {x, y, elevation: 27}; // 1 higher than the highest (z)
            return finish;
          default:
            return {x, y, elevation: c.charCodeAt(0) - 96};
        }
      }));
    
    return simpleAStar(map, start, finish, score);
  },


  part2: (input: string, isTest: boolean) => {
    let starts: Point[] = [], finish: Point;
    const score: Scores = {}

    const map = input.
      split('\n').
      map((s, y) => s.split('').map((c: string, x: number): Point => {
        score[`${x},${y}`] = +Infinity;

        switch (c) {
          case 'E':
            finish = {x, y, elevation: 27} as Point;
            return finish;
          case 'S':
            return {x, y, elevation: 0} as Point;
          case 'a':
            // Remember all a's as potential starting points, then fallthru
            starts.push({x, y, elevation: c.charCodeAt(0) - 96} as Point);
          default:
            return {x, y, elevation: c.charCodeAt(0) - 96} as Point;
        }
      }));

    const pathLengths: number[] = [];
    for (let start of starts) {
      try {
        // Run A* for each of the starting points:
        // Save each point's current score before the run so we can restore it
        // afterwards, because it's re-initialized with 0 at the start of the run.
        const tmpScore = score[`${start.x},${start.y}`];
        pathLengths.push(simpleAStar(map, start, finish, score));
        score[`${start.x},${start.y}`] = tmpScore;
      } catch (ex) { } 
    }
    
    return Math.min(...pathLengths);
  },


  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 31,
    inputFile: 'example',
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 29,
    inputFile: 'example'
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 330,
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 321,
  }]
});
