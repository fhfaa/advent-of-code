import { Puzzle } from "../../puzzle";

type ValveName = string;
type ValveMap = { [key: string]: Valve };
type NumMap = { [key: string]: number };
type Valve = {
  name: ValveName;
  flow: number;
  next: string[];
}
type State = {
  position: ValveName;
  elapsed: number;
  visited: ValveName[];
  total: number;
  scores?: [];
}

export const P = new Puzzle({
  year: 2022,
  day: 16,


  part1: (input: string, isTest: boolean) => {
    const START = 'AA';
    const MAXTIME = 30;
    
    let nonZeroValves: Valve[] = [];
    const distances: NumMap = {};

    let valves: ValveMap = input.split('\n').reduce((valves: {[key: string]: Valve}, line: string) => {
      const match = line.match(/^Valve (\w+?) has.*?=(\d+?);.*?valves? (\w+?(?:, \w+?)*)$/);
      const thisValve = {
        name: match[1],
        flow: +match[2],
        next: match[3].split(', '),
      } as Valve;
      if (thisValve.flow > 0) {
        nonZeroValves.push(thisValve);
      }
      valves[thisValve.name] = thisValve;
      return valves;
    }, {} as ValveMap);

    // When recording the distances between two valves, sort them so
    // we only have to keep the mappingg one way round.
    const distKey = (v1: Valve, v2: Valve): string => {
      return v1.name < v2.name ? `${v1.name},${v2.name}` : `${v2.name},${v1.name}`;
    }

    // Naive approach:
    // Check all points that FROM can reach. See if TO is among them.
    // If not, take all unique unvisited spots you can visit from each of those.
    // Repeat until found.
    const findDistance = (from: Valve, to: Valve): number => {
      const checked: NumMap = {};
      checked[from.name] = 1;
      let queue: string[] = [from.name];

      for (let i = 0; queue.length > 0; i++) {
        let nextQueue: string[] = [];
        for (let nameFromQueue of queue) {
          checked[nameFromQueue] = 1;
          if (nameFromQueue === to.name) {
            return i;
          } 
          for (let candidate of valves[nameFromQueue].next) {
            if (!checked[candidate]) {
              nextQueue.push(candidate);
            }
          }
          nextQueue.push(...valves[nameFromQueue].next.filter(nx => !checked[nx]));
        }
        queue = nextQueue;
      }
    };

    // For each of the relevant valves (flow > 0), check the distance to each
    // of the other relevant valves. Also check from the start.
    const relevantValves = [...nonZeroValves, valves[START]];
    for (let i = 1; i < relevantValves.length; i++) {
      for (let j = 0; j < i; j++) {
        const key = distKey(relevantValves[i], relevantValves[j]);
        distances[key] = findDistance(relevantValves[i], relevantValves[j]);
      }
    }

    // Compile a new map of relevant valves only (not strictly necessary)
    // and update the list of next valves that can be reached from there.
    valves = relevantValves.reduce((ret, nextV) => {
      nextV.next = nonZeroValves.filter(nzv => nzv.name !== nextV.name).map(nzv => nzv.name);
      ret[nextV.name] = nextV;
      return ret;
    }, {} as ValveMap);

    const stack: State[] = [{
      position: START,
      elapsed: 0,
      visited: [],
      total: 0,
    }];

    let mostReleased = 0;

    while (stack.length) {
      let state = stack.at(-1);

      // Time's up. Check final score and stop this run.
      if (state.elapsed >= MAXTIME) {
        stack.pop();
        if (state.total > mostReleased) {
          mostReleased = state.total;
        }
        continue;
      }
      const curValve = valves[state.position];

      // For each nextValve we can reach from here
      for (let nextName of curValve.next) {
        // Check if we've been there before
        if (!state.visited.includes(nextName)) {
          const nextValve = valves[nextName];

          // Check if we can reach it in time
          const dist = distances[distKey(curValve, nextValve)];

          // If yes, calculate the score from now to the end (flow * timeleft)
          if (MAXTIME >= state.elapsed + dist + 1) {
            const newElapsed = state.elapsed + dist + 1;
            const newScore = (MAXTIME - newElapsed) * nextValve.flow;

            // Add new items to the queue for each possible next valve from there,
            // that we haven't opened before
            stack.push({
              position: nextName,
              elapsed: newElapsed,
              total: state.total + newScore,
              visited: [...state.visited, state.position]
            });
          }
        }
      }
      
      // Pretend we don't do anything else for the 30min 
      // to check if the current score is a new record.
      state.elapsed = MAXTIME;
    }
    return mostReleased;
  },


  part2: (input: string, isTest: boolean) => {
    if (!isTest) { return 'WIP'; }

    const START = 'AA';
    const MAXTIME = 26

    return 'TODO';
  },


  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 1651,
    inputFile: 'example',
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 1707,
    inputFile: 'example'
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 1767,
  },/* {
    name: 'Part 2 my input',
    part: 2,
    expected: 'WIP',
  }*/]
});
