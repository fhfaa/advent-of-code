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
type Material = 'ore' | 'clay' | 'obsidian'  | 'geode';

const MAT_NAMES: Material[] = ['ore', 'clay', 'obsidian', 'geode'];

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
    mats: {...sim.mats},
    bots: {...sim.bots},
    minute: sim.minute,
  }
}

function hash(sim: Snapshot) {
  return `${sim.minute},` +
    `${sim.bots.ore},${sim.bots.clay},${sim.bots.obsidian},${sim.bots.geode},` +
    `${sim.mats.ore},${sim.mats.clay},${sim.mats.obsidian},${sim.mats.geode}`;
}

function solve(blueprints: Blueprint[], MAX_MINUTES: number) {
  return blueprints.map((costs: Blueprint) => {
    let maxGeodes = 0;

    // Maximum ore cost of all other robots
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

      if ((states[hash(sim)] ?? 69) <= sim.minute) {
        continue;
      }
      states[hash(sim)] = sim.minute;

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
