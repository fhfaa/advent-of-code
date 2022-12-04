import { Puzzle } from "../../puzzle";


export const P = new Puzzle({
  year: 2022,
  day: 2,


  part1: (input, isTest = false) => {
    // Score: 0 lose, 3 draw, 6 win + your hand (1 rock, 2 paper, 3 scissors)
    return input.
      split('\n').
      reduce((score: number, row: string) => {
        // convert AX -> 1, BY -> 2, CZ -> 3
        const theirs = row.charCodeAt(0) - 64;
        const yours = row.charCodeAt(2) - 87;

        if (theirs === yours) {
          return score + 3 + yours; // Draw
        }

        // >>>>>>>>>>>>>>>>>>v
        // ^< [ R < P < S ] <<
        const delta = yours - theirs;
        if (delta === 1 || delta === -2) {
          return score + 6 + yours; // Win
        }

        return score + yours; // Lose
      }, 0);
  },


  part2: (input, isTest = false) => {
    return input.
      split('\n').
      reduce((score: number, row: string) => {
        const theirs = +row.charCodeAt(0) - 64;

        switch (row.charAt(2)) {
          case 'X': // must lose
            return score + ((theirs - 1) || 3);
          case 'Y': // must draw
            return score + 3 + theirs;
          case 'Z': // must win
            return score + 6 + (theirs < 3 ? theirs + 1 : 1);
        }
      }, 0);
  },


  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 15,
    inputFile: 'example',
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 12,
    inputFile: 'example',
  }]
});
