import { Puzzle } from "../../puzzle";


type List = Array<number | List>;


// -1 right order (left is larger-ish)
//  0 equal-ish / indeterminate
//  1 wrong order (right is larger-ish)
function checkOrder(left: number | List, right: number | List): number {
  const lNum = typeof left === 'number';
  const rNum = typeof right === 'number';

  // 2 numbers - compare
  if (lNum && rNum) {
    return left !== right ? (left as number) - (right as number) : 0;
  }

  // 0 or 1 number - make sure both are Lists
  left = lNum ? [left] : left as List;
  right = rNum ? [right] : right as List;

  for (let i = 0, len = left.length; i < len; i++) {
    // Right side ran out of items --> wrong order
    if (right[i] === undefined) {
      return 1; 
    }

    // Compare nested elems; return early if not equal
    const cmp = checkOrder(left[i], right[i]);
    if (cmp !== 0) {
      return cmp;
    }
  }

  // Left side ran out of items --> right order
  if (right.length > left.length) {
    return -1; 
  }
  return 0;
}


export const P = new Puzzle({
  year: 2022,
  day: 13,


  part1: (input: string, isTest: boolean) => {
    const pairs = input.
      split('\n\n').
      map(block => block.
        split('\n').
        map(row => JSON.parse(row) as List
      ) as [List, List]
    );

    return pairs.reduce((sum, pair, idx) => {
      return sum + (
        checkOrder(pair[0], pair[1]) <= 0 ?
          idx + 1 :
          0
      );
    }, 0);
  },


  part2: (input: string, isTest: boolean) => {
    const dividers = [ [[2]], [[6]] ];
    const packets = input.
      split(/\n\n?/).
      map(row => JSON.parse(row) as List).
      concat(dividers).
      sort(checkOrder);

    return (packets.indexOf(dividers[0]) + 1) * (packets.indexOf(dividers[1]) + 1);
  },


  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 13,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 5760,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 140,
    inputFile: 'example'
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 26670,
  }]
});
