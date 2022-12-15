import { Puzzle } from "../../puzzle";

type Sensor = [number, number, number, number];
type XRange = { from: number, to: number };

/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */

export const P = new Puzzle({
  year: 2022,
  day: 15,

  /* ************************************************************************* */

  part1: (input: string, isTest: boolean, params: any = { Y: 2000000 }) => {
  const Y = params.Y;
  const beaconXs: number[] = [];

  return input.
    split('\n').
    map(line => line.
      replace(/[^0-9-]+/g, ',').
      split(',').
      slice(1).
      map(parseFloat)
    ).
      reduce((ranges: XRange[], [x, y, beaconX, beaconY]: Sensor): XRange[] => {
        // Note unique beacon X positions on Y row,
        if (beaconY === Y && !beaconXs.includes(beaconX)) {
          beaconXs.push(beaconX);
        }

        const sensorRange = Math.abs(x - beaconX) + Math.abs(y - beaconY);
        
        // Filter out sensors that are too far away to be relevant 
        // (Manhattan distance to closest beacon is smaller than the delta in Y coord)
        const dy = Math.abs(y - Y);
        if (dy < sensorRange) {
          // After going {deltaY} steps up/down, the sensor can still use {range-deltaY}
          // to go left or right. Use this to determine minX and maxX blocked on the given Y.
          const dx = sensorRange - dy;
          ranges.push({
            from: x - dx,
            to: x + dx
          });
        }
        return ranges;
      }, [] as XRange[]).

      // Sort ranges so we can check for overlaps more easily
      sort((a: XRange, b: XRange) => {
        return a.from === b.from ?
          a.to < b.to ? -1 : 1 :
          a.from < b.from ? -1 : 1;
      }).

      // Merge overlapping or touching ranges into one
      reduce((ranges: XRange[], next: XRange): XRange[] => {
        if (ranges.length) {
          const prev = ranges.at(-1);
          // If overlap or touching
          if (next.from - 1 <= prev.to) {
            prev.to = Math.max(prev.to, next.to);
            return ranges;
          }
        }
        ranges.push(next);
        return ranges;
      }, [] as XRange[]).

      // After merging, sum up the sizes of the range, accounting for special 
      // things inside of them (subtract beacons and sensors).
      reduce((sum: number, next: XRange) => {
        const specialsInRange = beaconXs.filter(sx => sx >= next.from && sx <= next.to).length;
        return sum + (next.to - next.from + 1) - specialsInRange;
      }, 0);
  },

  /* ************************************************************************* */

  part2: (input: string, isTest: boolean) => {
    if (!isTest) { return; }
    return 'WIP';
  },

  /* ************************************************************************* */

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 26,
    inputFile: 'example',
    params: { Y: 10 }
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 56000011,
    inputFile: 'example'
  }, {
    name: 'Part 1 my input', 
    part: 1,
    expected: 5108096,
  }]
});
