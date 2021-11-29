const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/, '');

/*input = `abc

a
b
c

ab
ac

a
a
a
a

b`;*/


// pt.1
const data = input.split('\n\n').
  map(grp => grp.
    replace(/\n/g, '').
    split('').
    sort().
    filter((e, i, a) => !i || e !== a[i - 1]).length
  ).
  reduce((a, b) => a + b);

console.log('Part 1: ', data);


// pt.2
const data2 = input.split('\n\n').
  map(groups => {
    groups = groups.split(/\n/g).map(p => p.split('').sort());

    return groups.length === 1 ?
      groups[0].length :
      groups[0].filter(c => groups.slice(1).every(g => g.includes(c))).length;
  }).
  reduce((a, b) => a + b);

console.log('Part 2: ', data2);