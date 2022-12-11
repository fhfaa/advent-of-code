
import { Puzzle } from "../../puzzle";

type Point = [number, number];
type MoveFn = (head: Point, tail: Point) => void;
const X = 0, Y = 1;


export const P = new Puzzle({
  year: 2022,
  day: 9,


  part1: (input: string, isTest: boolean) => {
    const visited = new Set<string>();
    const head: Point = [0, 0];
    const tail: Point = [0, 0];

    const moves: {[key: string]: MoveFn} = {
      'U': (h, t) => { if (h[1]++ > t[1]) { t[1]++; t[0] = h[0]; }},
      'D': (h, t) => { if (h[1]-- < t[1]) { t[1]--; t[0] = h[0]; }},
      'L': (h, t) => { if (h[0]-- < t[0]) { t[0]--; t[1] = h[1]; }},
      'R': (h, t) => { if (h[0]++ > t[0]) { t[0]++; t[1] = h[1]; }},
    };

    input.split('\n').map(row => {
      const dir = row[0];
      let steps = +row.substring(2);

      while (steps --> 0) {
        moves[dir](head, tail);
        visited.add(tail[0] + ',' + tail[1]);
      }
    });
    return visited.size;
  },


  part2: (input: string, isTest: boolean) => {
    const elems: Point[] = [
      [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
      [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
    ];
    const lastElem = elems.at(-1);
    const visited = new Set<string>();
    
    input.split('\n').forEach(row => {
      let num = +row.substring(2);
      while (num --> 0) {
        switch (row[0]) {
          case 'U': elems[0][X]++; break;
          case 'D': elems[0][X]--; break;
          case 'L': elems[0][Y]--; break;
          case 'R': elems[0][Y]++; break;
        }

        for (let i = 0, len = elems.length - 2; i <= len; i++) {
          const head = elems[i], tail = elems[i + 1]; 

          const dx = head[X] - tail[X];
          const dy = head[Y] - tail[Y];

          if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
            tail[X] += Math.sign(dx);
            tail[Y] += Math.sign(dy);
          }
        }
        visited.add(lastElem[X] + ',' + lastElem[Y]);
      }
    });
    
    return visited.size;
  }, 


  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 13,
    inputFile: 'example',
  }, {
    name: 'Part 2 example 1',
    part: 2,
    expected: 1,
    inputFile: 'example'
  }, {
    name: 'Part 2 example 2',
    part: 2,
    expected: 36,
    inputFile: 'example2'
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 6098,
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 2597,
  }]
});
