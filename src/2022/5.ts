import { PuzzleDefinition } from '../puzzle';


function parseStackData(stackInput: string): string[][] {
  const stackData = stackInput.split('\n').slice(0, -1);
  const stacks: string[][] = [];

  for (let x = 1, xlen = stackData[0].length; x < xlen; x += 4) {
    const stack: string[] = [];

    for (let y = stackData.length - 1; y >= 0; y -= 1) {
      if (stackData[y].charAt(x) === ' ') {
        break;
      }
      stack.push(stackData[y].charAt(x));
    }
    stacks.push(stack);
  }
  return stacks;
}


const def: PuzzleDefinition = {
  year: 2022,
  day: 5,


  part1: (input: string, isTest: boolean) => {
    const [stackInput, moves]: string[] = input.split('\n\n');
    const stacks = parseStackData(stackInput);
    
    moves.replace(/[a-z]+? /g, '').
      split('\n').
      forEach(str => {
        let [num, from, to] = str.split(' ').map(parseFloat);
        
        // Move one-by-one
        while (num --> 0) {
          stacks[to - 1].push(stacks[from - 1].pop());
        }
      });

    return stacks.map(stack => stack.pop()).join('');
  },


  part2: (input: string, isTest: boolean) => {
    const [stackInput, moves]: string[] = input.split('\n\n');
    const stacks = parseStackData(stackInput);
    
    moves.replace(/[a-z]+? /g, '').
      split('\n').
      forEach(str => {
        let [num, from, to] = str.split(' ').map(parseFloat);

        // (Pretend to) move all together
        const tmp: string[] = [];
        while (num --> 0) {
          tmp.push(stacks[from - 1].pop());
        }
        stacks[to - 1].push(...tmp.reverse());
      });

    return stacks.map(stack => stack.pop()).join('');
  },


  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 'CMZ',
    inputFile: 'example',
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 'MCD',
    inputFile: 'example'
  }]
};

export default def;