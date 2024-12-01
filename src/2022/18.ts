import { PuzzleDefinition } from '../puzzle';

type Point = [number, number, number];
type PointMap = { [key: string]: number };


/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */


const def: PuzzleDefinition = {
  year: 2022,
  day: 18,

  /* ************************************************************************* */

  part1: (input: string, isTest: boolean) => {
    const taken: PointMap = {};
    const points: Point[] = input.split('\n').
      map(line => {
        taken[line] = 1;
        return line.split(',').map(Number) as Point;
      });

    return points.reduce((sides: number, [x, y, z]: number[]) => {
      return sides + 6 - (
        (taken[`${x + 1},${y},${z}`] ?? 0) +
        (taken[`${x - 1},${y},${z}`] ?? 0) +
        (taken[`${x},${y + 1},${z}`] ?? 0) +
        (taken[`${x},${y - 1},${z}`] ?? 0) +
        (taken[`${x},${y},${z + 1}`] ?? 0) +
        (taken[`${x},${y},${z - 1}`] ?? 0)
      );
    }, 0);
  },

  /* ************************************************************************* */

  part2: (input: string, isTest: boolean) => {
    if (!isTest) { return 'TODO'; }
    return 'TODO';
  },

  /* ************************************************************************* */

  tests: [{
    name: 'Part 1 mini example',
    part: 1,
    expected: 10,
    input: '1,1,1\n2,1,1',
  }, {
    name: 'Part 1 example',
    part: 1,
    expected: 64,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 4308,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 58,
    inputFile: 'example'
  }]
};

export default def;