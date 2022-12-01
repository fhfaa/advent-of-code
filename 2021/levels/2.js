const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `forward 5
down 5
forward 8
up 3
down 8
forward 2`;
/* */

input = input.split('\n');

// pt.1
const part1 = input.reduce((ret, cmd) => {
  const [dir, val] = cmd.split(' ');
  switch (dir[0]) {
    case 'f': ret.x += +val; break;
    case 'd': ret.y += +val; break;
    case 'u': ret.y -= +val;
  }
  return ret;
}, {x: 0, y: 0});
console.log('Part 1: ', part1.x * part1.y);


// pt.2
const part2 = input.reduce((ret, cmd) => {
  const [dir, val] = cmd.split(' ');
  switch (dir[0]) {
    case 'f': ret.x += +val; ret.y += ret.aim * +val; break;
    case 'd': ret.aim += +val; break;
    case 'u': ret.aim -= +val;
  }
  return ret;
}, {x: 0, y: 0, aim: 0});
console.log('Part 2: ', part2.x * part2.y);
