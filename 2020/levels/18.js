
const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8');

const parensRe = /\(([^())]+)\)/g;


// pt.1
// We haven't had any recursion yet...
function solve1(s) {
  while (s.indexOf('(') > -1) {
    s = s.replace(parensRe, (s) => '' + solve1(s.substring(1, s.length - 1)));
  }

  let op; // drempels
  return s.split(' ').reduce((prev, next)=> {
    // if special char (+/*), remember it and continue
    if (next.charCodeAt(0) < 48) {
      op = next;
      return prev;
    }
    return op === '+' ? +prev + +next : +prev * +next;
  });
}
const part1 = input.split('\n').reduce((sum, s) => sum + solve1(s), 0);
console.log('Part 1: ', part1);


// pt.2
// Might as well go all-in with recursion AND eval
function solve2(s) {
  while (s.indexOf('(') > -1) {
    s = s.replace(parensRe, (s) => '' + solve2(s.substring(1, s.length - 1)));
  }
  // Only numbers left, solve additions
  while(s.indexOf('+') > -1) {
    s = s.replace(/\b(\d+ \+ \d+)\b/g, s => eval(s));
  }
  // Then just eval the multiplications (or single value)
  return eval(s);
}

const part2 = input.split('\n').reduce((sum, s) => sum + solve2(s), 0);
console.log('Part 2: ', part2);