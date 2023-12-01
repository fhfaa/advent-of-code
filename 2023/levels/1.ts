import { Puzzle } from "../../puzzle";

const DIGITS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

export const P = new Puzzle({
  year: 2023,
  day: 1,


  part1: (input, isTest = false): number => {
    return input.
      split('\n').
      reduce((sum: number, line: string): number =>  {
        // Replace non-digits; concat first and last digit to form the calibration no. for the line
        const digits = line.replace(/\D/g, '');
        return sum + +`${digits[0]}${digits.at(-1)}`;
      }, 0);
  },

  
  part2: (input, isTest = false): number => {
    const stringDigitReplacer = (_: string, match: string): string => {
      return match.length === 1 ? // match is a digit?
        match : // use as-is
        '' + (DIGITS.indexOf(match) + 1); // find numeric value (idx is off by one)
    };

    return input.
      split('\n').
      reduce((sum: number, line: string): number => {
        const anyDigitMatch = `([1-9]|${DIGITS.join('|')})`;
        
        // Use lazy/greedy eval to create strings starting/ending with the digit we want to extract
        const first = line.replace(new RegExp(`^[a-z]*?${anyDigitMatch}`), stringDigitReplacer).at(0);
        const last = line.replace(new RegExp(`^.*${anyDigitMatch}[a-z]*?$`), stringDigitReplacer).at(-1);
        return sum + +`${first}${last}`;
      }, 0);
  },


  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 142,
    input: `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`,
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 56397,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 281,
    input: `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 55701,
  }]
});
