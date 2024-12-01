const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `[1,2]
[[1,2],3]
[9,[8,7]]
[[1,9],[8,5]]
[[[[1,2],[3,4]],[[5,6],[7,8]]],9]
[[[9,[3,8]],[[0,9],6]],[[[3,7],[4,9]],3]]
[[[[1,3],[5,3]],[[1,3],[8,7]]],[[[4,9],[6,9]],[[8,2],[7,3]]]]`;
/* */

/* *
input = `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
[7,[5,[[3,8],[1,4]]]]
[[2,[2,2]],[8,[8,1]]]
[2,9]
[1,[[[9,3],9],[[9,0],[0,7]]]]
[[[5,[7,4]],7],1]
[[[[4,2],2],6],[8,7]]`;
/* */

/* *
input = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`;
/* */


// Creates a number node from a number
function num2leaf(val, parent = null) {
  return { val, parent, num: true };
}


// Creates a pair node from an array
function array2pair([left, right], parent = null) {
  const pair = { l: null, r: null, parent, pair: true };
  pair.l = typeof left  === 'number' ? num2leaf(left,  pair) : array2pair(left,  pair);
  pair.r = typeof right === 'number' ? num2leaf(right, pair) : array2pair(right, pair);
  return pair;
}


// Prints a pair and its contents as a formatted string, similar to puzzle input
function print({l, r}) {
  const left  = l.num ? l.val : print(l);
  const right = r.num ? r.val : print(r);
  return `[${left},${right}]`;
}


// Replaces a childNode (left or right) within a pair parentNode with a new 
// childNode and fixes the links between parent and children
function replaceNode(oldChild, newChild) {
  newChild.parent = oldChild.parent;
  oldChild.parent = null;

  if (newChild.parent.l === oldChild) {
    newChild.parent.l = newChild;
  } else if (newChild.parent.r === oldChild) {
    newChild.parent.r = newChild;
  }
}


// Finds the next (or previous) number node in the "tree" and adds part
// of the value from an explosion to it.
// The same logic works both ways, so we can just use the "l" instead 
// of  "r" node when traversing backwards, and vice versa.
function explodeVal(startNode, val, left) {
  let node = startNode;
  const [l, r] = left ? ['r', 'l'] : ['l', 'r'];

  do {
    if (node.pair && startNode !== node) {
      node = node[l];
      continue;
    }

    while (node.parent && node.parent[l] !== node) {
      node = node.parent;
    }
    if (node.parent && node.parent[r]) {
      node = node.parent[r];
      continue;
    }
    break;

  } while (node && !node.num);
  
  if (node) {
    node.val += val;
  }
}


// Walk the "tree" and see if any pair node needs to be exploded.
// If so, explode and abort. Return true to denote that something was done. 
function tryExplode(node) {
  if (node.pair) {
    // If this pair has four parents (=its contents are 5 levels deep)
    if (node.parent?.parent?.parent?.parent) {
      explodeVal(node, node.r.val, false);
      explodeVal(node, node.l.val, true);
      replaceNode(node, num2leaf(0));
      return true;
    }
    return tryExplode(node.l) || tryExplode(node.r);
  }
}


// Walk the "tree" and see if any number node needs to be split.
// If so, explode and abort. Return true to denote that something was done. 
function trySplit(node) {
  if (node.num) {
    if (node.val >= 10) {
      replaceNode(node, array2pair([
        Math.floor(node.val / 2),
        Math.ceil(node.val / 2)
      ]));
      return true;
    }
  } else {
    return trySplit(node.l) || trySplit(node.r);
  }
}


function getMagnitude({l, r}) {
  return (
    (l.num ? l.val : getMagnitude(l)) * 3 +
    (r.num ? r.val : getMagnitude(r)) * 2
  ); 
}


// Add two numbers by adding them to a new parent pair node,
// and exploding/splitting as much as necessary.
function add(a, b, PRINT = false) {
  let newRoot = {l: a, r: b, parent: null, pair: true};
  a.parent = b.parent = newRoot;
  
  PRINT && console.log('\n');
  PRINT && console.log('  ' + print(a));
  PRINT && console.log('+ ' + print(b));

  while (tryExplode(newRoot) || trySplit(newRoot)) {}

  PRINT && console.log('= ' + print(newRoot));

  return newRoot; 
}



// Create nested arrays of numbers from input strings (hello eval)
input = input.split('\n').map(str => eval(str));

// pt.1: Add all numbers and get magnitude of final result
const part1 = input.
  map(str => array2pair(str)).
  reduce((a, b) => add(a, b));

console.log('Part 1: ', getMagnitude(part1));



// pt.2: Maximum magnitude
let part2 = -Infinity;
for (let a of input) {
  for (let b of input) {
    part2 = a === b ? part2 : Math.max(
      part2,
      getMagnitude(add(array2pair(a), array2pair(b))),
      getMagnitude(add(array2pair(b), array2pair(a)))
    );
  }
}

console.log('Part 2: ', part2);


// Should've maybe just used a class this one time ¯\_(ツ)_/¯