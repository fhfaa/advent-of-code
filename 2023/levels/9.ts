import { Puzzle } from "../../puzzle";


const getNextNumber = (history: number[]): number => {
  const deltas: number[][] = [history.slice()];
  do {
    // Take the last row, and create a new row with the deltas between the values (1 shorter)
    const last = deltas[deltas.length - 1];
    const next: number[] = [];

    for (let i = 1; i < last.length; i += 1) {
      next.push(last[i] - last[i - 1]);
    }
    deltas.push(next);
  
  // Repeat and calc the deltas of the deltas until we only have zero deltas
  } while (deltas[deltas.length - 1].some(n => n !== 0));

  // For each row (starting with the last), the next value is the last number plus 
  // the expected delta (last value of next row)
  for (let i = deltas.length - 1; i >= 1; i--) {
    deltas[i - 1].push(deltas[i - 1].at(-1) + deltas[i].at(-1));
  }

  // The new last value in the first row (our original history) is what we want 
  return deltas[0].at(-1);
}


/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */


export const P = new Puzzle({
  year: 2023,
  day: 9,

  /* ************************************************************************* */

  part1: (input: string, isTest: boolean) => {
    const histories = input.
      split('\n').
      map(line => line.
        split(' ').
        map(parseFloat)
      );

    return histories.reduce((sum: number, history: number[]) => {
      return sum + getNextNumber(history); 
    }, 0);
  },

  /* ************************************************************************* */

  part2: (input: string, isTest: boolean) => {
    const histories = input.
      split('\n').
      map(line => line.
        split(' ').
        map(parseFloat).
        reverse() // solve part2 by reversing the rows
      );

    return histories.reduce((sum: number, history: number[]) => {
      return sum + getNextNumber(history); 
    }, 0);
  },

  /* ************************************************************************* */

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 114,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 1974913025,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 2,
    inputFile: 'example',
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 884,
  }]
});
