import { PuzzleDefinition } from '../puzzle';

const UP = 0, RIGHT = 1, DOWN = 2, LEFT = 3;
const deltas = [ // URDL
  [ 0, -1], [1,  0], [ 0,  1], [-1,  0],
] as const;
type Move = [number, number, number];


const solve = (board: string[][], moves: Move[] = [[0, 0, RIGHT]]): number => {
  const energized = new Set<string>();
  const memo = new Set<string>();

  while (moves.length) {
    const [x, y, dir] = moves.pop();
    const symbol = board[y]?.[x];

    // Abort if we're outside of the board or have already
    // visited this space from the same direction.
    if (symbol === undefined || memo.has(`${x},${y},${dir}`)) {
      continue;
    }

    // Remember visited places incl. diretion and energized places
    memo.add(`${x},${y},${dir}`);
    energized.add(`${x},${y}`);

    // "." or pointy end of splitter
    if (symbol === '.' ||
      (symbol === '|' && (dir === UP || dir === DOWN)) ||
      (symbol === '-' && (dir === LEFT || dir === RIGHT))) {
      const [dx, dy] = deltas[dir];
      moves.push([x + dx, y + dy, dir]);
    
    // Flat sides of splitters
    } else if (symbol === '|') {
      moves.push([x, y - 1, UP]);
      moves.push([x, y + 1, DOWN]);
    } else if (symbol === '-') {
      moves.push([x - 1, y, LEFT]);
      moves.push([x + 1, y, RIGHT]);

    // Diagonals
    } else if (symbol === '/') {
      const newDirDelta = (dir === UP || dir === DOWN) ? 1 : -1;
      const newDir = (4 + (dir + newDirDelta)) % 4;
      const [dx, dy] = deltas[newDir];
      moves.push([x + dx, y + dy, newDir]);

    } else if (symbol === '\\') {
      const newDirDelta = (dir === UP || dir === DOWN) ? -1 : 1;
      const newDir = (4 + (dir + newDirDelta)) % 4;
      const [dx, dy] = deltas[newDir];
      moves.push([x + dx, y + dy, newDir]);

    }
  }

  return energized.size;
}


/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */

const def: PuzzleDefinition = {
  year: 2023,
  day: 16,

  /* ************************************************************************* */

  part1: (input: string, isTest: boolean) => {
    const board: string[][] = input.
      split('\n').
      map(row => row.split(''));

    return solve(board);
  },

  /* ************************************************************************* */

  part2: (input: string, isTest: boolean) => {
    const board: string[][] = input.
      split('\n').
      map(row => row.split(''));

    // Run part 1 once for each starting positions. Return 
    let max = -Infinity;
    for (let y = 0, ylen = board.length; y < ylen; y++) {
      max = Math.max(max, solve(board, [[0, y, RIGHT]]));
      max = Math.max(max, solve(board, [[board[0].length - 1, y, LEFT]]));
    }
    for (let x = 0, xlen = board[0].length; x < xlen; x++) {
      max = Math.max(max, solve(board, [[x, 0, DOWN]]));
      max = Math.max(max, solve(board, [[x, board.length - 1, UP]]));
    }
    return max;
  },

  /* ************************************************************************* */

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 46,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 8551,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 51,
    inputFile: 'example',
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 8754,
  }]
};

export default def;