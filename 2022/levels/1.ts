import { Puzzle } from "../../puzzle";


function getElves(input: string): number[] {
  return input.
    split('\n\n').
    map((lines: string): number => lines.
      split('\n').
      reduce((a, b) => a + parseInt(b, 10), 0)
    );
}


export const P = new Puzzle({
  year: 2022,
  day: 1,


  part1: (input, isTest = false) => {
    const elves = getElves(input);
    return Math.max(...elves);
  },

  
  part2: (input, isTest = false) => {
    const elves = getElves(input);
    return elves.
      sort((a, b) => b - a).
      slice(0, 3).
      reduce((a, b) => a + b);
  },


  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 24000,
    inputFile: 'example',
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 45000,
    inputFile: 'example'
  }]
});
