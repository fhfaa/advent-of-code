import { PuzzleDefinition } from '../puzzle';

type Lens = {
  label: string;
  val: number;
}

const hash = (str: string): number => {
  let score = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    score = ((score + str.charCodeAt(i)) * 17) % 256;
  }
  return score;
};


/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */

const def: PuzzleDefinition = {
  year: 2023,
  day: 15,

  /* ************************************************************************* */

  part1: (input: string, isTest: boolean) => {
    return input.
      split(',').
      reduce((sum: number, instruction: string): number => {
        return sum + hash(instruction);
      }, 0);
  },

  /* ************************************************************************* */

  part2: (input: string, isTest: boolean) => {
    // Start with an array of 256 empty arrays
    const emptyBoxes = Array(256).fill(1).map(() => []) as Lens[][];

    return input.
      split(',').
      reduce((boxes, instruction) => {
        const [label, op, val] = instruction.split(/\b/);
        const boxNo = hash(label);

        // Operation is "=": upsert by label
        if (op === '=') {
          const lens = boxes[boxNo].find(lens => lens.label === label);
          if (lens) {
            lens.val = +val;
          } else {
            boxes[boxNo].push({ label, val: +val });
          }

        // Instruction is "-": remove by label
        } else {
          boxes[boxNo] = boxes[boxNo].filter(lens => lens.label !== label);
        }
        return boxes;

      }, emptyBoxes).
      reduce((total, box, boxIdx) => {
        return total + (!box.length ?
            0 :
            box.reduce((subtotal, lens, lensIdx) => {
              return subtotal + ((boxIdx + 1) * (lensIdx + 1) * lens.val);
            }, 0)
        );
      }, 0);
  },

  /* ************************************************************************* */

  tests: [{
    name: 'Part 1 example A',
    part: 1,
    expected: 52,
    input: 'HASH',
  }, {
    name: 'Part 1 example B',
    part: 1,
    expected: 1320,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 515974,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 145,
    inputFile: 'example',
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 265894,
  }]
};

export default def;