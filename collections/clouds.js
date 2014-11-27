Clouds = new Meteor.Collection('clouds');
if (Meteor.isServer) { Clouds._ensureIndex({ location: '2dsphere' }) }

var MAX_NEAR_CLOUD_METERS = 600;


Meteor.methods({

    createCloud: function(name, isPublic, location) {
        check(name, String);
        check(isPublic, Boolean);
        var mongoLocation;

        if (isPublic) {
            checkLocation(location);
            mongoLocation = locationToMongo(location);
        }

        var cloud = { name: name, isPublic: isPublic, nowPlayingSongId: null, isPaused: true };
        mongoLocation && _.extend(cloud, { location: mongoLocation });
        return Clouds.insert(cloud);
    },


    findCloudsNear: function(location) {
        if (Meteor.isClient) return;
        checkLocation(location);

        var query = 
        { 
            location: { $nearSphere: { 
                $geometry:    locationToMongo(location),
                $maxDistance: MAX_NEAR_CLOUD_METERS + location.accuracy * 2
            }},
            isPublic: true
        };

        var clouds = Clouds.find(query, {limit: 5}).fetch();
        _.each(clouds, function(cloud) {
            cloud.distance = distance(location.lat, location.long, cloud.location.coordinates[1], cloud.location.coordinates[0]);
        });
        return clouds;
    },


    findCloud: function(id) {
        check(id, String);
        return Clouds.find({ _id: id }).fetch()[0];
    }

});


function checkLocation(location) {
    check(location, {lat: Number, long: Number, accuracy: Number})
}

function locationToMongo(location) {
    return { type: 'Point', coordinates: [ location.long, location.lat] };
}

function distance(lat1, lon1, lat2, lon2) {
    var rad      = Math.PI / 180,
        radlat1  = rad * lat1,
        radlat2  = rad * lat2,
        radlon1  = rad * lon1,
        radlon2  = rad * lon2,
        theta    = lon1 - lon2,
        radtheta = rad * theta,
        dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

    dist = Math.acos(dist) * 180/Math.PI
    return dist * 60 * 1.1515 // to miles
}
