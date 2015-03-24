Router.configure({
	layoutTemplate:   'layout',
    loadingTemplate:  'loadingScreen',
    notFoundTemplate: 'notFound',
    waitOn:           function() { return Meteor.subscribe('lock') }
});

Router.plugin('dataNotFound', { notFoundTemplate: 'notFound' });

Router.route('/', { name: 'home' });
// Router.route('/loadingScreen', { name: 'loadingScreen' });
// Router.route('/notFound', { name: 'notFound' });

Router.route('/app/:cloudId', {
    name: 'app',

    waitOn: function() {
        var cloudId = this.params.cloudId;
        return [ 
          Meteor.subscribe('cloud',       cloudId),
          Meteor.subscribe('songQueue',   cloudId),
          Meteor.subscribe('users',       cloudId),
          Meteor.subscribe('cloudUsers',  cloudId)
        ];
    },

    data: function() {
        return Clouds.findOne();
    },

    onRerun: function() {           
        if (Meteor.userId()) {
            Meteor.call('setUserCloud', this.params.cloudId, function() {
                Meteor.call('ensureCloudUser');
                Meteor.call('upsertUserSongVotesIntoCloud');
            });
        }
        this.next();
    },

    onBeforeAction: function() {
        if (App.isBanned()) {
            Meteor.call('setUserCloud', '');
            this.render('kicked');
        } else {
            this.next();
        } 
    },

    onStop: function() {
        Meteor.call('setUserCloud', '');
    }
});

// =================== Accounts Hook ========================
Router.onBeforeAction(ensureUserAccount);
function ensureUserAccount() {
    if (Meteor.userId() || !App.isEnsuringUser()) {
        this.next();
    } else if (Meteor.loggingIn()) {
        this.render('loadingScreen');
    } else {
        Meteor.call('createTempUser', function(error, user) {
            Meteor.loginWithPassword(user.email, user.password);
        });
        this.render('loadingScreen');
    } 
}
// ==========================================================



// =================== BASIC AUTH LOCKING ===================
Router.route('/lock', { name: 'lock' });
Router.onBeforeAction(checkLock, { except: [ 'lock' ] });

function checkLock() {
    if (Lock.findOne().isLocked) {
        this.render('maintenance');
    } else {
        this.next();
    }
}
// =========================================================