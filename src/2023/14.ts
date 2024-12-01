import { PuzzleDefinition } from '../puzzle';

type Board = string[][];


const tiltUp = (board: Board): Board => {
  // For each column
  for (let x = 0, xlen = board[0].length; x < xlen; x++) {

    // Destination: index of tile that the next boulder will roll to
    let dest = 0;

    for (let y = 0, ylen = board.length; y < ylen; y++) {
      switch (board[y][x]) {
        case 'O':
          // Boulder has somewhere to roll to
          if (y > dest) {
            board[y][x] = '.';
            board[dest][x] = 'O';
          }
          // Else: it can't roll any further.
          // Increase next dest either way.
          dest++;
          break;

        // Fixed boulder encountered. Next possible dest ist after it
        case '#':
          dest = y + 1;
          break;
      }
    }
  }

  return board;
}


// Same as above, but with x/y the other way round
const tiltLeft = (board: Board): Board => {
  for (let row of board) {
    let dest = 0;

    for (let x = 0, xlen = board.length; x < xlen; x++) {
      switch (row[x]) {
        case 'O':
          if (x > dest) {
            row[x] = '.';
            row[dest] = 'O';
          }
          dest++;
          break;

        case '#':
          dest = x + 1;
          break;
      }
    }
  }

  return board;
}


// We simulate down and right by flipping the board in both directions first,
// then flipping it back afterwards. 
const tilt = (board: string[][]) => {
  board = tiltUp(board);
  board = tiltLeft(board);
  board = board.reverse().map(row => row.reverse());
  board = tiltUp(board);
  board = tiltLeft(board);
  board = board.reverse().map(row => row.reverse());
  return board;
}


// pt.2
// "hash" :d
const hashState = (board: Board): string => {
  return board.map(row => row.join('')).join('');
}


/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */


const def: PuzzleDefinition = {
  year: 2023,
  day: 14,

  /* ************************************************************************* */

  part1: (input: string, isTest: boolean) => {
    let board = input.
      split('\n').
      map(line => line.split(''));

    // Tilt the board up once
    board = tiltUp(board);

    // Get load on northern support beams
    return board.reduce((sum, row, yIdx) => {
      return sum + row.reduce((sum2, chr) => {
        return sum2 + (chr === 'O' ? row.length - yIdx: 0);
      }, 0);
    }, 0);
  },

  /* ************************************************************************* */

  part2: (input: string, isTest: boolean) => {
    let board = input.
      split('\n').
      map(line => line.split(''));

    // For each state of the board, remember in which iteration it was first seen
    // If we see a known state again, we know there is a loop and can infer the
    // final state from the history.
    const memo: { [state: string]: number } = {
      [hashState(board)]: 0,
    };

    for (let i = 1; i <= 1_000_000_000; i++) {
      board = tilt(board);
      const hash = hashState(board);

      // New state -- keep going
      if (memo[hash] === undefined) {
        memo[hash] = i;

      // Known state -- loop found!
      } else {
        const loopLength = i - memo[hash];

        const remainingTilts = 1_000_000_000 - i;
        let tiltsUntilFinalState = (remainingTilts % loopLength);

        // We only need to simulate the tilts after the end of the next
        // multiple of the loop length that is before 1000000000
        while (tiltsUntilFinalState --> 0) {
          board = tilt(board);
        }
        break;
      }
    }

    // Get load on northern support beams
    return board.reduce((sum, row, yIdx) => {
      return sum + row.reduce((sum2, chr) => {
        return sum2 + (chr === 'O' ? row.length - yIdx: 0);
      }, 0);
    }, 0);
  },

  /* ************************************************************************* */

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 136,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 108935,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 64,
    inputFile: 'example',
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 100876,
  }]
};

export default def;