import { Puzzle } from "../../puzzle";

type Paths = [string, string];
type PathMap = { [key: string]: Paths };


const parseInput = (input: string): { directions: string, paths: PathMap } => {
  const [directions, pathStr] = input.split('\n\n');
  const paths = pathStr.
    split('\n').
    reduce((ret, line) => {
      const [from, ...to] = line.split(/\W+/);
      ret[from] = [to[0], to[1]] as [string, string];
      return ret;
    }, {});

  return { directions, paths };
}


/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */


export const P = new Puzzle({
  year: 2023,
  day: 8,

  /* ************************************************************************* */

  part1: (input: string, isTest: boolean) => {
    const { directions, paths } = parseInput(input);

    let current = 'AAA';
    let i = 0;
    while (true) {
      // Find next direction to go (left or right - instructions wrap around)
      // 
      const nextDir = directions.charAt(i % directions.length) === 'L' ? 0 : 1;
      current = paths[current][nextDir];
      // Abort when 'ZZZ' is reached. Add 1 because loop is 0-indexed, but steps start at 1
      if (current === 'ZZZ') {
        return i + 1;
      }
      i += 1;
    }
  },

  /* ************************************************************************* */

  part2: (input: string, isTest: boolean) => {
    const { directions, paths } = parseInput(input);

    let starters = Object.keys(paths).filter(name => name.charAt(name.length - 1) === 'A');

    // Run part 1 for each of the starters (names ending with A),
    // but look for paths to any goal (names ending with 'Z', not just 'ZZZ')
    const results = starters.map(current => {
      let i = 0;
      while (true) {
        const nextDir = directions.charAt(i % directions.length) === 'L' ? 0 : 1;
        current = paths[current][nextDir];
        if (current.charAt(current.length - 1) === 'Z') {
          return i + 1;
        }
        i += 1;
      }
    });

    // Calculate the least common multiple of the path lengths
    const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
    return results.reduce((a, b) => a * b / gcd(a, b));

    // Wait... this wasn't supposed to work.
    // We never even checked if anything looped at all, which is a prerequisite for LCM to work.
    // Oh well, task failed successfully...
  },

  /* ************************************************************************* */

  tests: [{
    name: 'Part 1 example 1',
    part: 1,
    expected: 2,
    inputFile: 'example',
  }, {
    name: 'Part 1 example 2',
    part: 1,
    expected: 6,
    inputFile: 'example2',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 18113,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 6,
    inputFile: 'example3',
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 12315788159977,
  }]
});
