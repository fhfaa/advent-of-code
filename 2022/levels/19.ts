import { Puzzle } from "../../puzzle";

type Blueprint = {
  ore_ore: number;
  clay_ore: number;
  obs_ore: number;
  obs_clay: number;
  geode_ore: number;
  geode_obs: number;
}
type Materials = {
  ore: number;
  clay: number;
  obsidian: number;
  geode: number;
}
type Snapshot = {
  mats: Materials;
  bots: Materials;
  minute: number;
}
type Material = 'ore' | 'clay' | 'obsidian' | 'geode';
const MAT_NAMES: Material[] = ['ore', 'clay', 'obsidian', 'geode'];

type Bots2 = {
  ore: number;
  clay: number;
  obsidian: number;
}
type Snapshot2 = {
  mats: Materials;
  bots: Bots2;
  minutesLeft: number;
}

/* ************************************************************************* */

function parseBlueprints(input: string): Blueprint[] {
  const fields = [
    'ore_ore', 'clay_ore', 'obs_ore',
    'obs_clay', 'geode_ore', 'geode_obs'
  ];

  return input.
    split('\n').
    map(line => line.
      replace(/^[^:]+?:\D+/, '').
      replace(/\D+$/, '').
      split(/\D+/).
      reduce((costs: Blueprint, num: string, idx: number, arr) => {
        costs[fields[idx]] = +num;
        return costs;
      }, {} as Partial<Blueprint>) as Blueprint
    ) as Blueprint[];
}

function clone(sim: Snapshot) {
  return {
    mats: { ...sim.mats },
    bots: { ...sim.bots },
    minute: sim.minute,
  }
}

function hashSLOW(sim: Snapshot) {
  return `${sim.minute},` +
    `${sim.bots.ore},${sim.bots.clay},${sim.bots.obsidian},${sim.bots.geode},` +
    `${sim.mats.ore},${sim.mats.clay},${sim.mats.obsidian},${sim.mats.geode}`;
}


function solveSLOW(blueprints: Blueprint[], MAX_MINUTES: number) {
  return blueprints.map((costs: Blueprint) => {
    let maxGeodes = 0;

    // Maximum ore cost of all other bots
    const maxOreNeeded = Math.max(costs.clay_ore, costs.obs_ore, costs.geode_ore);

    const queue: Snapshot[] = [{
      bots: { ore: 1, clay: 0, obsidian: 0, geode: 0 },
      mats: { ore: 0, clay: 0, obsidian: 0, geode: 0 },
      minute: 0
    }];

    const states: any = {};

    while (queue.length) {
      const sim = queue.pop();

      sim.minute++;

      if ((states[hashSLOW(sim)] ?? 69) <= sim.minute) {
        continue;
      }
      states[hashSLOW(sim)] = sim.minute;

      // See what we can build (unless we're in the last minute)
      // Since we can only build one bot per minute, we don't need
      // more X-Bots than the max X-cost of the others bots.
      // e.g. geode costs 4 ore, obsidian 5, clay 2: we only need 5 ore bots
      let canBuild = [];
      if (sim.minute < MAX_MINUTES) {
        if (
          sim.mats.ore >= costs.geode_ore &&
          sim.mats.obsidian >= costs.geode_obs) {
          canBuild.push('geode');

        } else {
          if (
            sim.mats.ore >= costs.obs_ore &&
            sim.mats.clay >= costs.obs_clay &&
            sim.bots.obsidian < costs.geode_obs) {
            canBuild.push('obsidian');

          }
          if (
            sim.mats.ore >= costs.clay_ore &&
            sim.bots.clay < costs.obs_clay) {
            canBuild.push('clay');

          }
          if (
            sim.mats.ore >= costs.ore_ore &&
            sim.bots.ore < maxOreNeeded) {
            canBuild.push('ore');
          }
        }
      }

      // Farm materials
      for (let matName of MAT_NAMES) {
        sim.mats[matName] += sim.bots[matName];
      }

      // Finish simulation if we're in the last minute. Check geode score
      if (sim.minute === MAX_MINUTES) {
        if (sim.mats.geode > maxGeodes) {
          maxGeodes = sim.mats.geode;
        }
        continue;
      }

      // Branch off an alternative simulation with all possible things we can build
      if (canBuild.length) {
        for (const building of canBuild) {
          const tmp = clone(sim);
          if (building === 'geode') {
            tmp.mats.obsidian -= costs.geode_obs;
            tmp.mats.ore -= costs.geode_ore;
            tmp.bots.geode += 1;
          } else if (building === 'obsidian') {
            tmp.mats.clay -= costs.obs_clay;
            tmp.mats.ore -= costs.obs_ore;
            tmp.bots.obsidian += 1;
          } else if (building === 'clay') {
            tmp.mats.ore -= costs.clay_ore;
            tmp.bots.clay += 1;
          } else if (building === 'ore') {
            tmp.mats.ore -= costs.ore_ore;
            tmp.bots.ore += 1;
          }
          queue.push(tmp);
        }
      }
      // Also try doing nothing and waiting. BUT:
      // Ore is needed for everything. If we have a lot of ore,
      // doing nothing is probably not the best path (HUGE time saver)
      if (sim.mats.ore < maxOreNeeded * 2) {
        queue.push(sim);
      }
    }

    return maxGeodes;
  });
}

/* ************************************************************************* */

