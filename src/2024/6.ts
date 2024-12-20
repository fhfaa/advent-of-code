import { PuzzleDefinition } from "../puzzle";

type XMap = string[][];
type Guard = [number, number];
type Parsed = {
  map: XMap;
  guard: Guard;
};

// x,y offsets for U R D L movement (clockwise)
const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const UP = 0; // idx in the above;
const X = 0, Y = 1;

const WALL = '#';
const EMPTY = '.';

const parseInput = (input: string, wallChr = '#', guardChr = '^'): Parsed => {
  let guard: Guard = null;

  const map = input.split('\n').
    map((row, y) => {
      const rowArr = row.split('');

      // If guard is in this row, note his position
      if (guard === null && rowArr.indexOf(guardChr) > -1) {
        guard = [row.indexOf(guardChr), y];
      }
      return rowArr;
    });

    map[guard[Y]][guard[X]] = EMPTY;

    return { map, guard };
}


const walk1 = (map: XMap, guard: Guard, withDirection: boolean): { visited: Set<string>; routeIsCircular: boolean; } => {
  let curDirection = UP;

  const visited = new Set<string>([
    withDirection
      ? `${guard[X]},${guard[Y]},${UP}`
      : `${guard[X]},${guard[Y]}`
  ]);
  let routeIsCircular = false;

  while (true) {
    const nextX = guard[X] + directions[curDirection][X];
    const nextY = guard[Y] + directions[curDirection][Y];
    const chr = map[nextY]?.[nextX];
    
    // Guard has left the map - quit
    if (chr === undefined) {
      break;
    }

    // Guard hit wall - turn clockwise
    if (chr === WALL) {
      curDirection = (curDirection + 1) % directions.length;
      continue;
    }

    const mapKey = withDirection ? `${nextX},${nextY},${curDirection}` : `${nextX},${nextY}`;

    // Part 2 only - quit
    // route is circular if we've been on the same spot facing the same direction
    if (withDirection && visited.has(mapKey)) {
      routeIsCircular = true;
      break;
    }

    // Regular step - note visited point (for both) and direction (for part 2)
    visited.add(mapKey);
    guard = [nextX, nextY];
  }
  return { visited, routeIsCircular };
}


const walk2 = (map: XMap, guard: Guard): number => {
  let curDirection = UP;

  const visited = new Set<string>();

  while (true) {
    let [nextX, nextY] = guard;
    let [dx, dy] = directions[curDirection];

    // Walk until obstacle or end of map
    do {
      nextX += dx;
      nextY += dy;
    } while (map[nextY]?.[nextX] === EMPTY);
    
    // Guard has left the map - quit
    if (map[nextY]?.[nextX] === undefined) {
      return 0;
    }

    // Guard hit wall - turn clockwise
    if (map[nextY][nextX] === WALL) {
      // move guard to one step before the obstacle
      //
      // instead of remembering the visited coords, rememeber only the 
      // obstacles hit and the direction the guard is currently facing
      // (obstacles can be hit from different sides) 
      guard = [nextX - dx, nextY - dy];
      const key = `${guard[X]},${guard[Y]},${curDirection}`;

      if (visited.has(key)) {
        return 1;
      }

      visited.add(key);
      curDirection = (curDirection + 1) % directions.length;
      continue;
    }
    throw new Error('unreachable 1');
  }
  throw new Error('unreachable 2');
}


const def: PuzzleDefinition = {
  part1: (input, isTest = false): number => {
    let { guard, map } = parseInput(input);
    
    const { visited } = walk1(map, guard, false);
    return visited.size;
  },

  part2: (input, isTest = false): number => {
    let { guard, map } = parseInput(input);

    // re-run part 1 to get all visited spots from the original route
    // it doesn't make sense to place the item anywhere else.
    // remove guard starting position.
    const part1 = walk1(map, guard, false);
    const positions = [...part1.visited.values()]
      .filter((entry) => entry !== `${guard[X]},${guard[Y]}`);

    let lastPositionTried = null;
    return positions.reduce((numCircular, position) => {
      const [x, y] = position.split(',').map(parseFloat);

      // Reset change to the map from previous run
      if (lastPositionTried) {
        map[lastPositionTried[Y]][lastPositionTried[X]] = EMPTY;
      }

      // Add object as a wall and re-run
      map[y][x] = WALL;
      lastPositionTried = [x,y];

      // Count ciruclar routes
      return numCircular + walk2(map, guard);
    }, 0);
  },

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 41,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 5453,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 6,
    inputFile: 'example'
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 2188,
  }]
};

export default def;