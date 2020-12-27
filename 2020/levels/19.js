const fs = require('fs');
const { url } = require('inspector');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8');

/* *
input = `0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb`;
/* */

/* *
input = `42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1

abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaaaabbaaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
babaaabbbaaabaababbaabababaaab
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba`;
/* */


let [rules, data] = input.split('\n\n');
rules = rules.split('\n').reduce((ret, rule) => {
  const [num, ruleDef] = rule.split(': ');
  ret[num] = ruleDef.charAt(0) === '"' ?
    ruleDef.charAt(1) :
    ruleDef.split(' | ').map(part => part.split(' ').map(parseFloat));
  return ret;
}, {});
data = data.split('\n');

// Copy for pt.2
const rules2 = JSON.parse(JSON.stringify(rules));

function solve(rules) {
  // pt.1
  // This is obviously not going to work for part 2, but why not generate a MASSIVE regex just because?
  let changesMade;
  do {
    changesMade = false;
    for (let key of Object.keys(rules)) {
      const ruleDef = rules[key];
      if (typeof ruleDef !== 'string') {
        let ruleStrCount = 0;

          for (let subIndex = 0; subIndex < ruleDef.length; subIndex++) {
            
            const sub = ruleDef[subIndex];
            if (typeof sub !== 'string') {
              let stringStrCount = 0;

              for (let stringIndex = 0; stringIndex < sub.length; stringIndex++) {
                if (typeof rules[sub[stringIndex]] === 'string') {
                  sub[stringIndex] = rules[sub[stringIndex]];
                }
                stringStrCount += typeof sub[stringIndex] === 'string' ? 1 : 0;
              }

              if (stringStrCount === sub.length) {
                ruleDef[subIndex] = sub.join('');
                changesMade = true;
                ruleStrCount++;
              }
            } else {
              ruleStrCount ++;
            }
          }
        
        if (ruleStrCount === ruleDef.length) {
          rules[key] = '(' + ruleDef.join('|') + ')';
          changesMade = true;
        }
      }
    }
  } while (changesMade);
  
  return rules;
}


