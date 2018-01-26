const fs = require('fs');
const path = require('path');

const chokidar = require('chokidar');
const jsonminify = require('jsonminify');

const dataDir = 'src/data';

function minifyJSON(file) {
  const basename = path.basename(file);
  fs.readFile(`src/data/${basename}`, 'utf8', (err, json) => {
    if (err) console.error(err);
    const filename = basename.replace('json', 'js');
    writeFile(jsonminify(json), filename);
  });
}

function writeFile(json, filename) {
  const outFile = `dist/data/${filename}`;
  fs.writeFile(outFile, json, e => {
    if (e) console.log(e);
  });
}

if (process.env.NODE_ENV === 'development')
  chokidar.watch(dataDir).on('change', minifyJSON);
else {
  const files = fs.readdirSync(dataDir);
  files.forEach(minifyJSON);
}
