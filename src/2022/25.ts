import { PuzzleDefinition } from '../puzzle';


function  fromSnafu(snafu: string): number {
  const map = { '=': -2, '-': -1, '0': 0, '1': 1, '2': 2 };
  return snafu.
    split('').
    reverse().
    reduce((sum, num, idx) => sum + (5 ** idx) * map[num], 0);
}


function toSnafu(num: number): string {
  const map = { '3': '=', '4': '-', '0': 0, '1': 1, '2': 2 };
  
  let ret = '';
  while (num) {
    const last = num % 5;
    ret = map[last] + ret;
    num = Math.floor(num / 5) + (last > 2 ? 1 : 0);
  }
  return ret;
}

/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */

const def: PuzzleDefinition = {
  year: 2022,
  day: 25,

  /* ************************************************************************* */

  part1: (input: string, isTest: boolean) => {
    const sum = input.
      split('\n').
      map(snafu => fromSnafu(snafu)).
      reduce((sum, num) => sum + num, 0);

    return toSnafu(sum);
  },

  /* ************************************************************************* */

  part2: (input: string, isTest: boolean) => {
    return ';D';
  },

  /* ************************************************************************* */

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: '2=-1=0',
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: '2=1-=02-21===-21=200',
  }]
};

export default def;