solve(rules);
/*
console.log(rules[0]);
((((a(a(b(b(b(a(a|b)|ba)|a(bb))|a(a(ba|(a|b)b)|b(bb|aa)))|a(a((bb|aa)b|(ba|(a|b)b)a)|
b(b(aa|ab)|a(ab|bb))))|b(a(b((ba|(a|b)b)a|(aa|b(a|b))b)|a((ba|aa)b|(bb|aa)a))|b(a(a(b
a)|b(ba|aa))|b(a(ba|(a|b)b)|b(a(a|b)|ba)))))|b(b((((ab|bb)a|(ba)b)a|(a(ab)|b(ba|(a|b)
b))b)b|((a(ba|aa)|b(aa|ab))b|((bb)a)a)a)|a(b(((aa|ab)a|((a|b)(a|b))b)a|(b(aa|ab)|a(ab
|bb))b)|a(((a(a|b)|ba)b|(aa|b(a|b))a)b|(b(aa)|a(aa))a))))b|(b(a(a(b((bb)b|(ba|aa)a)|a
((bb|a(a|b))a|(ab)b))|b(((aa)b|(bb|a(a|b))a)b|((ba|(a|b)b)a|(bb|ba)b)a))|b(a(b(a(aa)|
b(bb|a(a|b)))|a((bb|a(a|b))(a|b)))|b(b(b(bb|a(a|b))|a(ab|bb))|a((bb|ba)(a|b)))))|a(b(
(a((bb)b|(ba|aa)a)|b(b(bb|a(a|b))|a(ab)))a|(a(b(bb)|a(aa|b(a|b)))|b((ab)a))b)|a((b((b
b|a(a|b))b|(ba|(a|b)b)a)|a((ab)a|(aa|ab)b))a|(a(b(ba|aa)|a(aa))|b((ab)b|(ab)a))b)))a)
)(((a(a(b(b(b(a(a|b)|ba)|a(bb))|a(a(ba|(a|b)b)|b(bb|aa)))|a(a((bb|aa)b|(ba|(a|b)b)a)|
b(b(aa|ab)|a(ab|bb))))|b(a(b((ba|(a|b)b)a|(aa|b(a|b))b)|a((ba|aa)b|(bb|aa)a))|b(a(a(b
a)|b(ba|aa))|b(a(ba|(a|b)b)|b(a(a|b)|ba)))))|b(b((((ab|bb)a|(ba)b)a|(a(ab)|b(ba|(a|b)
b))b)b|((a(ba|aa)|b(aa|ab))b|((bb)a)a)a)|a(b(((aa|ab)a|((a|b)(a|b))b)a|(b(aa|ab)|a(ab
|bb))b)|a(((a(a|b)|ba)b|(aa|b(a|b))a)b|(b(aa)|a(aa))a))))b|(b(a(a(b((bb)b|(ba|aa)a)|a
((bb|a(a|b))a|(ab)b))|b(((aa)b|(bb|a(a|b))a)b|((ba|(a|b)b)a|(bb|ba)b)a))|b(a(b(a(aa)|
b(bb|a(a|b)))|a((bb|a(a|b))(a|b)))|b(b(b(bb|a(a|b))|a(ab|bb))|a((bb|ba)(a|b)))))|a(b(
(a((bb)b|(ba|aa)a)|b(b(bb|a(a|b))|a(ab)))a|(a(b(bb)|a(aa|b(a|b)))|b((ab)a))b)|a((b((b
b|a(a|b))b|(ba|(a|b)b)a)|a((ab)a|(aa|ab)b))a|(a(b(ba|aa)|a(aa))|b((ab)b|(ab)a))b)))a)
((b(((b(b(bb|ba)|a(ab|bb))|a((aa|ab)(a|b)))b|((b(a(a|b)|ba)|a(bb))a|(a(bb|a(a|b))|b((
a|b)(a|b)))b)a)a|(a((b(bb|a(a|b))|a(ab))a|(a(bb)|b(bb))b)|b(((ba|aa)a|(bb|a(a|b))b)a|
((ab)b|(a(a|b)|ba)a)b))b)|a(b((b(b(aa)|a(aa))|a(a(ba|ab)|b(aa)))a|(a(b(ab)|a(ab|bb))|
b(b(bb)|a((a|b)(a|b))))b)|a((b(b(bb|aa)|a(ba))|a((ab)a|(bb|aa)b))b|(a(a(aa)|b(bb|a(a|
b)))|b(a(bb|aa)|b(aa|ab)))a)))b|((b((((aa|b(a|b))b|(ab)a)b|((aa|b(a|b))b|(ab|bb)a)a)b
|((b(aa)|a(aa))b|(b(bb|ba)|a(ba))a)a)|a(a(((ab)b|(ab|bb)a)b|((ab)b|(a(a|b)|ba)a)a)|b(
b((bb|a(a|b))a|(ab)b)|a((a(a|b)|ba)b|(ab|bb)a))))a|(b((a((aa|b(a|b))b|(ab|bb)a)|b(a(b
a)|b(aa)))b|(((bb|aa)a|(a(a|b)|ba)b)a|((ba|aa)a|(aa)b)b)a)|a(((b(ba|(a|b)b)|a(bb|ba))
a|(b(ab|bb)|a(bb|aa))b)a|(b((bb|ba)b|((a|b)(a|b))a)|a((bb|a(a|b))b|((a|b)(a|b))a))b))
b)a)))
*/

const regex = new RegExp(`^${rules[0]}$`);
const part1 = data.reduce((ret, str) => ret + regex.test(str), 0);
console.log('Part 1: ', part1);


// pt.2
/*
Uff, keinen Nerv für diese einige Aufgabe den ganzen Quatsch mit formalen Sprachen,
und wat weiß ich wieder rauszukramen. Wir haben drecking angefangen, dann machen wirs
drecking fertig. Schade, dass JS nicht noch rekursive RegEx hat :D

"As you look over the list of messages, you realize your matching rules aren't quite right.
To fix them, completely replace rules 8: 42 and 11: 42 31 with the following:
8: 42 | 42 8
11: 42 31 | 42 11 31"
*/
rules2[8] = [[42], [42, 8]];
rules2[11] = [[42, 31], [42, 11, 31]];
solve(rules2);

/*
See what's left unsolved:

Object.keys(rules2).forEach(key => {
  if (typeof rules2[key] !== 'string') {
    console.log(`Missing: Rule ${key}: `, rules2[key]);
  }
})

Only 0 8 and 11 are left. 0 consists of 8 and 11.
8: 42 | 42 8 => 42+
11: 42 31 | 42 11 31 ==> 42{n} 31{n}
0: 8 11 => 42+ 42{n} 31{n}
*/
rules2[8] = `(${rules2[42]})+`;
rules2[11] = '(' + 
  ([1, 2, 3, 4].
    // Fake recursion by hardcoding it n 'levels' deep.
    // Turns out 4 is enough for our input.
    // ((42{1}31{1})|(42{2}31{2})|(42{3}31{3})|(42{4}31{4}))
    map(n => `(${rules[42]}){${n}}${rules[31]}{${n}}`).join('|')
  ) + 
  ')';
rules[0] = `${rules2[8]}${rules2[11]}`;

const regex2 = new RegExp(`^${rules[0]}$`);
const part2 = data.reduce((ret, str) => ret + regex2.test(str), 0);
console.log('Part 2: ', part2);