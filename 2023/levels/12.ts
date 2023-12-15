import { Puzzle } from "../../puzzle";

// e.g.  0b1110100 --> 4, 0b10 -> 1, 0b111 -> 3
const countOnesInBinaryFormat = (num: number): number => {
  let ones = 0;
  do {
    ones += num & 1;
    num >>= 1;
  } while (num);
  return ones;
}

/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */


export const P = new Puzzle({
  year: 2023,
  day: 12,

  /* ************************************************************************* */

  part1: (input: string, isTest: boolean) => {
    return input.
      split('\n').
      map(line => {
        const [left, right] = line.split(' ');
        const arr = left.split('');

        // Number of "?" wildcards and their locations (indices in array)
        const numWildcards = arr.
          filter(chr => chr === '?').length;
        const wildcardIndices = arr.
          map((chr, idx) => chr === '?' ? idx : -1).
          filter(idx => idx !== -1);

        // Total number of damaged springs and number of damaged springs that are still "?"s
        const counts = right.
          split(',').
          map(parseFloat);
        const totalDamaged = counts.reduce((a, b) => a + b);
        const missingDamaged = totalDamaged - arr.filter(chr => chr === '#').length;

        // Regex to validate our generated arrangement
        const regex = new RegExp(
          '^\.*?' +  // 0-n operational
          counts.
            map(num => '#{' + num + '}'). // n damaged
            join('\.+?') + // each with at least 1 operational in between
          '\.*?$' // 0-n operational at the end
        );

        return { arr, numWildcards, wildcardIndices, regex, missingDamaged };
      }).
      reduce((sum, springData) => {
        // Example: We have 4 "?" and need 2 more #
        // Think binary and walk 0001 (...#), 0010 (..#.), ...
        const start = (1 << springData.missingDamaged) - 1;
        const end = 2 << springData.numWildcards;
        for (let bin = start; bin < end; bin++) {
          // Skip numbers with more or less 1s in their binary representation different
          // from the number if # other than the one we are looking for.
          if (countOnesInBinaryFormat(bin) === springData.missingDamaged) {

            // Replace the chars in the array at the location of the wildcards 
            // with the respective 0/1 (./#) in that bit position in `bin`.
            for (let j = 0, len = springData.wildcardIndices.length; j < len; j++) {
              springData.arr[springData.wildcardIndices[j]] = (bin & (1 << j)) ? '#' : '_';
            }
            
            // Turn the new array into a string and see if it matches the pattern we want
            if (springData.regex.test(springData.arr.join(''))) {;
              sum++;
            }
          }
        }
        return sum;
      }, 0);
  },

  /* ************************************************************************* */

  part2: (input: string, isTest: boolean) => {
    return 'TODO'
  },

  /* ************************************************************************* */

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 21,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 7017,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 525152,
    inputFile: 'example',
  },/* {
    name: 'Part 2 my input',
    part: 2,
    expected: 377318892554,
  }*/]
});
