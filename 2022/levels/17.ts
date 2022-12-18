import { Puzzle } from "../../puzzle";

const SHAPES = [{
  // ####

  // .#.
  // ###
  // .#.


  // ..#
  // ..#
  // ###

  // #
  // #
  // #
  // #

  // ##
  // ##
}]

export const P = new Puzzle({
  year: 2022,
  day: 17,


  part1: (input: string, isTest: boolean) => {
    if (!isTest) { return 'WIP'; }
    return 'TODO';
  },


  part2: (input: string, isTest: boolean) => {
    if (!isTest) { return 'TODO'; }
    return 'TODO';
  },


  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 3068,
    inputFile: 'example',
  }, /* *{
    name: 'Part 2 example',
    part: 2,
    expected: 45000,
    inputFile: 'example'
  }/* */]
});
