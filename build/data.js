const fs = require('fs');
const path = require('path');

const chokidar = require('chokidar');
const jsonminify = require('jsonminify');

function minifyJSON(file) {
  fs.readFile(file, 'utf8', (err, json) => {
    if (err) console.error(err);
    const filename = path.basename(file).replace('json', 'js');
    writeFile(jsonminify(json), filename);
  });
}

function writeFile(json, filename) {
  const outFile = `dist/data/${filename}`;
  fs.writeFile(outFile, json, console.log);
}

chokidar.watch('src/data').on('change', minifyJSON);
