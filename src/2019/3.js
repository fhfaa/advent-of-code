const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/input/${lvl}.txt`, 'utf8').replace(/\r/g, '');
let expected = '14746';

/* 410 *
input = `R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`;
expected = 410;
/* */

/* 610 *
input = `R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83`;
expected = 610;
/* */

/* *
input = `R8,U5,L5,D3
U7,R6,D4,L4`;
expected = 30;
/* */

const cables = input.split('\n').map(s => {
  return s.split(',').
    reduce((o, e) => {
      let xOld = o.x, yOld = o.y;
      const val = +e.substr(1);

      switch (e[0]) {
        case 'U':
          o.y -= val;
          o.lines.push({hv: 'v', a: o.y, b: yOld + 1, lwr: 0, dir: e[0], lineLen: val, where: xOld});
          break;
        case 'D':
          o.y += val;
          o.lines.push({hv: 'v', a: yOld + 1, b: o.y, lwr: 1, dir: e[0], lineLen: val, where: xOld});
          break;
        case 'L':
          o.x -= val;
          o.lines.push({hv: 'h', a: o.x, b: xOld + 1, lwr: 0, dir: e[0], lineLen: val, where: yOld});
          break;
        case 'R':
          o.x += val;
          o.lines.push({hv: 'h', a: xOld + 1, b: o.x, lwr: 1, dir: e[0], lineLen: val, where: yOld});
      }
      return o;
    }, {x: 0, y: 0, lines: []});
}).map(e => e.lines);

const intersections = cables[0].reduce((ret, l1) => {
  cables[1].
    filter(l2 => l1.hv !== l2.hv).
    filter(l2 => l1.a <= l2.where && l2.where <= l1.b && l2.a <= l1.where && l1.where <= l2.b).
    forEach(l2 => {
      const x = l1.hv === 'h' ? l2.where : l1.where;
      const y = l1.hv === 'h' ? l1.where : l2.where;
      // console.log('Found intersection: ', x, y);
      ret.push([x,y]);
    });
  return ret;
}, []);


// pt.1
const part1 = Math.min(...intersections.map(p => Math.abs(p[0]) + Math.abs(p[1])));
console.log('Part 1: ', part1);


// pt.2
function getLinePos(lines, pos) {
  let len = 0;
  const [x, y] = pos;

  lines.some(l => {
    const horiz = l.hv === 'h';
    if (
      (horiz && l.where === y && l.a <= x && x <= l.b) || 
      (!horiz && l.where === x && l.a <= y && y <= l.b)) { 
      
      const z = horiz ? x : y;
      len += l.lwr ? z - l.a + 1: l.b - z - 1;
      return true;
    }
    len += l.lineLen;
    return false;
  })
  return len;
}

const part2 = intersections.map(inter => {
  const val1 = getLinePos(cables[0], inter);
  const val2 = getLinePos(cables[1], inter);
  const total = val1 + val2;
  return total;
}).sort((a,b) => a-b);

console.log('Part 2: ', part2[0]);

// After hours of off-by-one-or-so errors I give up.
// Super ugly solution, but it works I guess.
