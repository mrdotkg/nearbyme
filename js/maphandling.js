/**
 * Created by kumar on 20/4/15.
 */
/**
 * script to get current geo-location;arguments are success and error callback functions
 */
//require("http://maps.google.com/maps/api/js?sensor=false&v=3&libraries=geometry");

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
    };
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    //service.nearbySearch(request, callback);
    type_array==[]?'':service.textSearch(request, initializeCallback);
}

function initializeCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        var table=$('#results').DataTable(
            {
                scrollX:true
            }
        );

        table.clear().draw();
        var centerLatLng={lat:center.coords.latitude,lng:center.coords.longitude};
        $('.cd-panel-header > h1').html( $("#search").val()+' nearby my location' );

        for (var i = 0; i < results.length; i++) {
            createMarker(i+1,results[i],table,centerLatLng);
        }

        //show table
        $('.cd-panel').addClass('is-visible');
        $('#nav-r').show();

    }
}
function createMarker(ctr,place,table,centerLatLng) {
    //map services
    var distanceMatrixService = new google.maps.DistanceMatrixService();
    var placesService = new google.maps.places.PlacesService(map);

    //parameters
    var hrefGetDirections='http://maps.google.com/maps?saddr='+centerLatLng.lat+','+centerLatLng.lng+'&daddr='+place.name+'+'+place.formatted_address;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
    var origin=new google.maps.LatLng(centerLatLng.lat,centerLatLng.lng);
    var destination=new google.maps.LatLng(place.geometry.location.lat(),place.geometry.location.lng());

    distanceMatrixService.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.WALKING,
        unitSystem: google.maps.UnitSystem.METRIC
    }, function(distMat, status){
        if('OK'==status){
            var distMatWalking=distMat.rows[0].elements[0];
            distanceMatrixService.getDistanceMatrix({
                origins: [origin],
                destinations: [destination],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC
            }, function(distMat, status){
                if('OK'==status){
                    var distMatDriving=distMat.rows[0].elements[0];
                    var distance='<i class="zmdi zmdi-walk"></i>: '+distMatWalking.distance.text +' <i class="zmdi zmdi-time"></i>: '+ distMatWalking.duration.text;
                    distance+='<br><i class="zmdi zmdi-car"></i>: '+distMatDriving.distance.text +' <i class="zmdi zmdi-time"></i>: '+ distMatDriving.duration.text;

                    //add details in row
                    table.row.add( [ctr+' <a target="blank" href="'+hrefGetDirections+'"><i class="zmdi zmdi-arrow-split"></i></a>',place.name,place.formatted_address,distance] ).draw( false );
                }
            });
        }
    });

    //draw marker on map
    placesService.getDetails({ placeId:place.id}, initializeCallback);
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

//google.maps.event.addDomListener(window, 'load', initialize);
