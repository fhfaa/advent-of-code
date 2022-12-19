import { Puzzle } from "../../puzzle";


type Sensor = [number, number, number, number];
type XRange = { from: number, to: number };

type Sensor2 = {
  x: number;
  y: number;
  range: number
};

/* ************************************************************************* */

function manhattan(x1: number, y1: number, x2: number, y2: number): number {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}


/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */


export const P = new Puzzle({
  year: 2022,
  day: 15,

  /* ************************************************************************* */

  part1: (input: string, isTest: boolean, params: any = { Y: 2_000_000 }) => {
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

        const sensorRange = manhattan(x, y, beaconX, beaconY);
        
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

  part2: (input: string, isTest: boolean, params: any = { MAX_XY: 4_000_000 }) => {
    const MIN_XY = 0;
    const MAX_XY = params.MAX_XY;

    const sensors = input.
      split('\n').
      map(line => line.
        replace(/[^0-9-]+/g, ',').
        split(',').
        slice(1).
        map(parseFloat)
      ).
      map(([x, y, beaconX, beaconY]: Sensor): Sensor2 => ({
          x,
          y,
          range: manhattan(x, y, beaconX, beaconY)
        })
      );

    const XY_FLIP = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

    // For each sensor
    for (let sensor of sensors) {
      // Walk around the sensor just outside of its range
      for (let dx = 0, dxMax = sensor.range + 1; dx <= dxMax; dx++) {
        // Walk all edges at the same time (1 move, flipped in 4 directions)
        for (let [xFlip, yFlip] of XY_FLIP) {
          const dy = sensor.range + 1 - dx;
          const testX = sensor.x + dx * xFlip;
          const testY = sensor.y + dy * yFlip;

          // Then check if these candidate points are within the constraints...
          if (testX >= MIN_XY && testY >= MIN_XY &&
              testX <= MAX_XY && testY <= MAX_XY &&
              // ... and not in range of any sensor
              sensors.every(otherSensor => manhattan(otherSensor.x, otherSensor.y, testX, testY) > otherSensor.range)) {
            
            // Only true for one point. Missing beacon found!
            return testX * 4000000 + testY
          }
        }
      }
    }
  },

  /* ************************************************************************* */

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 26,
    inputFile: 'example',
    params: { Y: 10 }
  }, {
    name: 'Part 1 my input', 
    part: 1,
    expected: 5108096,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 56000011,
    inputFile: 'example',
    params: { MAX_XY: 20 }
  }, {
    name: 'Part 2 my input', 
    part: 2,
    expected: 10553942650264,
  }]
});
