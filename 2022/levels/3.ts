import { Puzzle } from "../../puzzle";

function getPriority(char: string): number {
  const code = char.charCodeAt(0);
  return (code >= 97 ? code - 96 : code - 38);
  
}


export const P = new Puzzle({
  year: 2022,
  day: 3,


  part1: (input, isTest = false) => {
    const part1 = input.split('\n').reduce((sum: number, row: string) => {
      const left = row.substring(0, row.length / 2).split('');
      const right = row.substring(row.length / 2).split('');

      for (const l of left) {
        if (right.includes(l)) {
          return sum + getPriority(l);
        }
      }
    }, 0);

    return part1;
  },


  part2: (input, isTest = false) => {
    const rows = input.split('\n');
    let sum = 0;

    for (let i = 0, len = rows.length; i < len; i += 3) {
      const group = rows.slice(i, i + 3).map(row => row.split(''));

      const badgeItem = group[0].find(item => {
        return group[1].includes(item) && group[2].includes(item);
      });
      sum += getPriority(badgeItem);
    }
    return sum;
  },


  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 157,
    inputFile: 'example',
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 70,
    inputFile: 'example2'
  }]
});
