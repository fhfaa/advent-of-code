import { PuzzleDefinition } from '../puzzle';


const def: PuzzleDefinition = {
  year: 2022,
  day: 8,


  part1: (input: string, isTest: boolean) => {
    const trees: number[][] = input.
      split('\n').
      map(row => row.split('').map(parseFloat));
    
    const isTreeVisible = (trees: number[][], x: number, y: number): number => {
      let val = trees[y][x];

      for (let i = x - 1; i >= 0 && val > trees[y][i]; i--) {
        if (i === 0) { return 1; } // is tree visible from left?
      }
      for (let i = y - 1; i >= 0 && val > trees[i][x]; i--) {
        if (i === 0) { return 1; } // is tree visible from top?
      }
      for (let i = x + 1, lastIdx = trees[0].length - 1; i <= lastIdx && val > trees[y][i]; i++) {
        if (i === lastIdx) { return 1; } // is tree visible from right?
      }
      for (let i = y + 1, lastIdx = trees.length - 1; i <= lastIdx && val > trees[i][x]; i++) {
        if (i === lastIdx) { return 1; } // is tree visible from bottom?
      }
      return 0;
    }
    
    // edges are always visible, only check insides
    let visible = (trees.length * 2 - 4) + trees[0].length * 2;
    for (let x = 1, xmax = trees[0].length - 1; x < xmax; x++) {
      for (let y = 1, ymax = trees.length - 1; y < ymax; y++) {
        visible += isTreeVisible(trees, x, y);
      } 
    }
    return visible;
  },


  part2: (input: string, isTest: boolean) => {
    const trees: number[][] = input.
      split('\n').
      map(row => row.split('').map(c => +c));
    
    const getScenicScore = (trees: number[][], x: number, y: number): number => {
      let val = trees[y][x],
        scenicScore = 1,
        lastX = trees[0].length - 1,
        lastY = trees.length - 1;
      
      for (let i = x - 1, visibleTrees = 1; i >= 0; i--, visibleTrees++) {
        if (val <= trees[y][i] || i === 0) { // view blocked or end of forest
          scenicScore *= visibleTrees; break;
        }
      }
      for (let i = y - 1, visibleTrees = 1; i >= 0; i--, visibleTrees++) {
        if (val <= trees[i][x] || i === 0) { // view blocked or end of forest
          scenicScore *= visibleTrees; break;
        }
      }
      for (let i = x + 1, visibleTrees = 1; i <= lastX; i++, visibleTrees++) {
        if (val <= trees[y][i] || i === lastX) { // view blocked or end of forest
          scenicScore *= visibleTrees; break;
        }
      }
      for (let i = y + 1, visibleTrees = 1; i <= lastY; i++, visibleTrees++) {
        if (val <= trees[i][x] || i === lastY) { // view blocked or end of forest
          scenicScore *= visibleTrees; break;
        }
      }
      return scenicScore;
    }
    
    // edge scores are 0 anyway, only check inside
    let maxScore = 0;
    for (let x = 1, xmax = trees[0].length - 1; x < xmax; x++) {
      for (let y = 1, ymax = trees.length - 1; y < ymax; y++) {
        maxScore = Math.max(maxScore, getScenicScore(trees, x, y));
      }
    }
    return maxScore;
  },


  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 21,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 1703,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 8,
    inputFile: 'example'
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 496650
  }]
};

export default def;