const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`;
// --- 10, 36
/* */

/* *
input = `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`;
// --- 19, 103
/* */

/* *
input = `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`;
// --- 226, 3509
/* */

// Map paths in both directions: "a-b" --> {a: ["b"], b: ["a"]}
paths = input.split('\n').reduce((data, s) => {
  let [from, to] = s.split('-');

  data[from] = [...(data[from] || []), to];
  data[to] = [...(data[to] || []), from];
  return data;
}, {});


// The route starts with an empty segment, to enable easy searching for `,${from},${to}` later on
function navigate(smallCavesOnce, route = ['', 'start'], solutions = {}, smallVisitedTwice = false) {
  const current = route[route.length - 1];
  let waysToEnd = 0;

  for (let next of paths[current]) {

    if (next === 'end') {
      const joined = route.join(',') + ',' + next;
      if (!solutions[joined]) {
        // console.log('Found unique route to end: ' + route.join(',') + ',' + next);
        solutions[joined] = 1;
        waysToEnd += 1;
      }
      continue;
    }

    // Can't go back to start
    if (next === 'start') {
      continue;
    }
    
    const nextCaveIsSmall = next.toLowerCase() === next;

    // Part 1:
    // Small caves can only be visited once
    if (smallCavesOnce) {
      // We've been to this small cave before -- abort
      if (nextCaveIsSmall && route.indexOf(next) > -1) {
        continue;
      }

      // We've walked from CUR to NEXT before -- abort
      if (route.join(',').indexOf(`,${current},${next}`) > -1) {
        continue;
      }


    // Part 2:
    // One small cave can be visited twice
    } else {
      // We've been to this small cave before - BUT we are allowed to visit ONE small cave twice.
      // IF we haven't yet, skip the recursion at the bottom and recurse by ourselves, but with a
      // marker that indicates that we've used up our '1x small cave twice' for this route.
      if (nextCaveIsSmall && route.indexOf(next) > -1) {
        if (!smallVisitedTwice) {
          waysToEnd += navigate(false, [...route, next], solutions, true);
        }
        continue;
      }

      // We've walked from CUR to NEXT before, twice
      // Once is ok, because we might be visiting the same small cave in a dead end 2x
      const joined = route.join(',');
      const search = `,${current},${next}`;
      idx = joined.indexOf(search);
      if (idx > -1 && joined.indexOf(search, idx + 1) > -1) {
        continue;
      }
    }

    // Found valid path to continue walking. Continue with updated route
    waysToEnd += navigate(smallCavesOnce, [...route, next], solutions, smallVisitedTwice);
  }
  return waysToEnd;
}


// pt.1
const part1 = navigate(true);
console.log('Part 1: ', part1);


// pt.2
const part2 = navigate(false);
console.log('Part 2: ', part2);