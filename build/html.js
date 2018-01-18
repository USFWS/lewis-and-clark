const fs = require('fs');

const chokidar = require('chokidar');
const cheerio = require('cheerio');
const format = require('date-fns/format');

const index = 'src/index.html';
const dist = 'dist/index.html';

if (process.env.NODE_ENV === 'development') {
  chokidar.watch(index).on('change', readHomepage);
  readHomepage();
} else readHomepage();

function injectDate(err, html) {
  if (err) console.error(err);
  const $ = cheerio.load(html);
  const date = format(new Date(), 'MMMM D, YYYY');
  $('.last-updated').text(date);
  writeFile($.html());
}

function writeFile(data) {
  fs.writeFile(dist, data, err => {
    if (err) console.error(err);
  });
}

function readHomepage() {
  fs.readFile(index, 'utf8', injectDate);
}
