const sharp = require('sharp');
const eachLimit = require('async/eachLimit');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

const fs = require('fs');
const path = require('path');

const input = 'src/images/';
const output = 'dist/images/';

const IMAGE_SIZE = 500;

eachLimit(fs.readdirSync(input), 5, processImage, console.log);

function minify(buffer, filename, done) {
  imagemin
    .buffer(buffer, {
      plugins: [imageminMozjpeg()]
    })
    .then(img => {
      fs.writeFile(filename, img, 'utf8', err => {
        if (err) console.error(err);
        if (done) done();
      });
    })
    .catch(console.log);
}

function processImage(filepath, done) {
  if (filepath.indexOf('.DS_Store') > -1) return;
  const outfile = path.join(output, path.basename(filepath));
  const fileIn = path.join(input, filepath);
  sharp(fileIn)
    .resize(IMAGE_SIZE)
    .toBuffer((err, buffer) => {
      if (err) console.error(err);
      minify(buffer, outfile, done);
    });
}
