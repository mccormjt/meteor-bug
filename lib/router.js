Router.configure({
	layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function() { return Meteor.subscribe('lock') },
    onRun:  function() { runGoogleAnalyticsForCurrentPage(); this.next() }
});

Router.plugin('dataNotFound', { notFoundTemplate: 'notFound' });

Router.route('/', { name: 'home' });
// Router.route('/loading', { name: 'loading' });
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
        var shouldRun = !this.AlreadyRun && Meteor.user();
            
        if (shouldRun) {
            this.AlreadyRun = true;
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
            this.render('notFound');
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
    var self = this;
    if (!Meteor.user()) {
        Meteor.call('createTempUser', function(error, user) {
            Meteor.loginWithPassword(user.email, user.password);
        });
        this.render('loading');
    } else {
        self.next();
    }
}
// ==========================================================



// =================== BASIC AUTH LOCKING ===================
Router.route('/lock', { name: 'lock' });
Router.onBeforeAction(checkLock, { except: [ 'lock' ] });

function checkLock() {
    if (Lock.findOne().isLocked) {
        this.render('notFound');
    } else {
        this.next();
    }
}

if (Meteor.isServer) {
    var basicAuth = new HttpBasicAuth("admin0", "musicMon!");
    basicAuth.protect(['/lock']);
}
// =========================================================