const solve = (blueprints: Blueprint[], MAX_MINUTES: number) => {
  // Prepare factorials of 0..MAX_MINUTES for abort condition
  const factorials: {[key: string]: number} = new Array(MAX_MINUTES).fill(0).
    reduce((memo, _, idx) => {
      memo[idx + 2] = memo[idx + 1] * (idx + 2);
      return memo;
    }, {0: 1, 1: 1});

  return blueprints.map(blueprint => {
    let maxGeodes = 0;
    
    const maxOreNeeded = Math.max(
      blueprint.ore_ore,
      blueprint.clay_ore,
      blueprint.obs_ore,
      blueprint.geode_ore
    );

    const queue: Snapshot2[] = [{
      minutesLeft: MAX_MINUTES,
      bots: { ore: 1, clay: 0, obsidian: 0 },
      mats: { ore: 0, clay: 0, obsidian: 0, geode: 0 }
    }];

    while (queue.length) {
      const { minutesLeft, bots, mats: { ore, clay, obsidian, geode }} = queue.pop();

      if (geode > maxGeodes) {
        maxGeodes = geode;
      }
      if (minutesLeft <= 0) {
        continue;
      } 
      // factorial(minutesLeft - 1) is the number of geodes we could gain if we built a geode 
      // bot every minute from now until the end. If we're that far from the record, abort,
      // because we won't get anywhere with this snapshot.
      if (maxGeodes - geode > factorials[minutesLeft - 1]) {
        continue;
      }

      
      // Check when we can build the next geode bot (if we have a obsidian bot)
      if (bots.obsidian > 0) {
        const readyNow = blueprint.geode_ore <= ore && blueprint.geode_obs <= obsidian;
        const duration = readyNow ? 1 : 1 + Math.max(
          Math.ceil((blueprint.geode_ore - ore) / bots.ore),
          Math.ceil((blueprint.geode_obs - obsidian) / bots.obsidian)
        );
        const newTimeLeft = minutesLeft - duration;

        queue.push({
          minutesLeft: newTimeLeft,
          bots: {...bots},
          mats: {
            ore: ore + (duration * bots.ore) - blueprint.geode_ore,
            clay: clay + (duration * bots.clay),
            obsidian: obsidian + (duration * bots.obsidian) - blueprint.geode_obs,
            geode: geode + newTimeLeft
          }
        });

        // Building a geode bot is the best possible move. Don't bother with the rest.
        if (readyNow) {
          continue;
        }
      }

      // Check when we can build the next obsidian bot (if we have a clay bot)
      if (bots.clay > 0) {
        const readyNow = blueprint.obs_ore <= ore && blueprint.obs_clay <= clay;
        const duration = readyNow ? 1 : 1 + Math.max(
          Math.ceil((blueprint.obs_ore - ore) / bots.ore),
          Math.ceil((blueprint.obs_clay - clay) / bots.clay)
        );
        const newTimeLeft = minutesLeft - duration;

        // Only makes sense if we can build geode bot afterwards (+1 step)
        if (newTimeLeft > 2) {
          queue.push({
            minutesLeft: newTimeLeft,
            bots: {...bots, ...{obsidian: bots.obsidian + 1}},
            mats: {
              ore: ore + (duration * bots.ore) - blueprint.obs_ore,
              clay: clay + (duration * bots.clay) - blueprint.obs_clay,
              obsidian: obsidian + (duration * bots.obsidian),
              geode
            }
          });
        }
      }

      // Check when we can build the next clay bot (if it makes sense to)
      if (bots.clay < blueprint.obs_clay) {
        const readyNow = blueprint.clay_ore <= ore;
        const duration = readyNow ? 1 : 1 + Math.ceil((blueprint.clay_ore - ore) / bots.ore);
        const newTimeLeft = minutesLeft - duration;

        // Only makes sense if we can build obsidian + geode bots afterwards (+2 steps)
        if (newTimeLeft > 3) {
          queue.push({
            minutesLeft: newTimeLeft,
            bots: {...bots, ...{clay: bots.clay + 1}},
            mats: {
              ore: ore + (duration * bots.ore) - blueprint.clay_ore,
              clay: clay + (duration * bots.clay),
              obsidian: obsidian + (duration * bots.obsidian),
              geode
            }
          });
        }
      }

      // Check when we can build the next ore bot (if it makes sense to)
      if (bots.ore < maxOreNeeded) {
        const readyNow = blueprint.ore_ore <= ore;
        const duration = readyNow ? 1 : 1 + Math.ceil((blueprint.ore_ore - ore) / bots.ore);
        const newTimeLeft = minutesLeft - duration;

        // Only makes sense if we can build obsidian + geode bots afterwards (+2 steps)
        if (newTimeLeft > 3) {
          queue.push({
            minutesLeft: newTimeLeft,
            bots: {...bots, ...{ore: bots.ore + 1}},
            mats: {
              ore: ore + (duration * bots.ore) - blueprint.ore_ore,
              clay: clay + (duration * bots.clay),
              obsidian: obsidian + (duration * bots.obsidian),
              geode
            }
          });
        }
      }
    };
    
    return maxGeodes;
  });
};


/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */


export const P = new Puzzle({
  year: 2022,
  day: 19,

  /* ************************************************************************* */

  part1: (input: string, isTest: boolean) => {
    const blueprints = parseBlueprints(input);
    const scores: number[] = solve(blueprints, 24);
    return scores.reduce((a, b, idx) => a + b * (idx + 1), 0);
  },

  /* ************************************************************************* */

  part2: (input: string, isTest: boolean) => {
    const blueprints = parseBlueprints(input);
    const scores: number[] = solve(blueprints.slice(0, 3), 32);
    return scores.reduce((a, b) => a * b, 1);
  },

  /* ************************************************************************* */

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 33,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 1565,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 56 * 62,
    inputFile: 'example'
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 10672,
  }]
});
