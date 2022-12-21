import { Puzzle } from "../../puzzle";

type Results = { [key: string]: number };
type ArithMonkey = {
  name: string;
  a: string;
  b: string;
  op: string;
}

/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */

export const P = new Puzzle({
  year: 2022,
  day: 21,

  /* ************************************************************************* */

  part1: (input: string, isTest: boolean) => {

    const found: Results = {};
    
    let monkeys: ArithMonkey[] = input.
      split('\n').
      map(line => line.split(': ')).
      filter(([name, cmd])  => {
        // If command is numeric, remember (name => number) mapping
        // and filter the row out (nothing else to do with this monkey). 
        if (/^\d+$/.test(cmd)) {
          found[name] = +cmd;
          return false;
        }
        return true;
      }).map(([name, cmd]) => {
        const [a, op, b] = cmd.split(' ');
        return { name, a, op, b } as ArithMonkey;
      });
    
    // As long as we have monkeys left to handle
    while (monkeys.length) {
      monkeys = monkeys.filter(monkey => {
        // Operands not known yet - keep monkey for next iteration.
        if (!found[monkey.a] || !found[monkey.b]) {
          return true;
        }

        // Both operands known - solve and remove from list of remaining monkeys.
        switch (monkey.op) {
          case '+': found[monkey.name] = found[monkey.a] + found[monkey.b]; break;
          case '-': found[monkey.name] = found[monkey.a] - found[monkey.b]; break;
          case '*': found[monkey.name] = found[monkey.a] * found[monkey.b]; break;
          case '/': found[monkey.name] = found[monkey.a] / found[monkey.b]; break;
        }
        return false;
      });
    }

    return found.root;
  },

  /* ************************************************************************* */

  part2: (input: string, isTest: boolean) => {
    if (!isTest) { return 'TODO'; }
    return 'TODO';
  },

  /* ************************************************************************* */

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 152,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 21120928600114,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 301,
    inputFile: 'example'
  }]
});
