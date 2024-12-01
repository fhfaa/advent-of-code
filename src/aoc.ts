import { Puzzle } from "./puzzle";

const { spawnSync } = require('child_process');
const fs = require('fs');

type Args = {
  year: number;
  day: number;
};

class AOC {
  YEARS = [2019, 2020, 2021, 2022, 2023, 2024];
  JS_YEARS = [2019, 2020, 2021];

  // Run the puzzle for a specific day
  private async runDay(year: number, day: number, runTests = false) {

    // Legacy: JS, until 2021
    // Spawn a new NodeJS process to run it. Forward stdout to console.log
    if (this.JS_YEARS.includes(year)) {
      const file = __dirname + `/${year}/${day}.js`
      if (fs.existsSync(file)) {
        console.log(` -- Level ${day} -- `);
        const out = String(spawnSync('node', [file], { cwd: __dirname + '/' }).output.slice(1, -1));
        console.log(out);
      }

      // TypeScript
    } else {
      console.log(` -- Level ${day} -- `);
      await Puzzle.loadAndExec(year, day, { runTests });
    }
  }

  private findHighestLevel(year: number): number {
    return fs
      .readdirSync(`${__dirname}/${year}`)
      .map((name) => /^\d\d?\.(t|j)s$/.test(name)
        ? +name.replace(/\D/g, '')
        : 0
      )
      .filter((num) => num && num >= 0 && num <= 25)
      .sort((a, b) => a > b ? -1 : 1)
      .shift();
  }

  private async runYear(year: number): Promise<void> {
    const highestLevel = this.findHighestLevel(year);

    console.log(`\n--------------\n--   ${year}   --\n--------------\n`);
    for (let day = 1; day <= highestLevel; day++) {
      await this.runDay(year, day);
    }
  }

  private parseArgs(argv: string[]): Args {
    let yearArg = +argv[2] || 0;
    let dayArg = +argv[3] || 0;

    return {
      year: this.YEARS.includes(yearArg) ? yearArg : 0,
      day: dayArg && dayArg >= 1 && dayArg <= 25 ? dayArg : 0,
    }
  }

  public async run() {
    try {
      const args = this.parseArgs(process.argv);
      if (args.year) {
        if (args.day) {
          // Run one day
          console.log(`\n-- ONE DAY: ${args.year} ${args.day} --\n`);
          this.runDay(args.year, args.day, true);


        } else {
          // Run one full year
          await this.runYear(args.year);
        }
        return;
      }

      // Run ALL years
      for (const year of this.YEARS) {
        await this.runYear(year);
      }
    } catch (ex: unknown) {
      console.error('FATAL ERROR: ', ex);
    }
  }
}

new AOC().run();