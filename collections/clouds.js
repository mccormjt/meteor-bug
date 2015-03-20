Clouds = new Meteor.Collection('clouds');
var MAX_NEAR_CLOUD_METERS = 600;

if (Meteor.isServer) { 
    Clouds._ensureIndex({ location: '2dsphere' });
    Clouds._ensureIndex({ createdByUserId: 1 });

    Meteor.methods({
        createCloud:            createCloud,
        findCloudById:          findCloudById,
        updateCloudActiveness:  updateCloudActiveness
    });
}

Meteor.methods({
    setCloudVolume:            setCloudVolume,
    setCloudNowPlayingSongId:  setCloudNowPlayingSongId,
    setCloudNowPlayingTime:    setCloudNowPlayingTime,
    setIsCloudPaused:          setIsCloudPaused,
    setCloudLoadingSongState:  setCloudLoadingSongState
});


Clouds.getFindNearQuery = function(location) {
    checkLocation(location);

    var maxDist     = MAX_NEAR_CLOUD_METERS + location.accuracy * 2,
        geometry    = locationToMongo(location),
        nearSphere  = { $nearSphere: { $geometry: geometry, $maxDistance: maxDist } },
        query       = { location: nearSphere, isPublic: true };

    return query;
};

Clouds.distanceFromCloud = function(cloud, location) {
    checkLocation(location);

    var lat1  = cloud.location.coordinates[1],
        lng1  = cloud.location.coordinates[0],
        lat2  = location.latitude,
        lng2  = location.longitude;

    var rad      = Math.PI / 180,
        radlat1  = rad * lat1,
        radlat2  = rad * lat2,
        theta    = lng1 - lng2,
        radtheta = rad * theta,
        dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

    dist = Math.acos(dist) * 180/Math.PI
    return dist * 60 * 1.1515 // to miles
}


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
                        lastActiveAt: Date.now(), nowPlayingSongId: '', nowPlayingTime: 0, isPaused: true, 
                        volume: 0.55, isLoadingSong: false };
        mongoLocation && _.extend(cloud, { location: mongoLocation });
        return Clouds.insert(cloud);
}

function setCloudProperty(property, value, hasPermission) {
    if (!hasPermission) return;
    var setter = {};
    setter[property] = value;
    Clouds.update({ _id: App.cloudId() }, { $set: setter });
}

function setCloudVolume(volumeLevel) {
    check(volumeLevel, String);
    setCloudProperty('volume', volumeLevel, App.isAdmin());
}

function setCloudNowPlayingTime(time) {
    check(time, Number);
    setCloudProperty('nowPlayingTime', time, App.isOutput());
}

function setCloudNowPlayingSongId(songId) {
    check(songId, String);
    setCloudProperty('nowPlayingSongId', songId, App.isAdmin() || App.isOutput());
}

function setIsCloudPaused(isPaused) {
    check(isPaused, Boolean);
    setCloudProperty('isPaused', isPaused, App.isAdmin());
}

function updateCloudActiveness() {
    setCloudProperty('lastActiveAt', Date.now(), true);
}

function setCloudLoadingSongState(isLoading) {
    check(isLoading, Boolean);
    setCloudProperty('isLoadingSong', isLoading, App.isOutput());
}

function checkLocation(location) {
    check(location, {latitude: Number, longitude: Number, accuracy: Number});
}

function locationToMongo(location) {
    return { type: 'Point', coordinates: [ location.longitude, location.latitude] };
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
    while (findCloudById(id)) {
        id += getRandIntStrOfLength(1);
    }
    return id;
}

function findCloudById(id) {
    check(id, String);
    return Clouds.find({ _id: id }).fetch()[0];
}