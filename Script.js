var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([73.054388, 33.719177]), // Default center
        zoom: 12 // Adjust the zoom level as per your preference
    })
});

// Function to create a marker
var marker = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([73.054388, 33.719177])),
    name: 'Current Location'
});

var markerStyle = new ol.style.Style({
    image: new ol.style.Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'https://openlayers.org/en/latest/examples/data/icon.png' // You can replace this with your own marker icon
    })
});

marker.setStyle(markerStyle);

var vectorSource = new ol.source.Vector({
    features: [marker]
});

var vectorLayer = new ol.layer.Vector({
    source: vectorSource
});

map.addLayer(vectorLayer);

// Get user's real-time location
if ('geolocation' in navigator) {
    var watchId = navigator.geolocation.watchPosition(
        function(position) {
            var currentLocation = ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude]);
            marker.getGeometry().setCoordinates(currentLocation); // Update marker position

            // Center map on the user's current location
            map.getView().setCenter(currentLocation);
            map.getView().setZoom(15); // You can adjust the zoom level here
        },
        function(error) {
            alert('Error getting current position: ' + error.message);
        },
        {
            enableHighAccuracy: true
        }
    );
} else {
    alert('Geolocation is not supported by this browser.');
}
