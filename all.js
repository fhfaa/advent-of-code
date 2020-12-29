const { spawnSync } = require('child_process');
const { existsSync } = require('fs');


function runYear(year) {
  console.log(`\n--------------\n--   ${year}   --\n--------------\n`);

  [...Array(25).keys()].forEach(i => {
    const lvl = i + 1;
    const file = `./${year}/levels/${lvl}.js`

    if (existsSync(file)) {
      console.log(` -- Level ${lvl} -- `);
      const out = String(spawnSync('node', [file], {cwd: __dirname}).output.slice(1, -1));
      console.log(out);
    }
  });
}

runYear(2020);
runYear(2019);