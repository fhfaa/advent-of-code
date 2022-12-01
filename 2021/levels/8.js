const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`;
/* */

input = input.split('\n');

// pt.1
// ignore the first part before the delim, then count the substrings that correspond
// with the segment lengths of 1, 4, 7 and 8
const part1 = input.reduce((count, row) => {
    return count + row.
      split(' | ')[1].
      split(' ').
      filter(word => (word.length % 7) < 5).
      length;
  }, 0);

console.log('Part 1: ', part1);


// pt.2
const sortChars = str => str.split('').sort(); // "afbec" => "abcef"
const diff = (a, b) => a.filter(chr => !b.includes(chr)); // get all segments from a not in b
const contains = (a, b) => b.every(chr => a.includes(chr)); // check if a contains all segments of b

const part2 = input.
  map(row => {
    const [src, val] = row.split(' | ').map(s => s.split(' ').map(sortChars));

    // conditions to deduct all numbers based on what we know
    // (number of segments, shared segments between 2 numbers)
    const decoded = [
      [1, a => a.length === 2],
      [4, a => a.length === 4],
      [7, a => a.length === 3],
      [8, a => a.length === 7],
      [3, (a, mapping) => a.length === 5 && contains(a, mapping[1])],
      [6, (a, mapping) => a.length === 6 && !contains(a, mapping[1])],
      [9, (a, mapping) => a.length === 6 && contains(a, mapping[3])],
      [0, (a, mapping) => a.length === 6 && contains(a, mapping[1]) && !contains(a, mapping[4])],
      [5, (a, mapping) => a.length === 5 && contains(a, diff(mapping[4], mapping[1]))],
      [2, () => true] // only one left
    ].reduce((mapping, [num, testFn]) => {
      // Find source val matching condition and remove it from the array
      const foundIdx = src.findIndex(a => testFn(a, mapping));
      const foundArr = src.splice(foundIdx, 1)[0];

      // Map number in both directions (num <=> arr/str)
      mapping[foundArr.join('')] = num;
      mapping[num] = foundArr;

      return mapping;
    }, {});

    // Find deducted numbers for each value, concat and turn into a number
    return +val.map(v => decoded[v.join('')]).join('');
  })

  console.log('Part 2: ', part2.reduce((sum, n) => sum + n, 0));