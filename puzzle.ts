import { existsSync, readFileSync } from 'fs';

const SUFFIX_PART2 = '_part2';

export type PuzzleResult = string | number;
export type PuzzleFn = (input: string) => PuzzleResult;

export interface PuzzleResults {
  part1: PuzzleResult;
  part2: PuzzleResult;
  runtime?: number | bigint;
}

export interface PuzzleTest {
  name: string;
  part: 1 | 2;
  expected: PuzzleResult;
  input?: string;
  inputFile?: string;
}

export interface PuzzleDefinition {
  year: number,
  day: number,
  part1: PuzzleFn;
  part2: PuzzleFn;
  tests?: PuzzleTest[];
}

export class Puzzle {
  input1: string;
  input2: string;
  tests: PuzzleTest[] = [];

  constructor(private def: PuzzleDefinition) {
    // Load inputs, e.g. "5.txt" for part 1.
    // If there is no "5_part2.txt" re-use the same input for part 2.
    this.input1 = this.getInput(1);
    this.input2 = existsSync(this.getInputPath(SUFFIX_PART2)) ? 
      this.getInput(2) :
      this.input1;
  }


  run(): PuzzleResults {
    const startTime = process.hrtime.bigint();

    const part1 = this.def.part1(this.input1);
    const part2 = this.def.part2(this.input2);

    const runtime = process.hrtime.bigint() - startTime;
    return { part1, part2, runtime }
  }


  runTests() {
    for (const test of (this.def.tests || [])) {
      try {
        const testInput = this.getTestInput(test);
        const result = test.part === 1 ? this.def.part1(testInput) : this.def.part2(testInput);

        if (result === test.expected) {
          console.log(`✔️ Test "${test.name}" OK. Expected ${test.expected}.`);
        } else {
          console.log(`❌ Test "${test.name}" FAILED. Expected ${test.expected}.  Got: ${result}`);
        }
      } catch (ex: unknown) {
        console.error(`☠️ Test "${test.name}" ERROR: `, ex);
      }
    }
  }


  private getInputPath(suffix: string = ''): string {
    return `${__dirname}/../${this.def.year}/input/${this.def.day}${suffix}.txt`;
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
      return this.getInput(test.inputFile as string);
    }
    return test.part  === 1 ? this.input1 : this.input2;
  }


  public static puzzleExists(year: number, day: number): boolean {
    return existsSync(`${__dirname}/${year}/levels/${day}.js`);
  }


  public static async loadAndExec(year: number, day: number, opts: { runTests?: boolean } = {}): Promise<PuzzleResult> {
    const filename = __dirname + `/${year}/levels/${day}`;
    
    const puzzle = (await import(filename)).P;
    if (opts.runTests) {
      puzzle.runTests();
    }
    
    const results = puzzle.run();
    console.log('Part 1: ', results.part1);
    console.log('Part 2: ', results.part2);
    console.log('');
    return results;
  }
}