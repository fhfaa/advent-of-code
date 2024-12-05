import { PuzzleDefinition } from "../puzzle";

// x, y, chr
type OffsetToCheck = [number, number, string];
type Pattern = OffsetToCheck[];

const def: PuzzleDefinition = {
  part1: (input, isTest = false): number => {
    const needle = 'XMAS';
    const startChar = needle.charAt(0);
    const matrix = input
      .split('\n')
      .map((row) => row.split(''))

    // Offsets for all directions (2x horizontal, 2x vertical, 4x diagonal)
    const offsets = [
      [ -1,  0 ], [  1, 0 ], [ 0, -1 ], [ 0, 1 ],
      [ -1, -1 ], [ -1, 1 ], [ 1, -1 ], [ 1, 1 ]
    ];

    // Create a pattern for each direction (each an array of total offsets + expected char)
    // Starting at X:
    // S  S  S
    //  A A A
    //   MMM
    // SAMXMAS
    //   MMM
    //  A A A
    // S  S  S
    const patterns = offsets.map((offset) => {
      // e.g. for horizontal with offset [1,0]:
      // [ [1,0,'M'], [2,0,'A'], [3,0,'S'] ]
      return needle.split('').slice(1).map((chr, idx) => [
        offset[0] * (idx + 1),
        offset[1] * (idx + 1),
        chr
      ] as OffsetToCheck);
    }, [] as Pattern[]); 

    let count = 0;
  
    for (let x = 0, xlen = matrix[0].length; x < xlen; x++) {
      for (let y = 0, ylen = matrix.length; y < ylen; y++) {
        // For every x
        if (matrix[y][x] === startChar) {

          // Check in all directions
          nextPattern: for (let pattern of patterns) {
            for (let [dx, dy, chr] of pattern) {
              // If char doesnt match expection, check next direction
              if (matrix[y + dy]?.[x + dx] !== chr) {
                continue nextPattern;
              }
            }

            // If all chars match, we found a word
            count++;
          }
        }
      }
    }

    return count;
  },

  part2: (input, isTest = false): number => {
    const matrix = input
        .split('\n')
        .map((row) => row.split(''));

    let count = 0;
  
    for (let x = 1, xlen = matrix[0].length - 1; x < xlen; x++) {
      for (let y = 1, ylen = matrix.length - 1; y < ylen; y++) {
        // starting from each A, extract the corner chars in clockwise order
        if (matrix[y][x] === 'A') {
          const chrs = [
            matrix[y - 1][x - 1],
            matrix[y - 1][x + 1],
            matrix[y + 1][x + 1],
            matrix[y + 1][x - 1],
          ].join('');

          // check order to remove "MAM X SAS"
          if (/^(SSMM|MSSM|MMSS|SMMS)$/.test(chrs)) {
            count++;
          }
        }
      }
    }

    return count;
  },

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 18,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 2468,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 9,
    inputFile: 'example'
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 1864,
  }]
};

export default def;