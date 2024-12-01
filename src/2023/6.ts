import { PuzzleDefinition } from '../puzzle';

/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */

const def: PuzzleDefinition = {
  year: 2023,
  day: 6,

  /* ************************************************************************* */

  part1: (input: string, isTest: boolean) => {
    const [time, dist] = input.
      split('\n').
      map(line => line.
        split(/\s+/).
        slice(1).
        map(parseFloat)
      );
    
    // Score is a parabola with 0 at 0 and <time>, and a maximum at 0.5*t
    // We can probably math out even harder, but this is fast enough already:
    // We find the number of losing games on the "left" before the threshold is reached,
    // then subtract that number from both ends (*2) and correct the off-by-one error.
    return time.reduce((product, t, idx) => {
      for (let i = 1; i < t; i++) {
        const score = i * (t - i);

        if (score > dist[idx]) {
          const wins = t - (2 * i) + 1;
          return product * wins;
        }
      }
    }, 1);
  },

  /* ************************************************************************* */

  part2: (input: string, isTest: boolean) => {
    // Concat numbers into one larger number
    const [time, dist] = input.
      split('\n').
      map(line => +line.
        split(/:\s+?/)[1].
        replace(/\s/g, '')
      );
    
    for (let i = 1; i < time; i++) {
      const score = i * (time - i);
      if (score > dist) {
        return time - 2 * i + 1;
      }
    }
  },

  /* ************************************************************************* */

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 288,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 2612736,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 71503,
    inputFile: 'example',
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 29891250,
  }]
};

export default def;