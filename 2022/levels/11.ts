import { Puzzle } from "../../puzzle";


type Monkey = {
  id: number,
  items: number[],
  opFn: (_item: number) => number 
  divBy: number;
  ifTrue: number;
  ifFalse: number;
  itemsTouched: number;
}


function parseMonkey(monkeyStr: string): Monkey {
  const match = monkeyStr.
    replace(/ .*If (?:true|false): throw to monkey (\d+?)/g, '$1').
    match(/Monkey (\d+):\n.*?items: (\d+?(?:, \d+?)*)\n.*?ation: new = ([^\n]+?)\n.*? by (\d+?)\n(\d+?)\n(\d+?)/);

  let [left, op, right]: string[] = match[3].split(' '); // 'old', '+', '7'
  const right2: number | null = isNaN(+right) ? null : +right;

  return {
    id: +match[1],
    items: match[2].split(', ').map(parseFloat),
    opFn: op === '+' ? 
      (_item: number): number => _item + (right2 ?? _item) :
      (_item: number): number => _item * (right2 ?? _item),
    divBy: +match[4],
    ifTrue: +match[5],
    ifFalse: +match[6],
    itemsTouched: 0,
  };
}



export const P = new Puzzle({
  year: 2022,
  day: 11,


  part1: (input: string, isTest: boolean) => {
    const monkeys: Monkey[] = input.split('\n\n').map(monkeyStr => parseMonkey(monkeyStr));

    for (let round = 1; round <= 20; round++ ) {
      for (let monkey of monkeys) {
        monkey.itemsTouched += monkey.items.length;

        while (monkey.items.length) {
          let item = monkey.items.shift();
          item = Math.floor(monkey.opFn(item) / 3);

          const targetMonkey = item % monkey.divBy === 0 ? monkey.ifTrue : monkey.ifFalse;
          monkeys[targetMonkey].items.push(item);
        }
      }
    }
  
    const inspected = monkeys.map(m => m.itemsTouched).sort((m1, m2) => m2 - m1);
    return inspected[0] * inspected[1];
  },


  part2: (input: string, isTest: boolean) => {
    const monkeys: Monkey[] = input.split('\n\n').map(monkeyStr => parseMonkey(monkeyStr));
    // bigints gonna bigint? :|
    // lucky we already had this the other year with bus stops or so
    const divisors = monkeys.reduce((all, monkey) => all * monkey.divBy, 1);

    for (let round = 1; round <= 10_000; round++ ) {
      for (let monkey of monkeys) {
        monkey.itemsTouched += monkey.items.length;

        while (monkey.items.length) {
          let item = monkey.items.shift();
          item = monkey.opFn(item);

          const targetMonkey = item % monkey.divBy === 0 ? monkey.ifTrue : monkey.ifFalse;
          monkeys[targetMonkey].items.push(item % divisors);
        }
      }
    } 

    const inspected = monkeys.map(m => m.itemsTouched).sort((m1, m2) => m2 - m1);
    return inspected[0] * inspected[1];
  },


  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 10605,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 117640,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 2713310158,
    inputFile: 'example'
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 30616425600,
  }]
});
