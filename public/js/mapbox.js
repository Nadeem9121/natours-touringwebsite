// console.log('Hello from the mapbox');
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibmFkZWVtMTEyMjQ0IiwiYSI6ImNseGV5dWJtbjBqbm8ycnF0b2ZpbXRlYm0ifQ.nn73ijnRd_VTleZohA7ydw';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //Add marker
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}:${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
