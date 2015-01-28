Clouds = new Meteor.Collection('clouds');
var MAX_NEAR_CLOUD_METERS = 600;

if (Meteor.isServer) { 
    Clouds._ensureIndex({ location: '2dsphere' });
    Clouds._ensureIndex({ createdByUserId: 1 });
    Clouds._ensureIndex({ _id: 1 });

    Meteor.methods({
        createCloud:            createCloud,
        findCloudsNear:         findCloudsNear,
        findCloud:              findCloud,
        updateCloudActiveness:  updateCloudActiveness
    });
}

Meteor.methods({
    setCloudVolume:         setCloudVolume,
    setCloudNowPlayingTime: setCloudNowPlayingTime
});


function createCloud(name, isPublic, location) {
        check(name, String);
        check(isPublic, Boolean);
        Meteor.call('softDeleteUsersClouds');

        var mongoLocation;
        if (isPublic) {
            checkLocation(location);
            mongoLocation = locationToMongo(location);
        }

        var cloud = { _id: createCloudId(), name: name, isPublic: isPublic, createdByUserId: Meteor.userId(),
                        lastActiveAt: Date.now(), nowPlayingSongId: '', nowPlayingTime: 0, isPaused: true, volume: 0.55 };
        mongoLocation && _.extend(cloud, { location: mongoLocation });
        return Clouds.insert(cloud);
}


function findCloudsNear(location) {
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
}


function setCloudVolume(volumeLevel) {
    check(volumeLevel, String);
    Clouds.update({ _id: App.cloudId() }, { $set: { volume: volumeLevel } });
}

function setCloudNowPlayingTime(time) {
    check(time, Number);
    Clouds.update({ _id: App.cloudId() }, { $set: { nowPlayingTime: time } });
}

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

function getRandIntStrOfLength(length) {
    var number = '';
    for (var i = 0; i < length; i++) {
        number += _.random(0, 9);
    }
    return number;
}

function createCloudId() {
    var id = getRandIntStrOfLength(6);
    while (findCloud(id)) {
        id += getRandIntStrOfLength(1);
    }
    return id;
}

function findCloud(id) {
    check(id, String);
    return Clouds.find({ _id: id }).fetch()[0];
}

function updateCloudActiveness() {
    Clouds.update({ _id: App.cloudId() }, { $set: { lastActiveAt: Date.now() } });
}