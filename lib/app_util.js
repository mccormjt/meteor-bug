App = new function() {
    var self = this;

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