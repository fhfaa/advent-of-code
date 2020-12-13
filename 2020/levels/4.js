const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8');

/*input = `ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in`;*/


// pt.1
const data = input.
  split('\n\n').
  map(s => s.replace(/\n/g, ' ').split(' ')).
  filter(a => a.length === 8 || 
    (a.length === 7 && !a.some(f => /^cid:/.test(f)))
  );

console.log('Part 1: ', data.length);


// pt.2
const validators = {
  byr: /^19[2-9]\d|200[0-2]$/,
  iyr: /^201\d|2020$/,
  eyr: /^202\d|2030$/,
  hgt: /^((1[5-8]\d|19[0-3])cm)|((59|6\d|7[0-6])in)$/,
  hcl: /^#[a-f0-9]{6}$/,
  ecl: /^amb|blu|brn|gry|grn|hzl|oth$/,
  pid: /^\d{9}$/
}
const data2 = input.
  split('\n\n').
  filter(s => {
    const a = s.
      replace(/\n/g, ' ').split(' ').
      filter(f => !/^cid:/.test(f));

    return a.length === 7 && a.every(f => {
      const [k, v] = f.split(':');
      return validators[k].test(v);
    })
  });

console.log('Part 2: ', data2.length);