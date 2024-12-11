import { PuzzleDefinition } from "../puzzle";

type Params = {
  blinks?: number;
}

type Memo = {
  [key: string]: number;
}


const solveRecursive = (stone: string, itersLeft: number, memo: Memo) => {
  // Stone has 1 digit?
  // Use our memo object (digit + number of iterations left)
  if (stone.length === 1) {
    const memoKey = `${stone},${itersLeft}`;
    if (!memo[memoKey]) {
      const nextStone = stone === '0' ? '1' : `${2024 * +stone}`;
      memo[memoKey] = solveRecursive(nextStone, itersLeft - 1, memo);
    }
    return memo[memoKey];
  }

  // No iterations left? 1 stone = 1 stone. Simple maths.
  if (!itersLeft) {
    return 1;
  }

  // Odd number of digits? Repeat with num * 2024
  if ((stone.length % 2) === 1) {
    return solveRecursive(`${2024 * +stone}`, itersLeft - 1, memo);
  }

  // Even number of digits? Continue with two half stones
  return solveRecursive(
    `${parseInt(stone.substring(0, stone.length / 2), 10)}`,
    itersLeft - 1,
    memo,
  ) + solveRecursive(
    `${parseInt(stone.substring(stone.length / 2), 10)}`,
    itersLeft - 1,
    memo,
  );
}

const def: PuzzleDefinition = {
  part1: (input, isTest = false, { blinks = 25 }: Params = {}): number => {
    // Init memo object for single-digit stones:
    // { [digitOnStone,iterationsLeft]: resultingNumberOfstones }
    const memo = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      .reduce((ret, num) => ({...ret, [`${num},0`]: 1}), {});

    return input
      .split(' ')
      .reduce((total, stone) => total + solveRecursive(stone, blinks, memo), 0);
  },


  part2: (input, isTest = false, { blinks = 75 }: Params = {}): number => {
    // same as part 1
    const memo = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      .reduce((ret, num) => ({...ret, [`${num},0`]: 1}), {});

    return input
      .split(' ')
      .reduce((total, stone) => total + solveRecursive(stone, blinks, memo), 0);
  },


  tests: [{
    name: 'Part 1 example 6 blinks',
    part: 1,
    expected: 22,
    input: '125 17',
    params: { blinks: 6 }
  }, {
    name: 'Part 1 example',
    part: 1,
    expected: 55312,
    input: '125 17',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 185894,
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 221632504974231,
  }]
};

export default def;