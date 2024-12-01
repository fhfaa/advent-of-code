import { Puzzle } from "../../puzzle";

const LEFT = 0, RIGHT = 1;

export const P = new Puzzle({
  year: 2024,
  day: 1,


  part1: (input, isTest = false): number => {
    const nums = input
      .split('\n')
      .reduce((ret, next) => {
        const nums = next.split(/\s+/).map(parseFloat);
        return [
          [...ret[LEFT], nums[LEFT]],
          [...ret[RIGHT], nums[RIGHT]],
        ];
      }, [[], []] as number[][])
      .map(arr => arr.sort());

    return nums[0].reduce((sum, next, idx) => {
      return sum + Math.abs(nums[LEFT][idx] - nums[RIGHT][idx]);
    }, 0);
  },

  
  part2: (input, isTest = false): number => {
    const nums = input
      .split('\n')
      .reduce((ret, next) => {
        const nums = next.split(/\s+/).map(parseFloat);
        return [
          [...ret[LEFT], nums[LEFT]],
          [...ret[RIGHT], nums[RIGHT]],
        ];
      }, [[], []] as number[][])
      .map(arr => arr.sort());

    return nums[LEFT].reduce((sum, leftNum, idx) => {
      const similarity = nums[RIGHT]
        .filter((rightNum) => rightNum === leftNum)
        .length;

      return sum + nums[LEFT][idx] * similarity;
    }, 0);
  },


  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 11,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 1830467,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 31,
    inputFile: 'example'
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 26674158,
  }]
});
