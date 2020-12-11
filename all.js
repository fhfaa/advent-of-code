const { spawnSync } = require('child_process');
const { existsSync } = require('fs');

[...Array(24).keys()].forEach(i => {
  const lvl = i + 1;

  
  if (existsSync(`./levels/${lvl}.js`)) {
    console.log(` -- Level ${lvl} -- `);
    const out = String(spawnSync('node', [`./levels/${lvl}.js`], {cwd: __dirname}).output.slice(1, -1));
    console.log(out);
  }
})
