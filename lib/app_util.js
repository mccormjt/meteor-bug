App = new function() {
    var self = this;
    

    function cloudIdOnClient() {
        return Router.current().params.cloudId;
    }

    function cloudIdOnServer() {
        return getUserProfileProperty(Meteor.userId(), 'currentCloudId');
    }

    self.cloudId = Meteor.isClient ? cloudIdOnClient : cloudIdOnServer;

    self.cloud = function() { return Clouds.findOne(self.cloudId()) };

    self.cloudUser = function() {
        return CloudUsers.findOne({ userId: Meteor.userId(), cloudId: self.cloudId() });
    };


    self.isBanned = function(userId) {
        return false;
    };

    


    // ======================= User Properties =========================

    function getUserProfileProperty(userId, property) {
        userId = userId || Meteor.userId();
        var fields = {};
        fields['profile.' + property] = 1;
        var user = Meteor.users.findOne(userId, { fields: fields });
        if (!user) console.log('WARNING - No user found with id:', userId, property);
        return user && user['profile'][property];
    };
}