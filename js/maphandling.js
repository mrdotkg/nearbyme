/**
 * Created by kumar on 20/4/15.
 */
/**
 * script to get current geo-location;arguments are success and error callback functions
 */


    //k is laati
    //d is longi
var center, map_canvas='map-canvas', zoom=13, radius=1000, type_array=['atm'];

function getLocation(s,f) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(s);
    } else {
        f();
    }
}

function success(position) {
    center= position;
    //var location = new google.maps.LatLng(center.coords.latitude,center.coords.longitude);


    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var geolocpoint = new google.maps.LatLng(latitude, longitude);
    //map.setCenter(geolocpoint );//line added for setting center

    var marker = new google.maps.Marker({
        position: geolocpoint,
        map: map,
        title: 'You are Here!!!'
    });
    marker.setMap(map);

    var i = new google.maps.InfoWindow({
        content:"You are Here!!"
    });
    i.open(map,marker);


    type_array=[];
    //type_array.push( prompt("Please enter the type of place you are looking for, eg: atm"));
    //type_array= prompt("Please enter the type of place you are looking for, eg: atm");
    type_array='';
    if (type_array != null) {
        initialize();
    }
}
function fail() {
    console.error("failed to get location permission!");
}


/**
 * script to get the places nearby
 */

var map;
var infowindow;

function initialize() {
    var location = new google.maps.LatLng(center.coords.latitude,center.coords.longitude);

    map = new google.maps.Map(document.getElementById(map_canvas), {
        center: location,
        zoom: zoom
    });

    var request = {
        location: location,
        radius: radius,
        query: type_array
        //types: type_array
    };
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    //service.nearbySearch(request, callback);
    service.textSearch(request, callback);

}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

//google.maps.event.addDomListener(window, 'load', initialize);
