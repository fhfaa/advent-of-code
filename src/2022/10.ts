import { PuzzleDefinition } from '../puzzle';

type State1 = {
  x: number,
  cycle: number,
  total: number,
}
type State2 = {
  x: number;
  cycle: number;
  crt: string[];
}

const def: PuzzleDefinition = {
  year: 2022,
  day: 10,


  part1: (input: string, isTest: boolean) => {
    const cycle = (state: State1) => {
      if (++state.cycle === 20 || ((state.cycle - 20) % 40) === 0) {
        state.total += state.x * state.cycle;
      }
    }
    
    return input.split('\n').reduce((state, row) => {
      const [command, val] = row.split(' ');
      cycle(state);

      if (command === 'addx') {
        cycle(state);
        state.x += +val;
      }
      return state;
    }, {x: 1, cycle: 0, total: 0} as State1).total;
  },


  part2: (input: string, isTest: boolean) => {
    const cycle = (state: State2) => {
      state.cycle++;
      const rowX = ((state.cycle % 40) || 40) - 1;
      state.crt[state.cycle - 1] = Math.abs(rowX - state.x) <= 1 ? '#' : '.';
    }
    
    const crt = input.split('\n').reduce((state, row) => {
      const [command, val] = row.split(' ');
      cycle(state);

      if (command === 'addx') {
        cycle(state);
        state.x += +val;
      }
      return state;
    }, {x: 1, cycle: 0, crt: new Array(241) as string[]} as State2).crt;

    return '\n\n' + crt.
      join('').
      replace(/(.{40})(?!$)/g, '$1\n'). // insert newline after every crt line
      replace(/\./g, isTest ? '.' : ' '); // nicer output 
  },


  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 13140,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 12840,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: `

##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`,
    inputFile: 'example'
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: `

####.#..#...##.####.###....##.####.####.
...#.#.#.....#.#....#..#....#.#.......#.
..#..##......#.###..###.....#.###....#..
.#...#.#.....#.#....#..#....#.#.....#...
#....#.#..#..#.#....#..#.#..#.#....#....
####.#..#..##..#....###...##..#....####.`,
  }]
};

export default def;