InactiveClouds = new Meteor.Collection('inactiveClouds');

if (Meteor.isServer) {
    Meteor.methods({
      softDeleteInactiveClouds: softDeleteInactiveClouds,
      softDeleteUsersClouds:    softDeleteUsersClouds
    });

    SyncedCron.add({
        name:     'Soft Delete Clouds that have not been used in a while',
        schedule: function(parser) { return parser.text('every 1 hour') }, 
        job:      Util.wrapMeteorMethod('softDeleteInactiveClouds', 60)
    });
}

function softDeleteInactiveClouds(olderThanHours) {
    var minAge         = Date.now() - Time.hoursToMiliseconds(olderThanHours),
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
    return clouds.length + ' clouds have been soft deleted';
}