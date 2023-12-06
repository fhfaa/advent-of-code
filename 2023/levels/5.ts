import { Puzzle } from "../../puzzle";

type Range = [number, number, number];
const DST = 0, SRC = 1, LEN = 2;

const parseInput = (input: string): { seeds: number[], mappings: Range[][] } => {
  const parts = input.substring(7).
    replace(/\n[a-z \-]+:\n/g, '\n').
    split(/\n\n/);

  return {
    seeds: parts[0].
      split(' ').
      map(parseFloat),
    mappings: parts.slice(1).
      map((lines: string): Range[] => lines.
        split('\n').
        map((line: string): Range => line.
          split(' ').
          map(parseFloat) as Range
        ).sort((a,b) => a[1] < b[1] ? -1 : 1)
      )
  };
}

/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */

export const P = new Puzzle({
  year: 2023,
  day: 5,

  /* ************************************************************************* */

  

  part1: (input: string, isTest: boolean) => {
    const { seeds, mappings } = parseInput(input);

    // Pick the smallest value of:
    return Math.min(
      // For each seed
      ...seeds.map(seed => {
        // Traverse all mappings
      return mappings.reduce((val: number, mapRanges: Range[]) => {
        // If there is a range that contains our source val, map and return. Otherwise return src val.
        const matchingRange = mapRanges.
          find((range) => val >= range[SRC] && val < range[SRC] + range[LEN]);
        return matchingRange ? 
          matchingRange[DST] + (val - matchingRange[SRC]) :
          val;
      }, seed);
      })
    );
  },

  /* ************************************************************************* */

  part2: (input: string, isTest: boolean) => {
    const { seeds, mappings } = parseInput(input);

    let minLocation = +Infinity;
    // For every second seed
    for (let i = 0, len = seeds.length; i < len; i += 2) {
      // Use the next (skipped) seed number as the length of the range
      const seed = seeds[i];
      const rangeLen = seeds[i + 1];
      // Walk this range, starting from the seed
      for (let d = 0; d < rangeLen; d += 1) {
        const location = mappings.reduce((val: number, mapRanges: Range[]) => {
          // If there is a range that contains our source val, map and return. Otherwise return src val.
          // console.log('num matchingRanges: ', mapRanges.filter((range) => val >= range[SRC] && val < (range[SRC] + range[LEN])).length)
          const matchingRange = mapRanges.
            find((range) => val >= range[SRC] && val < range[SRC] + range[LEN]);

          return matchingRange ? 
            matchingRange[DST] + (val - matchingRange[SRC]) :
            val;
        }, seed + d);
        minLocation = Math.min(minLocation, location);
      }
    }
    console.log(minLocation);
    return minLocation;
  },

  /* ************************************************************************* */

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 35,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 177942185,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 46,
    inputFile: 'example',
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 69841803,
  }]
});
