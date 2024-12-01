import { PuzzleDefinition } from '../puzzle';


const def: PuzzleDefinition = {
  year: 2022,
  day: 4,


  part1: (input: string, isTest: boolean) => {
    const numPairs = input.
      split('\n').
      reduce((count: number, row: string) => {
        const [from1, to1, from2, to2] = row.split(/\D/).map(parseFloat);
          // one fully contains the other
          return count + (
            (from1 >= from2 && to1 <= to2) ||
            (from2 >= from1 && to2 <= to1) ? 1 : 0
          );
        }, 0);
    return numPairs;
  },


  part2: (input: string, isTest: boolean) => {
    const numPairs = input.
      split('\n').
      reduce((count: number, row: string) => {
        const [from1, to1, from2, to2] = row.split(/\D/).map(parseFloat);
        // one at least partially contains the other
        return count + (
          (from1 >= from2 && from1 <= to2) ||
          (from2 >= from1 && from2 <= to1) ? 1 : 0
        );
      }, 0);
    return numPairs;
  },


  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 2,
    inputFile: 'example',
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 4,
    inputFile: 'example'
  }]
};

export default def;