import { PuzzleDefinition } from "../puzzle";

const SAFE = -1;

// Return first bad index: that of the first number in a pair that doesn't
// match our conditions. Return -1 (`SAFE`) if the levels are safe.
const getInvalidIndex = (row: number[]): number => {
  return row.slice(1).findIndex((num, idx) => {
    // The first two numbers determine the up/down direction (-1/+1)
    const sign = Math.sign(row[1] - row[0]);

    // Use that to normalize the direction, check delta between pairs
    const delta = sign * (num - row[idx]);
    return delta < 1 || delta > 3;
  });
}

const def: PuzzleDefinition = {
  part1: (input, isTest = false): number => {
    return input
      .split('\n')
      .map((line) => line
        .split(' ')
        .map(parseFloat)
      )
      .reduce((numSafe, nextRow) => {
        return getInvalidIndex(nextRow) === SAFE
          // Count safe rows
          ? numSafe + 1
          : numSafe;
      }, 0);
  },

  part2: (input, isTest = false): number => {
    return input
      .split('\n')
      .map((line) => line
        .split(' ')
        .map(parseFloat)
      )
      .reduce((numSafe, nextRow) => {
        const badIndex = getInvalidIndex(nextRow);
        return (
          // check original row
          badIndex === SAFE ||
          // check row with the 1st number from the invalid pair removed
          getInvalidIndex(nextRow.filter((num, idx) => idx !== badIndex)) === SAFE ||
          // check row with the 2nd number of the invalid pair removed
          getInvalidIndex(nextRow.filter((num, idx) => idx !== badIndex + 1)) === SAFE ||
          // try removing the first number. maybe that changes the direction.
          (badIndex && getInvalidIndex(nextRow.slice(1)) === SAFE)
        )
          ? numSafe + 1
          : numSafe;
      }, 0);

  },

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 2,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 534,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 4,
    inputFile: 'example'
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 577,
  }]
};

export default def;