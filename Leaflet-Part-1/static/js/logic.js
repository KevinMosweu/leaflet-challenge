// Storing API endpoint as variable
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Retrieving earthquake data
d3.json(url).then(function (data) {
    // Once earthquake data is retrieved, pass into the createFeatures function for markers and map
    createFeatures(data.features);
    
  });

// Function to set colour of markers
function colouring(depth) {
    if (-10 <= depth && depth < 10) {
      color = "#5ff94a";
    } else if (10 <= depth && depth < 30) {
      color = "#a4db2e";
    } else if (30 <= depth && depth < 50) {
      color = "#f2e14b";
    } else if (50 <= depth && depth < 70) {
      color = "#f9ac11";
    } else if (70 <= depth && depth < 90) {
      color = "#ed5e00";
    } else if (90 <= depth) {
      color = "#c61e15"
    } 
  
    return color;
  }

// Function to set size of markers
function markerSize(magnitude) {
    return magnitude * 4.5;
  }

// Function to parse data on each earthquake, build markers and pass to map creating function
function createFeatures(earthquakeData) {

  // Creating popup to provide more information on each earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}<br>
    Depth: ${feature.geometry.coordinates[2]}<br>Time: ${new Date(feature.properties.time)}</p>`);
  }
  
  // Creating circle markers to display each earthquake, coloured according to depth and size proportional to magnitude
  function circleMarkers(feature, coordinate) {
    return L.circleMarker(coordinate, {
        radius : markerSize(feature.properties.mag),
        fillColor : colouring(feature.geometry.coordinates[2]),
        color : "black",
        weight : 1,
        opacity : 1,
        fillOpacity : 0.8
    });
    }

  // Creating a GeoJSON layer with the popups and markers using the earthquake data.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: circleMarkers
  });

  // Passing the layer to the createMap function
  createMap(earthquakes);
}

  function createMap(earthquakes) {

    // Creating the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    // Creating baseMaps object.
    let baseMaps = {
      "Street Map": street
    };
  
    // Creating an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Creating map object
let myMap = L.map("map", {
    center: [39.0902, -96.7129],
    zoom: 4.5,
    layers: [street, earthquakes]
  });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
    
    }

