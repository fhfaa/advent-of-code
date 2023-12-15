import { Puzzle } from "../../puzzle";


// Flip x/y in the map, so we only have to implement
// the logic for one direction.
const flip = (map: string[]): string[] => {
  return map[0].split('').map((_, idx) => {
    return map.map(y => y[idx]).join('');
  })
}


// Go from row 1 to the end: compare row with the row above
// If they're the same walk towards opposite ends and keep comparing
// rows until you run out on one side. Abort if rows are different
const findYReflection = (map: string[]): number | null => {
  outer: for (let y = 1, ylen = map.length; y < ylen; y++) {
    if (map[y] === map[y - 1]) {

      let prev = y - 2;
      let next = y + 1;
      while (map[prev] && map[next]) {
        if (map[prev] !== map[next]) {
          continue outer;
        }
        prev--;
        next++;
      }
      return y;
    }
  }
  return null;
}


// pt.2
// Compare two rows and return the number of differences (0, 1, 2+).
// Capped at 2 because it can't be the one we're looking for if we 
// have more than one.
const diff = (a: string, b: string) => {
  let differences = 0;
  for (let i = 0, len = a.length; i < len; i++) {
    if (a.charAt(i) !== b.charAt(i)) {
      if (differences++) {
        return 2;
      } 
    }
  }
  return differences;
}


// pt.2
// Similar to part 1, but we want there to be one difference in total.
const findYReflection2 = (map: string[]): number | null => {
  outer: for (let y = 1, ylen = map.length; y < ylen; y++) {
    let differences = diff(map[y], map[y -1]);

    if (differences < 2) {
      let prev = y - 2;
      let next = y + 1;
      while (map[prev] && map[next]) {
        differences += diff(map[prev], map[next]);
        if (differences >= 2) {
          continue outer;
        }
        prev--;
        next++;
      }
      if (differences === 1) {
        return y;
      }
    }
  }
  return null;
}


/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */


export const P = new Puzzle({
  year: 2023,
  day: 13,

  /* ************************************************************************* */

  part1: (input: string, isTest: boolean) => {
    var maps = input.
      split('\n\n').
      map(map => map.split('\n'));

    return maps.reduce((ret: number, map: string[]): number => {
      // See if mirrored by row
      let val = findYReflection(map);
      return val !== null ?
        ret + val * 100 :
        // No result? Must be mirrored by column. x/y flip and search again,
        // effectively searching by column.
        ret + findYReflection(flip(map));
    }, 0);
  },

  /* ************************************************************************* */

  part2: (input: string, isTest: boolean) => {
    var maps = input.
      split('\n\n').
      map(map => map.split('\n'));

    return maps.reduce((ret: number, map: string[]): number => {
      let val = findYReflection2(map);
      return val !== null ? 
        ret + val * 100 :
        ret + findYReflection2(flip(map));
    }, 0);
  },

  /* ************************************************************************* */

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 405,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 42974,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 400,
    inputFile: 'example',
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 27587,
  }]
});
