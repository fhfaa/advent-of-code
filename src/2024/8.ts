import { PuzzleDefinition } from "../puzzle";

const EMPTY = '.';
const X = 0, Y = 1;

type CoordsMap = {
  [key: string]: Array<[number, number]>
};

type Parsed = {
  coords: CoordsMap,
  ylen: number;
  xlen: number;
}


const parseInput = (input: string): Parsed => {
  const lines = input.split('\n');

  const coords = lines
    .reduce((ret, line, y) => {
      line
        .split('')
        .forEach((chr, x) => {
          if (chr !== EMPTY) {
            ret[chr] ??= [];
            ret[chr].push([x, y]);
          }
        });
      return ret;
    }, {} as CoordsMap);

    return {
      coords,
      xlen: lines[0].length,
      ylen: lines.length,
    };
}


const def: PuzzleDefinition = {
  part1: (input, isTest = false): number => {
    const { xlen, ylen, coords } = parseInput(input);

    const antinodes = new Set<string>();

    // For each type of antenna (i.e. different letter/number)
    Object.keys(coords).forEach((antennaKey) => {
      const antennae = coords[antennaKey];

      // For each pair of antennae
      for (let i = 0; i < antennae.length; i++) {
        for (let j = i + 1; j < antennae.length; j++) {
          // generate one antinode per direction
          const [x1, y1] = antennae[i];
          const [x2, y2] = antennae[j];
          const dx = x2 - x1;
          const dy = y2 - y1;
          const anti1 = [x1 - dx, y1 - dy];
          const anti2 = [x2 + dx, y2 + dy];

          // add it, if it's within the bounds of our map
          if (anti1[X] >= 0 && anti1[X] < xlen && anti1[Y] >= 0 && anti1[Y] < ylen) {
            antinodes.add(`${anti1[X]},${anti1[Y]}`);
          } 
          if (anti2[X] >= 0 && anti2[X] < xlen && anti2[Y] >= 0 && anti2[Y] < ylen) {
            antinodes.add(`${anti2[X]},${anti2[Y]}`);
          }
        }
      }
    });

    return antinodes.size;
  },


  part2: (input, isTest = false): number => {
    const { xlen, ylen, coords } = parseInput(input);

    const antinodes = new Set<string>();

    // For each type of antenna (i.e. different letter/number)
    Object.keys(coords).forEach((antennaKey) => {
      const antennae = coords[antennaKey];

      // For each pair of antennae
      for (let i = 0; i < antennae.length; i++) {
        for (let j = i + 1; j < antennae.length; j++) {
          // generate one antinode per direction
          let [x1, y1] = antennae[i];
          let [x2, y2] = antennae[j];
          const dx = x2 - x1;
          const dy = y2 - y1;

          do {
            antinodes.add(`${x1},${y1}`);
            x1 -= dx;
            y1 -= dy;
          } while (x1 >= 0 && x1 < xlen && y1 >= 0 && y1 < ylen);

          do {
            antinodes.add(`${x2},${y2}`);
            x2 += dx;
            y2 += dy;
          } while (x2 >= 0 && x2 < xlen && y2 >= 0 && y2 < ylen);
        }
      }
    });
    
    return antinodes.size;
  },

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 14,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 398,
  }, {
    name: 'Part 2 simple example',
    part: 2,
    expected: 9,
    inputFile: 'example_simple'
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 34,
    inputFile: 'example'
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 1333,
  }]
};

export default def;