import { PuzzleDefinition } from "../puzzle";

const def: PuzzleDefinition = {
  part1: (input, isTest = false): number => {
    // find all mul(<nums>, <nums>)
    const matches = input.matchAll(/mul\((\d+?),(\d+?)\)/g);

    return [...matches].reduce((sum, nextMatch) => {
      return sum + (+nextMatch[1] * +nextMatch[2]);
    }, 0);
  },

  part2: (input, isTest = false): number => {
    // strip don't() ... do() parts
    const input2 = input.replace(/don't\(\)[\s\S]*?(do\(\)|$)/g, '');

    // same as above
    const matches = input2.matchAll(/mul\((\d+?),(\d+?)\)/g);
    return [...matches].reduce((sum, nextMatch) => {
      return sum + (+nextMatch[1] * +nextMatch[2]);
    }, 0);
  },

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 161,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 187825547,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 48,
    inputFile: 'example2'
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 85508223,
  }]
};

export default def;