App = new function() {
    var self = this;
    

    function cloudIdOnClient() {
        return Router.current().params.cloudId
    }

    function cloudIdOnServer() {
        return getUserProfileProperty(Meteor.userId(), 'currentCloudId');
    }

    self.cloudId = Meteor.isClient ? cloudIdOnClient : cloudIdOnServer;

    self.cloud = function() { return Clouds.findOne(self.cloudId()) };


    // ======================= Cloud User Properties =========================

    function getCloudUserProperty(userId, property) {
        userId = userId || Meteor.userId();
        var cloudUser = CloudUsers.findOne({ userId: userId, cloudId: self.cloudId() });
        return cloudUser && cloudUser[property];
    };

    self.isOwner = function(userId) {
        return !! getCloudUserProperty(userId, 'isOwner');
    };

    self.isAdmin = function(userId) {
        return !! getCloudUserProperty(userId, 'isAdmin');
    };

    self.isOutput = function(userId) {
        return !! getCloudUserProperty(userId, 'isOutput');
    };

    self.isBanned = function(userId) {
        return !! getCloudUserProperty(userId, 'isBanned');
    };

    self.isCurrentUser = function(userId) {
        return userId == Meteor.userId();
    };
    


    // ======================= User Properties =========================

    function getUserProfileProperty(userId, property) {
        userId = userId || Meteor.userId();
        var user = Meteor.users.findOne(userId);
        if (!user) console.log('WARNING - No user found with id:', userId, property);
        return user && user['profile'][property];
    };

    self.userSongVotes = function(userId) {
        return getUserProfileProperty(userId, 'songVotes');
    }

    self.usersCurrentCloudId = function(userId) {
        return getUserProfileProperty(userId, 'currentCloudId');
    }



    // ======================= Client Only =========================

    if (Meteor.isClient) {
        var IS_ENSURING_USER = 'isEnsuringUser';
        Session.set(IS_ENSURING_USER, true);

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



        self.songQueue = function() {
            var query = { _id: { $ne: App.cloud().nowPlayingSongId }, isQueued: true };
            var sort  = { sort: { voteCount: -1, priority: 1, timeQueued: 1 } };
            return Songs.find(query, sort);
        };

        self.anySongsQueued = function() {
            return Songs.find({ isQueued: true }).count() > 0;
        };

        self.isEnsuringUser = function() {
            return Session.get(IS_ENSURING_USER);
        };

        self.stopEnsuringUser = function() {
            Session.set(IS_ENSURING_USER, false);
        };

        self.startEnsuringUser = function() {
            Session.set(IS_ENSURING_USER, true);
        };
    }
}