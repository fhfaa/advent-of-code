import { Puzzle } from "./puzzle";

const { spawnSync } = require('child_process');
const { existsSync } = require('fs');

const years = [2019, 2020, 2021, 2022];

async function runYear(year: number): Promise<void> {
  console.log(`\n--------------\n--   ${year}   --\n--------------\n`);

  // Legacy JS / until 2021
  if (year < 2022) {
    for (let day = 1; day <= 25; day++) {
      const file = `./${year}/levels/${day}.js`

      if (existsSync(file)) {
        console.log(` -- Level ${day} -- `);
        const out = String(spawnSync('node', [file], {cwd: __dirname}).output.slice(1, -1));
        console.log(out);
      }
    };

  // New TS / from 2022
  } else {
    for (let day = 1; day <= 25; day++) {

      if (Puzzle.puzzleExists(year, day)) {
        console.log(` -- Level ${day} -- `);
        await Puzzle.loadAndExec(year, day, { runTests: false });
      }
    }
  }
}

async function runAll() {
  for (const year of years) {
    await runYear(year);
  }

}
runAll().catch(ex => console.error('FATAL ERROR: ', ex));