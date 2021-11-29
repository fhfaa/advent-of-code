const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/, '');

/* *
input = `light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`;
/* */

/* *
input = `shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`
/* */

// pt.1
const data = input.split('\n').
  reduce((ret, row) => {
    let [outer, inner] = row.replace(/ bags?|\.|\d+ /g, '').split(' contain ');
    ret[outer] = inner.split(', ').
      map(s => s === 'no other' ? 0 : (s === 'shiny gold' ? 1 : s));
    return ret;
  }, {});


while (Object.keys(data).filter(outer => {
  const inner = data[outer];

  // Fully resolved - no changes
  if (typeof inner === 'number') {
    return false;
  }

  // Resolve strings - changes
  if (inner.some(s => typeof s === 'string')) {
    inner.forEach((e, i, a) => {
      if (typeof data[e] === 'number') {
        a[i] = data[e];
      }
    });

  // Merge booleans - changes
  } else {
    data[outer] = inner.reduce((a, b) => a | b);
  }
  return true;
}).length > 0) {}

console.log('Part 1: ', Object.values(data).filter(Boolean).length);


// pt.2
const data2 = input.split('\n').
  reduce((ret, row) => {
    let [outer, inner] = row.replace(/ bags?|\./g, '').split(' contain ');
    ret[outer.replace(/\d+ /, '')] = inner === 'no other' ? 1 : inner.split(', ').map(s => s.split(/(?<=\d+) /));
    return ret;
  }, {});

  while (Object.keys(data2).filter(outer => {
    const inner = data2[outer];
  
    // Fully resolved - no changes
    if (typeof inner === 'number') {
      return false;
    }
  
    // Resolve strings - changes
    inner.forEach((tuple, i, a) => {
      if (typeof tuple !== 'number') {
        const [num, name] = tuple;
        if (typeof data2[name] === 'number') {
          a[i] = data2[name] * +num;
        }
      }
    });
  
    // Merge booleans - changes
    if (inner.every(e => typeof e === 'number')) {
      data2[outer] = inner.reduce((a, b) => a + b) + 1;
    }
    return true;
  }).length > 0) {}

  console.log('Part 2: ', data2['shiny gold'] - 1)