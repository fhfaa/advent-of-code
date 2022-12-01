const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

/* *
input = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`;
/* */

const open = '([{<';
const close = ')]}>';
const score = [3, 57, 1197, 25137];

let part1 = 0, part2 = [];

// pt.1 + 2
input.split('\n').forEach(s => {
  const arr = s.split('');
  let idx = 0, which, stack = [];

  while(idx < arr.length) {
    const current = arr[idx];

    // Opening bracket - push on stack
    if (open.indexOf(current) > -1) {
      stack.push(current);

    // Closing bracket: try to remove matching opening bracket from stack
    } else if ((which = close.indexOf(current)) > -1) {
      // Expected
      if (stack.length && stack[stack.length - 1] === open[which]) {
        stack.pop();
      
      // Unexpected -- count error score for part 1 and abort for this row
      } else {
        // console.log(`${s}: Unexpected ${current} (${score[which]}) at index ${idx}` );
        return part1 += score[which];
      }
    }
    
    idx++;
    continue;
  }

  // Stack not empty: incomplete input -- calculate score for part2
  if (stack.length) {
    let points = 0;
    for (let openBrace of stack.reverse()) {
      const which = open.indexOf(openBrace);
      points = (points * 5) + which + 1;
    }
    // console.log(`${s}: Completion score: ${points}`);
    part2.push(points);
  }
  // Otherwise valid & complete -- do nothing
});

console.log('Part 1: ', part1);
console.log('Part 2: ', part2.sort((a, b) => a - b)[Math.floor(part2.length / 2)]); // median score