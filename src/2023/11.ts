import { PuzzleDefinition } from '../puzzle';

// pt.1
type Universe = ('#'|'.')[][];
type Galaxy = { x: number; y: number; };

const expandUniverse = (universe: Universe): Universe => {
  for (let y = 0; y < universe.length; y++) {
    if (!universe[y].includes('#')) {
      universe.splice(y, 0, new Array(universe[0].length).fill('.'));
      y++;
    }
  }
  
  for (let x = 0; x < universe[0].length; x++) {
    if (universe.every(row => row[x] === '.')) {
      for (let y = 0; y < universe.length; y++) {
        universe[y].splice(x, 0, '.');
        
      }
      x++;
    }
  }

  return universe;
}


const findGalaxies = (universe: Universe) => {
  const galaxies: Galaxy[] = [];

  for (let y = 0; y < universe.length; y++) {
    for (let x = 0; x < universe[0].length; x++) {
      if (universe[y][x] === '#') {
        galaxies.push({ x, y });
      }
    }
  }

  return galaxies;
}


const manhattanDistance = (a: Galaxy, b: Galaxy): number => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}


// pt.2
type Expansions = { x: number[], y: number[]; }


const findExpansions = (universe: Universe): Expansions => {
  const exp = { x: [], y: [] };

  for (let y = 0; y < universe.length; y++) {
    if (!universe[y].includes('#')) {
      exp.y.push(y);
    }
  }
  
  for (let x = 0; x < universe[0].length; x++) {
    if (universe.every(row => row[x] === '.')) {
      exp.x.push(x);
    }
  }

  return exp;
}


/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */


const def: PuzzleDefinition = {
  year: 2023,
  day: 11,

  /* ************************************************************************* */

  part1: (input: string, isTest: boolean) => {
    const universe = input.
      split('\n').
      map(line => line.split('')) as Universe;

    // Naive approach: really expand the universe (and its arrays),
    // then find the x/y coords of the galaxies
    const galaxies = findGalaxies(expandUniverse(universe));
    
    // Sum the manhattan distances between each pair of galaxies
    let sum = 0;
    for (let i = 1; i < galaxies.length; i++) {
      for (let j = 0; j < i; j++) {
        sum += manhattanDistance(galaxies[i], galaxies[j]);
      }
    }
    return sum;
  },

  /* ************************************************************************* */

  part2: (input: string, isTest: boolean, params: any = { EXPANSION_SIZE: 1_000_000 }) => {
    const universe = input.
      split('\n').
      map(line => line.split('')) as Universe;

    // This time don't actually expand the arrays,
    // just find the x and y indices of all places that would be expanded
    const galaxies = findGalaxies(universe);
    const expansions = findExpansions(universe);
    
    let sum = 0;
    // For each of the galaxy pairs
    for (let i = 1; i < galaxies.length; i++) {
      for (let j = 0; j < i; j++) {

        // Add the regular manhattan dist without expansions
        sum += manhattanDistance(galaxies[i], galaxies[j]);

        // For both x and y coords, separately
        for (let which of ['x', 'y']) {

          // Find min and max between the two galaxies
          const [min, max] = galaxies[i][which] < galaxies[j][which] ?
            [galaxies[i][which], galaxies[j][which]] :
            [galaxies[j][which], galaxies[i][which]];

          // Find all expansion indices between min and max and add
          // the expansion size (minus the 1 from the regular manhattan dist)
          for (let exp of expansions[which]) {
            if (exp >= min) {
              if (exp < max) {
                sum += (params.EXPANSION_SIZE - 1);
              } else {
                break;
              }
            }
          }
        }
      }
    }
    return sum;
  },

  /* ************************************************************************* */

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 374,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 9647174,
  }, {
    name: 'Part 2 example A',
    part: 2,
    expected: 1030,
    inputFile: 'example',
    params: { EXPANSION_SIZE: 10 }
  }, {
    name: 'Part 2 example B',
    part: 2,
    expected: 8410,
    inputFile: 'example',
    params: { EXPANSION_SIZE: 100 }
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 377318892554,
  }]
};

export default def;