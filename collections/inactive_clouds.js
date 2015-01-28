InactiveClouds = new Meteor.Collection('inactiveClouds');

if (Meteor.isServer) {
    Meteor.methods({
      softDeleteInactiveClouds: softDeleteInactiveClouds,
      softDeleteUsersClouds:    softDeleteUsersClouds
    });
}

function softDeleteInactiveClouds(olderThanHours) {
    var minAge         = Date.now() - Util.hoursToMiliseconds(olderThanHours),
        inactiveQuery  = { lastActiveAt: { $lt: minAge } };
    softDeleteClouds(inactiveQuery);
}

function softDeleteUsersClouds() {
    var usersCloudsQuery = { createdByUserId: Meteor.userId() };
    softDeleteClouds(usersCloudsQuery);
}

function softDeleteClouds(cloudsToDeleteQuery) {
   var clouds = Clouds.find(cloudsToDeleteQuery).fetch();
    _.each(clouds, function(cloud) {
        var cloudQuery = { cloudId: cloud._id };
        cloud.songs = Songs.find(cloudQuery).fetch();
        cloud.cloudUsers = CloudUsers.find(cloudQuery).fetch();
        InactiveClouds.insert(cloud);
        Songs.remove(cloudQuery);
        CloudUsers.remove(cloudQuery);
        Clouds.remove(cloud._id);
    });
}