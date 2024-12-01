import { PuzzleDefinition } from '../puzzle';

const DELTAS = {
  'U': [  0, -1 ],
  'R': [  1,  0 ],
  'D': [  0,  1 ],
  'L': [ -1,  0 ],
};
type Dir = keyof typeof DELTAS;

type Instruction = {
  dir: Dir;
  steps: number;
};

type Coord = [number, number];

type TrenchInfo = {
  coords: Coord[],
  length: number;
}


// Get all corners of the trench and its total length
const getTrenchCornersAndLength = (instructions: Instruction[]) => {
  return instructions.reduce((info, instr) => {
    const [x, y] = info.coords.at(-1);
    const [dx, dy] = DELTAS[instr.dir];
    info.length += instr.steps;
    info.coords.push([x + dx * instr.steps, y + dy * instr.steps]);
    return info;
  }, { length: 0, coords: [[0, 0]] } as TrenchInfo)
}


// Calculate the area of a polygon
const shoelace = (coords: Coord[]): number => {
  let sum = 0;
  for (let i = 0, len = coords.length; i < len; i++) {
    const [x1, y1] = coords[i];
    const [x2, y2] = coords[(i + 1) % len];
    sum += x1 * y2 - y1 * x2;
  }
  return Math.abs(sum) * 0.5;
}


/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */

const def: PuzzleDefinition = {
  year: 2023,
  day: 18,

  /* ************************************************************************* */

  part1: (input: string, isTest: boolean) => {
    const instructions = input.
      split('\n').
      map(line => {
        const [dir, steps] = line.split(' ');
        return {
          dir: dir as Dir,
          steps: +steps
        } as Instruction;
      });
    
    // Since the area algo is based on lines without a width, we need to
    // account for the width of the trench on the far sides and add that.
    const { coords, length } = getTrenchCornersAndLength(instructions);
    const area = shoelace(coords);
    return area + length / 2 + 1;
  },

  /* ************************************************************************* */

  part2: (input: string, isTest: boolean) => {    
    const instructions = input.
      split('\n').
      map(line => {
        // Extract real input from hex values
        const hex = line.split('#')[1];
        return {
          dir: 'RDLU'.charAt(+hex.charAt(5)),
          steps: parseInt(hex.substring(0, 5), 16)
        } as Instruction;
      });
    
    const { coords, length } = getTrenchCornersAndLength(instructions);    
    return shoelace(coords) + length / 2 + 1;
  },

  /* ************************************************************************* */

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 62,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 56678,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 952408144115,
    inputFile: 'example'
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 79088855654037,
  }]
};

export default def;