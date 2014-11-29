App = new function() {
    var self = this;

    self.cloudId = function() {
        return Router.current().params.cloudId;
    };

    self.getCloudUserProperty = function(userId, property) {
        userId = userId || Meteor.userId();
        return CloudUsers.findOne({ userId: userId, cloudId: self.cloudId() })[property];
    };

    self.isOwner = function(userId) {
        return !! self.getCloudUserProperty(userId, 'isOwner');
    };

    self.isAdmin = function(userId) {
        return !! self.getCloudUserProperty(userId, 'isAdmin');
    };

    self.isOutput = function(userId) {
        return !! self.getCloudUserProperty(userId, 'isOutput');
    };

    self.isBanned = function(userId) {
        return !! self.getCloudUserProperty(userId, 'isBanned');
    };

    self.isCurrentUser = function(userId) {
        return userId == Meteor.userId();
    };


    function reigsterPropertyTemplateHelpers(property) {
        function getProperty(userId) {
            var userId = userId || this.userId;
            return self[property](userId);
        }

        var activeClassHelper = function(userId) { return _.bind(getProperty, this, userId)() ? 'active' : '' };
        Template.registerHelper(property + 'ActiveClass', activeClassHelper);
        Template.registerHelper(property, getProperty);
    }

    reigsterPropertyTemplateHelpers('isOwner');
    reigsterPropertyTemplateHelpers('isAdmin');
    reigsterPropertyTemplateHelpers('isOutput');
    reigsterPropertyTemplateHelpers('isBanned');
}