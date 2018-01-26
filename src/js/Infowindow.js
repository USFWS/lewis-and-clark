const ARROW_RIGHT = '&#9650;';
const ARROW_LEFT = '&#9660;';

const slugify = require('underscore.string/slugify');

const Infowindow = function(data) {
  this.locations = data.locations;
  this.active = data.initialView || true;
  this.target = data.target || document.body;

  this.container = create('aside', 'infowindow-container', this.target);
  this.toggleBtn = create('button', 'infowindow-toggle', this.container);
  this.toggleBtn.innerHTML = this.active ? ARROW_RIGHT : ARROW_LEFT;
  this.content = create('section', 'infowindow-content', this.container);
  this.list = create('ul', 'infowindow-list', this.content);

  this.list.innerHTML = this.render(this.locations);
  this.toggleBtn.addEventListener('click', this.toggle.bind(this));
  if (this.active) this.show();
};

module.exports = Infowindow;

Infowindow.prototype.render = function(locations) {
  const createImg = img => `
    <figure>
      <img src="./images/${img.src}" alt="${img.alt}" />
      <figcaption>${img.caption}</figcaption>
    </figure>
  `;

  const createYouTube = video => `
    <div class='youtube-embed'>
      <iframe src="//www.youtube.com/embed/${video.id}" class="youtube-iframe"
        allowfullscreenf frameborder="0" title='${video.title}'></iframe>
    </div>
    <p class="photo-caption">${video.caption}</p>
  `;
  const createListItem = l => {
    const props = l.properties;
    const slug = slugify(props.name);
    const media = props.img
      ? createImg(props.img)
      : createYouTube(props.youtube);
    return `
      <li id="${slug}">
        ${media}
        <h2>${props.name}</h2>
        <p>${props.content}</p>
      </li>
    `;
  };
  return locations.features.map(createListItem).join('');
};

Infowindow.prototype.show = function() {
  // if (!this.active) emitter.emit('infowindow:show', -200);
  this.active = true;
  this.toggleBtn.innerHTML = ARROW_LEFT;
  this.container.classList.add('active');
};

Infowindow.prototype.hide = function() {
  // if (this.active) emitter.emit('infowindow:hide', 200);
  this.active = false;
  this.toggleBtn.innerHTML = ARROW_RIGHT;
  this.container.classList.remove('active');
};

Infowindow.prototype.toggle = function() {
  // const eventName = (this.active) ? 'infowindow:hide' : 'infowindow:show';
  // const distance = (this.active) ? 200 : -200;
  this.toggleBtn.innerHTML = this.active ? ARROW_RIGHT : ARROW_LEFT;
  this.container.classList.toggle('active');
  this.active = !this.active;
  // emitter.emit(eventName, distance);
};

function create(tagName, className, container) {
  const el = document.createElement(tagName);
  if (className) el.classList.add(className);
  if (container) container.appendChild(el);
  return el;
}
