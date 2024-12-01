import { PuzzleDefinition } from '../puzzle';

// NOTE: Input is dest/src/length; our format is src/length/dest
type Range = [number, number, number];
type SeedRange = [number, number];
const START = 0, LENGTH = 1, DEST = 2;


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
        ).
        // Change order from dest/src/length to src/length/dest,
        // so we can index both Range and SeedRange with the same constants
        map(r => [r[1], r[2], r[0]] as Range)
      )
  };
}


const mapRanges = (seedRanges: SeedRange[], mapRanges: Range[]) => {
  let processedRanges: SeedRange[] = [];

  nextSeedRange: while (seedRanges.length) {
    const seedRange = seedRanges.pop();
    const seedEnd = seedRange[START] + seedRange[LENGTH];

    for (let mapRange of mapRanges) {
      const mapEnd = mapRange[START] + mapRange[LENGTH];

      // Entire mapRange is contained in seedRange
      // Map offsets for intersection, and check the rest again later
      // (pretend the rest is two separate seedRanges)
      if (seedRange[START] < mapRange[START] && seedEnd > mapEnd) {
        seedRanges.push([seedRange[START], mapRange[START] - seedRange[START]]);
        processedRanges.push([mapRange[DEST], mapEnd - mapRange[START]]); 
        seedRanges.push([mapEnd, seedEnd - mapEnd]);
        continue nextSeedRange;

      // End of seedRange intersects with start of mapRange
      // Map offsets for the intersection and check the rest again later
      // (pretend the rest is a separate seedRange)
      } else if (seedRange[START] < mapRange[START] && seedEnd > mapRange[START]) {
        seedRanges.push([seedRange[START], mapRange[START] - seedRange[START]]);
        processedRanges.push([mapRange[DEST], seedEnd - mapRange[START]]);
        continue nextSeedRange;

      // Start of seedRange intersects with end of mapRange
      // Map offsets for the intersection and check the rest again later
      // (pretend the rest is a separate seedRange)
      } else if (seedRange[START] >= mapRange[START] && seedRange[START] < mapEnd && seedEnd > mapEnd) {
        processedRanges.push([seedRange[START] - mapRange[START] + mapRange[DEST], mapEnd - seedRange[START] - 1]);
        seedRanges.push([mapEnd, seedEnd - mapEnd]);
        continue nextSeedRange;
      
      // Entire seedRange is contained in mapRange
      // Map offsets for the intersection
      } else if (seedRange[START] >= mapRange[START] && seedEnd <= mapEnd) {
        processedRanges.push([seedRange[START] - mapRange[START] + mapRange[DEST], seedRange[LENGTH]]);
        continue nextSeedRange;
      }
      
      // ELSE: No intersection between seedRange and mapRange - check next mapRange
    }
    
    // This seedRange didn't intersect with any of the mapRanges, so it remains unchanged for this mapping
    processedRanges.push(seedRange);
  }

  return processedRanges;
};


/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */


const def: PuzzleDefinition = {
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
            find((range) => val >= range[START] && val < range[START] + range[LENGTH]);
          return matchingRange ?
            matchingRange[DEST] + (val - matchingRange[START]) :
            val;
        }, seed);
      })
    );
  },

  /* ************************************************************************* */

  part2: (input: string, isTest: boolean) => {
    const { seeds, mappings } = parseInput(input);

    let min = +Infinity;
    // For each range of seeds
    for (let i = 0; i < seeds.length; i += 2) {
      const seedRanges: SeedRange[] = [[seeds[i], seeds[i + 1]]];

      // Map the seed ranges to location ranges, take the lowest location
      // from each range, and find the minimum across all seed ranges.
      const rangeMinimums = mappings.
        reduce(mapRanges, seedRanges).
        map(s => s[START]);

      min = Math.min(min, ...rangeMinimums);
    }
    return min;
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
};

export default def;