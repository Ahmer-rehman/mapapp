// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDFBF7HEctGrGgovz-jiuniQ06lYnD28Vk",
    authDomain: "codelab-7c799.firebaseapp.com",
    databaseURL: "https://codelab-7c799-default-rtdb.firebaseio.com",
    projectId: "codelab-7c799",
    storageBucket: "codelab-7c799.appspot.com",
    messagingSenderId: "812252989593",
    appId: "1:812252989593:web:e2dcc5e67e045aa39b1008",
    measurementId: "G-501TRQ7R2P"
  };

firebase.initializeApp(firebaseConfig);
const database = firebase.database();


const map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([0, 0]),
        zoom: 2
    })
});

// Define an object to store markers for users
const userMarkers = {};

// Set up Firebase listener to watch for changes in user locations
database.ref('userLocations').on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
        var userData = childSnapshot.val();
        var userId = childSnapshot.key;
        var latitude = userData.latitude;
        var longitude = userData.longitude;

        // Update marker position for the user
        updateMarkerPosition(userId, latitude, longitude);
    });
});

// Function to update marker positions based on user locations
function updateMarkerPosition(userId, latitude, longitude) {
    let marker = findOrCreateMarker(userId);
    let currentLocation = ol.proj.fromLonLat([longitude, latitude]);
    marker.getGeometry().setCoordinates(currentLocation);
}

// Function to find or create a marker for a user
function findOrCreateMarker(userId) {
    if (userMarkers.hasOwnProperty(userId)) {
        return userMarkers[userId];
    } else {
        let marker = new ol.Feature({
            geometry: new ol.geom.Point([0, 0])
        });
        let vectorSource = new ol.source.Vector({
            features: [marker]
        });
        let vectorLayer = new ol.layer.Vector({
            source: vectorSource
        });
        map.addLayer(vectorLayer);
        userMarkers[userId] = marker;
        return marker;
    }
}


if ('geolocation' in navigator) {
    navigator.geolocation.watchPosition(
        function(position) {
            let { latitude, longitude } = position.coords;
            updateMarkerPosition(userId, latitude, longitude);
            database.ref('userLocations/' + userId).set({
                latitude: latitude,
                longitude: longitude
            });
            map.getView().setCenter(ol.proj.fromLonLat([longitude, latitude]));
            map.getView().setZoom(15);
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

const peer = new Peer();

// Event listener for when the peer connection is open
peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
});

// Event listener for incoming connections
peer.on('connection', function(connection) {
    // Handle incoming connection
    console.log('Incoming connection from peer:', connection.peer);

    // Event listener for data received from the peer
    connection.on('data', function(data) {
        console.log('Received data from peer ' + connection.peer + ': ' + data);
    });

    // Example of sending data back to the peer
    connection.send('Hello from server!');
});

// Function to connect to a peer with a given ID
function connectToPeer(peerId) {
    const connection = peer.connect(peerId); // Connect to peer with specified ID

    // Event listener for when the connection is open
    connection.on('open', function() {
        console.log('Connected to peer ' + peerId);

        // Example of sending data to the connected peer
        connection.send('Hello from client!');
    });

    // Event listener for errors
    connection.on('error', function(err) {
        console.error('Error connecting to peer ' + peerId + ':', err);
    });
}
