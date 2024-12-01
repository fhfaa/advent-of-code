import { PuzzleDefinition } from '../puzzle';

type Entry = [number];

function decode(order: number[], rounds = 1, decryptionKey = 1): number {
  // Multiply numbers by deryption key (does nothing in round 1).
  // Then turn numbers into 1-element array to make the entries unique
  // because the numbers in the input are not unique, so indexOf() gives
  // the wrong results.
  const order2: Entry[] = order.
    map(num => num * decryptionKey).
    map(num => [num]);

  const numbers = [...order2];

  while (rounds --> 0) {
    for (const entry of order2) {
      // Find index of next number (from original order) and temporarily remove it.
      const idx = numbers.indexOf(entry);
      const removed = numbers.splice(idx, 1);

      // Find new index. Note: splice supports negative indixes.
      // Also: the length is temporarily (len - 1) because the current elem is removed.
      numbers.splice((idx + entry[0]) % numbers.length, 0, removed[0]);
    }
  }

  // Find index of 0, then sum values with offset 1000, 2000 and 3000 from there.
  const idxZero = numbers.findIndex(num => num[0] === 0);
  const coords = [1000, 2000, 3000].
    map(n => numbers[(idxZero + n) % numbers.length][0]);

  return coords[0] + coords[1] + coords[2];
};


/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */


const def: PuzzleDefinition = {
  year: 2022,
  day: 20,

  /* ************************************************************************* */

  part1: (input: string, isTest: boolean) => {
    let nums = input.split('\n').map(Number);

    return decode(nums, 1);
  },

  /* ************************************************************************* */

  part2: (input: string, isTest: boolean) => {
    let nums = input.split('\n').map(Number);

    const DECRYPTION_KEY = 811589153;
    return decode(nums, 10, DECRYPTION_KEY);
  },

  /* ************************************************************************* */

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 3,
    input: `1\n2\n-3\n3\n-2\n0\n4`,
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 7584,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 1623178306,
    input: `1\n2\n-3\n3\n-2\n0\n4`,
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 4907679608191,
  }]
};

export default def;