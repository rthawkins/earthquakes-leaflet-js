// Earthquake source: 4.5+ magnitude in past 30 days

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

d3.json(queryUrl, function(data) {
  createFeatures(data.features);
});

function getColor(mag) {
  if (mag >= 4.5 && mag <= 5) 
      return "#FFF442";
  else if (mag > 5 && mag <= 5.5)
      return "#FFBA42 ";
  else if (mag > 5.5 && mag <= 6) 
      return "#FCA60F";
  else if (mag > 6 && mag <= 6.5)
      return "#751601";
   else 
      return "#4F0E00"
}

function createFeatures(earthquakeData) {

  var earthquakes=L.geoJson(earthquakeData, {
      pointToLayer: function(data, latlng) {
        return L.circleMarker(latlng, {
          radius: data.properties.mag * 3,
          color: getColor(data.properties.mag),
          opacity: 0.75,
          fillOpacity: 0.75,
          weight: 0
        }).bindPopup("<h3> Location: " + data.properties.place +
        "</h3><hr><p> <b>Time: </b>" + new Date(data.properties.time) + "</p> <p> <b>Magnitude:</b> "+ data.properties.mag + "</p>");
      }
    });

  createMap(earthquakes);
}

function createMap(earthquakes) {

  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  var overlayMaps = {
    "Earthquakes (4.5+ Mg)": earthquakes
  };

  var myMap = L.map("map", {
    center: [
      0, 0
    ],
    zoom: 3,
    layers: [streetmap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Legend 
  // https://docs.eegeo.com/eegeo.js/v0.1.780/docs/leaflet/L.DomUtil/
  // https://gis.stackexchange.com/questions/133630/adding-leaflet-legend

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
    var div = L.DomUtil.create('div', 'info legend'),
    grades = [4.5, 5, 5.5, 6, 6.5];
    

    div.innerHTML+='Magnitude<br><hr>'

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
}

return div;
};

legend.addTo(myMap);

}
