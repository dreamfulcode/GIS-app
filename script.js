/* eslint-disable no-undef */
/**
 * Simple map
 */

// config map
let config = {
  minZoom: 7,
  maxZoom: 18,
};
// magnification with which the map will start
const zoom = 14;
// co-ordinates
const lat = -32.410524;
const lng = -63.2410755;

const pointsA = [
  [-32.41146, -63.250866, "point A1"],
  [-32.41186, -63.250866, "point A2"],
  [-32.42156, -63.250866, "point A3"],
  [-32.41256, -63.250866, "point A4"],
];

const pointsB = [
  [-32.42476, -63.240766, "point B1"],
  [-32.41756, -63.250666, "point B2"],
  [-32.41146, -63.250566, "point B3"],
  [-32.41146, -63.250466, "point B4"],
];

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

map.on("click", function (e) {
  const markerPlace = document.querySelector(".marker-position");
  markerPlace.textContent = e.latlng;
});

const pA = new L.FeatureGroup();
const pB = new L.FeatureGroup();
const allMarkers = new L.FeatureGroup();

// adding markers to the layer pointsA
for (let i = 0; i < pointsA.length; i++) {
  marker = L.marker([pointsA[i][0], pointsA[i][1]]).bindPopup(pointsA[i][2]);
  pA.addLayer(marker);
}

// adding markers to the layer pointsB
for (let i = 0; i < pointsB.length; i++) {
  marker = L.marker([pointsB[i][0], pointsB[i][1]]).bindPopup(pointsB[i][2]);
  pB.addLayer(marker);
}

// object with layers
const overlayMaps = {
  "point A": pA,
  "point B": pB,
};

// centering a group of markers
map.on("layeradd layerremove", function () {
  // Create new empty bounds
  let bounds = new L.LatLngBounds();
  // Iterate the map's layers
  map.eachLayer(function (layer) {
    // Check if layer is a featuregroup
    if (layer instanceof L.FeatureGroup) {
      // Extend bounds with group's bounds
      bounds.extend(layer.getBounds());
    }
  });

  // Check if bounds are valid (could be empty)
  if (bounds.isValid()) {
    // Valid, fit bounds
    map.flyToBounds(bounds);
  } else {
    // Invalid, fit world
    // map.fitWorld();
  }
});

L.Control.CustomButtons = L.Control.Layers.extend({
  onAdd: function () {
    this._initLayout();
    this._addMarker();
    this._removeMarker();
    this._update();
    return this._container;
  },
  _addMarker: function () {
    this.createButton("add", "add-button");
  },
  _removeMarker: function () {
    this.createButton("remove", "remove-button");
  },
  createButton: function (type, className) {
    const elements = this._container.getElementsByClassName(
      "leaflet-control-layers-list"
    );
    const button = L.DomUtil.create(
      "button",
      `btn-markers ${className}`,
      elements[0]
    );
    button.textContent = `${type} markers`;

    L.DomEvent.on(button, "click", function (e) {
      const checkbox = document.querySelectorAll(
        ".leaflet-control-layers-overlays input[type=checkbox]"
      );

      // Remove/add all layer from map when click on button
      [].slice.call(checkbox).map((el) => {
        el.checked = type === "add" ? false : true;
        el.click();
      });
    });
  },
});

new L.Control.CustomButtons(null, overlayMaps, { collapsed: false }).addTo(map);
