import { PuzzleDefinition } from "../puzzle";

type Rules = { [key: string]: number[]; }
type Updates = number[][];

const parseInput = (input: string): { rules: Rules, updates: Updates } => {
  const [top, bottom] = input.split('\n\n');

  const rules = top
      .split('\n')
      .map((row) => row.split('|').map(parseFloat))
      .reduce((obj, [smaller, larger]) => {
        obj[smaller] ??= [];
        obj[smaller].push(larger);
        return obj;
      }, {});

    const updates = bottom
      .split('\n')
      .map((row) => row.split(',').map(parseFloat));

    return { rules, updates };
}

const isValid = (update: number[], rules: Rules): boolean => {
  return update.every((smaller, idx) => {
    if (rules[smaller]) {
      return rules[smaller].every((laterNum) => {
        const higherIdx = update.indexOf(laterNum);
        return higherIdx === -1 || higherIdx > idx; 
      })
    }
    return true;
  });
}

const def: PuzzleDefinition = {
  part1: (input, isTest = false): number => {
    const { rules, updates } = parseInput(input);

    return updates.reduce((total, update) => {
      if (isValid(update, rules)) {
        return total + update[Math.floor(update.length / 2)];
      }
      return total;


    }, 0);
  },

  part2: (input, isTest = false): number => {
    const { rules, updates } = parseInput(input);

    return updates.reduce((total, update) => {
      // Skip updates that are already valid
      if (isValid(update, rules)) {
        return total;
      }

      const update2 = update.sort((a, b) => {
        if (rules[a] && rules[a].includes(b)) {
          return -1;
        }
        if (rules[b] && rules[b].includes(a)) {
          return 1;
        }
        return 0;
      });
      return total + update2[Math.floor(update2.length / 2)];
    }, 0);
  },

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 143,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 7074,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 123,
    inputFile: 'example'
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 4828,
  }]
};

export default def;