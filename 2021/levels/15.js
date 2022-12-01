const fs = require('fs');;
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`;
/* =40 */

/* *
input = `1119
9919
9119
9199
9112`;
/* =10 */

input = input.split('\n').map(s => s.split('').map(parseFloat));


// Worst priority array-ueue ever
function prioInsert(queue, val, prio) {
  for (let i = 0, len = queue.length; i < len; i++) {
    if (queue[i] === val) {
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


function simpleAStar(input) {
  // Use Manhattan distance as rough estimate of expected score needed from point to finish
  // Could leave it out for this input and implementation. Difference in perf is near 0.
  const estimate = point => input.length + input[0].length - point.x - point.y - 2;

  const neighbors = [[-1, 0], [0, -1], [1, 0], [0, 1]];

  // Map of cost of the cheapest path from start to current node
  const score = {};

  // Turn int[][] of costs into obj[][] of costs + x/y coords
  // Init all scores with +Infinity (except 0,0 - see below)
  input = input.map((line, y) => line.map((cost, x) => {
    score[`${x},${y}`] = Infinity; 
    return { cost, x, y }
  }));

  score['0,0'] = 0;
  const finish = input[input.length - 1][input[0].length - 1];
  const queue = [{val: input[0][0]}]; // init queue with starting point

  while (queue.length) {
    // Take first element from queue (with lowest priority / score)
    const current = queue.shift().val;

    // If we've reached the end, return its score
    if (current === finish) {
      return score[`${finish.x},${finish.y}`]
    }

    // For each neighbour, see what the score would be if we went there from the current spot.
    // If it's better than the best result we already know (or Infinity), remember the score.
    for (let [dx, dy] of neighbors) {
      const neighbor = input[current.y + dy]?.[current.x + dx];

      if (neighbor) {
        const tmpScore = score[`${current.x},${current.y}`] + neighbor.cost;

        if (tmpScore < score[`${neighbor.x},${neighbor.y}`]) {
          score[`${neighbor.x},${neighbor.y}`] = tmpScore;
          
          // IF better path found, add the neighbor node to the queue, using new score to 
          // determine position in queue (lowest score first), so we try the most promising 
          // path first in the next iteration.
          prioInsert(queue, neighbor, tmpScore + estimate(neighbor));
        }
      }
    }
  }
  throw new Error('No way found!');
}

// pt.1
console.log('Part 1: ', simpleAStar(input));


// pt.2
function getFullMap(input) {
  // Map fn to increase numbers and wrap around from 9 to 1
  const add = (row, inc) => row.map(num => {
    const newNum = num + inc;
    return newNum > 9 ? newNum - 9 : newNum;
  });

  // Repeat map horizontally
  input = input.map(row => [
    ...row,
    ...add(row, 1), ...add(row, 2),
    ...add(row, 3), ...add(row, 4)
  ]);

  // Repeat map vertically
  for (let i = 0,len = input.length * 4; i < len; i++) {
    input.push(add(input[i], 1));  
  }

  return input;
}


console.log('Part 2: ', simpleAStar(getFullMap(input)));
