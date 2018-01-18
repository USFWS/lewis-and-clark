require('classlist-polyfill');

const xhr = require('xhr');
const parallel = require('async/parallel');
const mapboxgl = require('mapbox-gl');
const slugify = require('underscore.string/slugify');
const scroll = require('scroll');

const Infowindow = require('./Infowindow');

mapboxgl.accessToken =
  'pk.eyJ1Ijoicmhld2l0dCIsImEiOiJjamNob3kwc3oybjRiMnF1ajlodjU2aXppIn0.OuSs426CqQ__H9Cz6x-3Aw';

const padding = { top: 50, left: 450, right: 50, bottom: 50 };

const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
});

const scrollToLocation = feature => {
  const props = feature.properties;
  const el = document.querySelector(`#${slugify(props.name)}`);
  const infowindowContent = document.querySelector('.infowindow-content');
  scroll.top(infowindowContent, el.offsetTop - 10, { duration: 700 });
};

const getBounds = geojson =>
  geojson.features.reduce(
    (bounds, feature) => bounds.extend(feature.geometry.coordinates),
    new mapboxgl.LngLatBounds()
  );

const initialize = (err, results) => {
  if (err) console.error(err);
  const sidebar = new Infowindow({
    locations: results.locations,
    target: document.querySelector('#map')
  });

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-103.261, 40.267],
    zoom: 4
  });

  map.on('load', () => {
    map.fitBounds(getBounds(results.locations), { padding });
    map.addLayer({
      id: 'trail',
      type: 'line',
      source: {
        type: 'geojson',
        data: results.trail
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#003977',
        'line-width': 2
      }
    });
    map.addLayer({
      id: 'refuges',
      type: 'circle',
      source: {
        type: 'geojson',
        data: results.locations
      },
      paint: {
        'circle-radius': 6,
        'circle-color': '#003977',
        'circle-stroke-width': 1,
        'circle-stroke-color': 'white'
      },
      filter: [
        '!=',
        'name',
        'National Wildlife Refuges<br>Along the Lewis and Clark Trail'
      ]
    });
  });

  map.on('click', 'refuges', e => {
    const coords = map.project(e.lngLat);
    coords.x = coords.x - 200;
    map.flyTo({ center: map.unproject(coords) });
    scrollToLocation(e.features[0]);
  });

  map.on('mouseenter', 'refuges', e => {
    const feat = e.features[0];
    const coords = feat.geometry.coordinates;
    // If the coordinates are an array of arrays it's a MultiPoint
    const center = Array.isArray(coords[0]) ? e.lngLat : coords;
    const html = `
      <h2>${feat.properties.name}</h2>
      <p><em>Click for more</em></p>
    `;
    map.getCanvas().style.cursor = 'pointer';
    popup
      .setLngLat(center)
      .setHTML(html)
      .addTo(map);
  });

  map.on('mouseleave', 'refuges', () => {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });
};

const getFile = (path, cb) => {
  xhr.get(path, (err, res, body) => {
    if (err) return cb(err);
    else return cb(null, JSON.parse(body));
  });
};

parallel(
  {
    locations: getFile.bind(null, './data/locations.js'),
    trail: getFile.bind(null, './data/trail-test.js')
  },
  initialize
);
