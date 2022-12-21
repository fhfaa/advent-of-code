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
    const lines = input.split('\n').map(line => line.split(': '));

    const found: Results = {};

    let monkeys: ArithMonkey[] = lines.
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
    // if (!isTest) { return 'TODO'; }

    const ME = 'humn';
    const found: Results = {};
    const lines = input.split('\n').map(line => line.split(': '));

    let monkeys: ArithMonkey[] = lines.
      filter(([name, cmd])  => {
        // If command is numeric, remember (name => number) mapping
        // and filter the row out (nothing else to do with this monkey). 
        if (/^\d+$/.test(cmd)) {
          // Insert +Infinity for our unkmown value. Infinity is propagated 
          // up to the root with each arithmetic operation - similar to NaN,
          // but truthy. This way we know what side of the operation "we" are on.
          found[name] = name === ME ? +Infinity : +cmd;
          return false;
        }
        return true;
      }).map(([name, cmd]) => {
        const [a, op, b] = cmd.split(' ');
        return { name, a, op, b } as ArithMonkey;
      });

    // Make a copy of the monkeys for later.
    const monkeys2 = monkeys.slice(); 

    // Same as part 1
    // Calculate everything until we've reached the root monkey
    while (monkeys.length) {
      monkeys = monkeys.filter(monkey => {
        // Operands not known yet - keep monkey for next iteration.
        if (!found[monkey.a] || !found[monkey.b]) {
          return true;
        }

        if (monkey.name === 'root') {
          // Turn the root monkey's op into "-". We're going to use a-b==0
          // instead of a==b so we can re-use the standard operators.
          // Preserve its operands, skip calculation
          monkey.op = '-';
          return false;
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

    const solve = (monkeyName: string, expected: number): number => {
      if (monkeyName === ME) {
        // We've found ourself and determined the value we need to yell
        // to fulfill the root monkey's comparison.
        return expected;
      }

      // Retrieve operand values for this monkey. One will be a number,
      // the other one (leading to ourself) will be Infinity.
      const monkey = monkeys2.find(m2 => m2.name === monkeyName);
      const aval = found[monkey.a];
      const bval = found[monkey.b];
      const aMissing = isFinite(bval);

      // Recurse until we find ourself, reversing the calculations as we go
      // And passing along the value we would need in there to make the root
      // calculation work.
      switch (monkey.op) {
        case '+':
          return aMissing ?
            solve(monkey.a, expected - bval) :
            solve(monkey.b, expected - aval);
        case '-':
          return aMissing ?
            solve(monkey.a, expected + bval) :
            solve(monkey.b, aval - expected);
        case '*':
          return aMissing ?
            solve(monkey.a, expected / bval) :
            solve(monkey.b, expected / aval);
        case '/':
          return aMissing ?
            solve(monkey.a, expected * bval) :
            solve(monkey.b, aval / expected);
      }
    };

    // We've changed the root operator to "-", so instead of comparing
    // a==b, we're doing a-b==0
    return solve('root', 0);
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
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 3453748220116,
  }, ]
});
