import { Puzzle } from "./puzzle";

const { spawnSync } = require('child_process');
const { existsSync } = require('fs');

const years = [2019, 2020, 2021, 2022, 2023, 2024];


async function runDay(year: number, day: number, runTests = false) {
  // Legacy JS / until 2021
  if (year < 2022) {
      const file = `./${year}/levels/${day}.js`
      if (existsSync(file)) {
        console.log(` -- Level ${day} -- `);
        const out = String(spawnSync('node', [file], {cwd: __dirname + '/../'}).output.slice(1, -1));
        console.log(out);
      }

  // New TS / from 2022
  } else {
    if (Puzzle.puzzleExists(year, day)) {
      console.log(` -- Level ${day} -- `);
      await Puzzle.loadAndExec(year, day, { runTests });
    }
  }
}


async function runYear(year: number): Promise<void> {
  console.log(`\n--------------\n--   ${year}   --\n--------------\n`);
  for (let day = 1; day <= 25; day++) {
    await runDay(year, day);
  }
}


(async function runAll() {
  let yearArg = +process.argv[2] || 0;
  if (!yearArg || !years.includes(yearArg)) {
    yearArg = 0;
  }
  let dayArg = +process.argv[3] || 0;
  if (!dayArg || !(dayArg >= 1 && dayArg <= 25)) {
    dayArg = 0;
  }

  // Run one day (use with nodemon for dev work: npm run day <year> <day>)
  if (yearArg && dayArg) {
    console.log(`\n-- ONE DAY: ${yearArg} ${dayArg} --\n`);
    runDay(yearArg, dayArg, true);
    return;
  }

  // Run ONE year from CLI args (npm run all <year>)
  if (years.includes(yearArg)) {
    await runYear(yearArg);
    return;
  }

  // Otherwise run ALL years (npm run all)
  for (const year of years) {
    await runYear(year);
  }
}()).catch(ex => console.error('FATAL ERROR: ', ex));