import { existsSync, readFileSync } from 'fs';
import Logger, { LogType } from './logger';

const SUFFIX_PART2 = '_part2';

export type PuzzleResult = string | number;
export type PuzzleFn = (input: string, isTest: boolean, params?: object) => PuzzleResult;

export interface PuzzleResults {
  part1: PuzzleResult;
  part2: PuzzleResult;
  runtime: {
    part1: number;
    part2: number;
    total: number;
  }
}

export interface PuzzleTest {
  name: string;
  part: 1 | 2;
  expected: PuzzleResult;
  input?: string;
  inputFile?: string;
  params?: any;
}

export interface PuzzleDefinition {
  year?: number,
  day?: number,
  part1: PuzzleFn;
  part2: PuzzleFn;
  tests?: PuzzleTest[];
}

export class Puzzle {
  input1: string;
  input2: string;
  tests: PuzzleTest[] = [];
  def: PuzzleDefinition;

  constructor(def: PuzzleDefinition) {
    this.def = def;
    // Load inputs, e.g. "5.txt" for part 1.
    // If there is no "5_part2.txt" re-use the same input for part 2.
    this.input1 = this.getInput(1);
    this.input2 = existsSync(this.getInputPath(SUFFIX_PART2)) ?
      this.getInput(2) :
      this.input1;
  }


  run(): PuzzleResults {
    const time1 = process.hrtime.bigint();
    const part1 = this.def.part1(this.input1, false);
    const time2 = process.hrtime.bigint();
    const part2 = this.def.part2(this.input2, false);
    const time3 = process.hrtime.bigint();

    return {
      part1, part2, runtime: {
        part1: Number((time2 - time1) / 1_000_000n),
        part2: Number((time3 - time2) / 1_000_000n),
        total: Number((time3 - time1) / 1_000_000n),
      }
    };
  }


  runTests() {
    for (const test of (this.def.tests || [])) {
      try {
        const testInput = this.getTestInput(test);
        const result = test.part === 1 ?
          this.def.part1(testInput, true, test.params) :
          this.def.part2(testInput, true, test.params);

        if (result === test.expected) {
          Logger.success(`Test "${test.name}" OK. Expected ${test.expected}.`);
        } else {
          Logger.failure(`Test "${test.name}" FAILED. Expected ${test.expected}.  Got: ${result}.`);
        }
      } catch (ex: unknown) {
        Logger.error(`Test "${test.name}" ERROR: `, ex);
      }
    }
  }


  private getInputPath(suffix: string = ''): string {
    return `${__dirname}/${this.def.year}/input/${this.def.day}${suffix}.txt`;
  }


  private getInput(which?: 1 | 2 | string): string {
    let suffix = '';

    if (which === 2) {
      if (existsSync(this.getInputPath(SUFFIX_PART2))) {
        suffix = SUFFIX_PART2;
      } else if (this.input1) {
        return this.input1;
      }
    } else if (typeof which === 'string') {
      suffix += '__' + which;
    }

    const input = readFileSync(this.getInputPath(suffix), { encoding: 'utf-8' });
    return input.replace(/\r/g, '');
  }


  private getTestInput(test: PuzzleTest) {
    if (test.input) {
      return test.input.replace(/\r/g, '');

    } else if (test.inputFile) {
      return this.getInput(test.inputFile);
    }
    return test.part === 1 ? this.input1 : this.input2;
  }


  static printResult(which: 1 | 2, solution: string | number, runtime: number) {
    let strSolution = `${solution}`;

    const isTodo = solution === 'TODO';
    if (isTodo) {
      solution = Logger.wrapString(LogType.Failure, 'TODO');
      strSolution = `X  TODO`;
    }


    // Visual multiline solutions start with \n. Account for missing "Part 1: " label
    const strPadBase = strSolution.startsWith('\n') ? 54 : 45;


    const len = strSolution.includes('\n')
      ? Math.max(...strSolution.split('\n').map(line => line.length))
      : strSolution.length;

    let strPadLen = Math.max(5, strPadBase - len);

    let suffix = '';
    if (isTodo) {
      suffix = Logger.wrapString(LogType.Failure, 'TODO');
    } else if (runtime < 100) {
      suffix = Logger.wrapString(LogType.Success, 'Sweet!');
    } else if (runtime > 1500) {
      if (runtime > 5000) {
        suffix = Logger.wrapString(LogType.Failure, 'Oof :(');
      } else {
        suffix = Logger.wrapString(LogType.Failure, 'Slow!');
      }
    }

    const formattedRuntime = `${runtime}`.padStart(strPadLen, ' ') + ' ms ' + suffix;

    console.log(`Part ${which}: `, solution, formattedRuntime);
  }


  static printResults(results: PuzzleResults): void {
    Puzzle.printResult(1, results.part1, results.runtime.part1);
    Puzzle.printResult(2, results.part2, results.runtime.part2);
    console.log('')
  }


  public static puzzleExists(year: number, day: number): boolean {
    return existsSync(`${__dirname}/${year}/${day}.ts`);
  }


  public static async loadAndExec(year: number, day: number, opts: { runTests?: boolean } = {}) {
    if (!Puzzle.puzzleExists(year, day)) {
      console.log('Part 1: ', Logger.wrapString(LogType.Failure, 'TODO - File not found'));
      console.log('Part 2: ', Logger.wrapString(LogType.Failure, 'TODO - File not found\n'));
      return;
    }

    const filename = `${__dirname}/${year}/${day}`;

    const puzzleDef: PuzzleDefinition = (await import(filename)).default;

    const puzzle = new Puzzle({ ...puzzleDef, year, day });

    if (opts.runTests) {
      puzzle.runTests();
    }

    const results = puzzle.run();
    Puzzle.printResults(results);
  }
}