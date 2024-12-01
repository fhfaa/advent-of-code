import { PuzzleDefinition } from '../puzzle';

type Point = [number, number];
type TowerMemo = { [key: string]: string }; 

type ShapeInfo = {
  hitLeft: Point[];
  hitRight: Point[];
  hitDown: Point[];
  block: Point[];
  width: number;
  height: number;
};

const SHAPES: number[][][] = [
  '####',
  '.#.\n###\n.#.',
  '..#\n..#\n###',
  '#\n#\n#\n#',
  '##\n##',
].map(shapeStr => shapeStr.
  split('\n').
  map(shapeLine => shapeLine.split('').map(chr => chr === '#' ? 1 : 0)).
  reverse()
);

const SHAPEINFO: ShapeInfo[] = SHAPES.map((shape: number[][]): ShapeInfo => {
  const hitRight: Point[] = [];
  const hitLeft: Point[] = [];
  const hitDown: Point[] = [];
  const block: Point[] = [];
  const width = shape[0].length;
  const height = shape.length;

  // Get coords of all points relative to the shape's [0, 0] position
  // that would have to be free to be able to move LEFT/RIGHT.
  // (naive implementation that is only good enough for the given shapes)
  //
  // Also get coords relative to [0,0] that must be marked as blocked when
  // the rock can't move down.
  shape.forEach((line, dy) => {
    hitLeft.push([line.indexOf(1) - 1, dy]);
    hitRight.push([line.lastIndexOf(1) + 1, dy]);
    block.push(...line.map((chr, dx) => chr ? [dx, dy] as Point : null).filter(Boolean));
  });

  
  // Get coords of all points relative to the shape's [0, 0] position
  // that would have to be free to be able to move DOWN.
  shape[0].forEach((_, dx) => {
    for (let dy = 0; dy < dy + height; dy++) {
      if (shape[dy][dx]) {
        hitDown.push([dx, dy - 1]);
        return;
      }
    }
  });

  return { hitRight, hitLeft, hitDown, block, width, height } as ShapeInfo;
});


function draw(memo: TowerMemo, towerSize: number, rock: { info: ShapeInfo, x: number, y: number }, numLines = 25) {
  memo = JSON.parse(JSON.stringify(memo));
  // Mark current rock in memo map
  for (let dx = 0; dx < rock.info.width; dx++) {
    for (let dy = 0; dy < rock.info.height; dy++) {
      if (rock.info.block.find((([x, y]) => x === dx && y == dy))) {
        memo[`${rock.x+dx},${rock.y+dy}`] = '@';
      }
    }
  } 

  // Draw last $numLines lines. Extend constraints if rock is above tower.
  towerSize = Math.max(rock.info.height + rock.y, towerSize);
  const minY = Math.max(0, towerSize - numLines);
  const lines = [];

  for (let y = towerSize; y >= minY; y--) {
    let row = '';
    for (let x = 0; x < 7; x++) {
      row += memo[`${x},${y}`] ?? '.';
    }
    lines.push('|' + row + '|');
  }
  lines.push(minY === 0 ? '|_______|\n' : '|-/-/-/-|\n');
  console.log(lines.join('\n'));
}


/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */


const def: PuzzleDefinition = {
  year: 2022,
  day: 17,

  /* ************************************************************************* */

  part1: (input: string, isTest: boolean) => {
    const X_MAX = 7;
    const memo: TowerMemo = {};
    let towerSize = -1;

    // Wind pattern is repeating
    const wind = input.split('');
    let windIdx = 0;
    
    for (let i = 0; i < 2022; i++) {
      // Get next shape and spawn it 4 rows above the top of the tower
      const curShape = SHAPEINFO[i % SHAPEINFO.length];
      let y = towerSize + 4;
      let x = 2;

      while (true) {
        // Try to move left/right
        if (wind[windIdx] === '<') {
          if (x > 0 && !curShape.hitLeft.some(([dx, dy]) => memo[`${x+dx},${y+dy}`])) {
            x--;
          }
        } else {
          if (x + curShape.width < X_MAX && !curShape.hitRight.some(([dx, dy]) => memo[`${x+dx},${y+dy}`])) {
            x++;
          }
        }
        windIdx = (windIdx + 1) % wind.length;

        // See if rock can fall further down down.
        // If it can't, mark all points occupied by current rock as blocked
        if (y === 0 || curShape.hitDown.some(([dx, dy]) => memo[`${x+dx},${y+dy}`])) {
          for (let [dx, dy] of curShape.block) {
            memo[`${x + dx},${y + dy}`] = '#';
          }
          towerSize = Math.max(towerSize, y + curShape.height - 1);
          // (i === 2021) && draw(memo, towerSize, { info: curShape, x, y });
          break;
        }

        // Rock falls further down
        y--;
      }
    }

    return towerSize + 1;
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
    expected: 3068,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 3133,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 1514285714288,
    inputFile: 'example'
  }]
};

export default def;