import { PuzzleDefinition } from "../puzzle";

type Row = {
  expected: number;
  nums: number[]; 
};


const parseInput = (input: string): Row[] => {
  return input
    .split('\n')
    .map((line) => {
      const [expected, nums] = line.split(': ');
      return {
        expected: parseFloat(expected),
        nums: nums.split(' ').map(parseFloat)
      };
    });
};


// Validate a row according to part 1 logic (operators + and *)
const testRow1 = ({expected, nums}: Row): boolean => {
  const numOperators = nums.length - 1;
      
  // Bruteforce:
  // For the number of possible combinatios of operators (2^number_of_operators)
  for (let i = 0, len = 2 ** numOperators; i < len; i += 1) {
    let result = nums[0];

    // use 1/0 bits in combination# to apply +/- for this operator
    // e.g. 4 operators: try from 0b0000 to 0b1111
    // apply + for 1-bits, * for 0-bits
    for (let j = 0; j < numOperators; j += 1) {
      if ((i & (1 << j)) > 0) {
        result += nums[j + 1];
      } else {
        result *= nums[j + 1];
      }
    }
    
    if (result === expected) {
      return true;
    }
  }
  return false;
};


// Validate a row according to part 2 logic (operators +, * and ||)
// Recurse for each operator, trying + * and || 
const testRow2 = (expected: number, currentTotal: number, [num1, ...numRest]: number[]): boolean => {
  if (!numRest.length) {
    return expected === currentTotal + num1
        || expected === currentTotal * num1
        || expected === +`${currentTotal}${num1}`;
  }

  return testRow2(expected, currentTotal + num1, numRest)
    || testRow2(expected, currentTotal * num1, numRest)
    || testRow2(expected, +`${currentTotal}${num1}`, numRest);
};


const def: PuzzleDefinition = {
  part1: (input, isTest = false): number => {
    return parseInput(input)
      .reduce((sum, row: Row) => {
        return testRow1(row)
          ? sum + row.expected
          : sum;
      }, 0);
  },


  part2: (input, isTest = false): number => {
    return parseInput(input)
      .reduce((sum, { expected, nums }: Row) => {
        // Use the first number as initial total. start with the second number
        return testRow2(expected, nums[0], nums.slice(1))
          ? sum + expected
          : sum;
      }, 0);
  },


  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 3749,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 6231007345478,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 11387,
    inputFile: 'example'
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 333027885676693,
  }]
};

export default def;