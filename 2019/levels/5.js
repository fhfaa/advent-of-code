const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8');

const data = input.split(',').map(parseFloat);

// pt.1
console.log('Part 1: ', 'TODO');


// pt.2
console.log('Part 2: ', 'TODO');