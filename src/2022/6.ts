import { PuzzleDefinition } from '../puzzle';

const MSG_LEN_1 = 4;
const MSG_LEN_2 = 14;

const def: PuzzleDefinition = {
  year: 2022,
  day: 6,


  part1: (input: string, isTest: boolean) => {
    for (let i = MSG_LEN_1 - 1; i < input.length; i++) {
      if ( // 🤭
        input[i] !== input[i-1] &&
        input[i] !== input[i-2] &&
        input[i] !== input[i-3] &&
        input[i-1] !== input[i-2] &&
        input[i-1] !== input[i-3] &&
        input[i-2] !== input[i-3]
      ) {
        return i + 1;
      }
    }
  },


  part2: (input: string, isTest: boolean) => {
    for (let i = MSG_LEN_2; i < input.length; i++) {
      const substr = input.substring(i - MSG_LEN_2, i);

      // Convert to char array, sort and check for duplicates
      if (substr.split('').sort().every((elem, idx, arr) => {
        return arr.indexOf(elem) === idx;
      })) {
        return i;
      }
    }
  },


  tests: [{
    name: 'Part 1 example 1',
    part: 1,
    expected: 7,
    input: 'mjqjpqmgbljsphdztnvjfqwrcgsmlb',
  }, {
    name: 'Part 1 example 2',
    part: 1,
    expected: 5,
    input: 'bvwbjplbgvbhsrlpgdmjqwftvncz',
  }, {
    name: 'Part 1 example 3',
    part: 1,
    expected: 10,
    input: 'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg',
  }, {
    name: 'Part 1 example 4',
    part: 1,
    expected: 11,
    input: 'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw',
  }, {
    name: 'Part 2 example 1',
    part: 2,
    expected: 19,
    input: 'mjqjpqmgbljsphdztnvjfqwrcgsmlb'
  }, {
    name: 'Part 2 example 2',
    part: 2,
    expected: 23,
    input: 'bvwbjplbgvbhsrlpgdmjqwftvncz'
  }, {
    name: 'Part 2 example 3',
    part: 2,
    expected: 23,
    input: 'nppdvjthqldpwncqszvftbrmjlhg'
  }, {
    name: 'Part 2 example 4',
    part: 2,
    expected: 29,
    input: 'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg'
  }, {
    name: 'Part 2 example 5',
    part: 2,
    expected: 26,
    input: 'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw'
  }]
};

export default def;