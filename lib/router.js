Router.configure({
	layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function() { return Meteor.subscribe('lock') }
});

Router.plugin('dataNotFound', { notFoundTemplate: 'notFound' });

Router.route('/', { name: 'home' });
// Router.route('/loading', { name: 'loading' });
// Router.route('/notFound', { name: 'notFound' });

Router.route('/app/:cloudId', {
    name: 'app',

    waitOn: function() {
        return [ 
          Meteor.subscribe('cloud',       this.params.cloudId),
          Meteor.subscribe('songQueue',   this.params.cloudId),
          Meteor.subscribe('users',       this.params.cloudId),
          Meteor.subscribe('cloudUsers',  this.params.cloudId),
        ];
    },

    data: function() {
        return Clouds.findOne();
    },

    onBeforeAction: function() {
        App.isBanned() ? this.render('notFound') : this.next();
    },

    onRun: function() {
        Meteor.call('setCurrentUserCloud', this.params.cloudId);
        Meteor.call('ensureCurrentCloudUser', this.params.cloudId);
        this.next();
    },

    onStop: function() {
        Meteor.call('setCurrentUserCloud', '');
    }
});

// =================== Accounts Hook ========================
Router.onBeforeAction(ensureUserAccount);
function ensureUserAccount() {
    var self = this;
    if (!Meteor.user()) {
        self.stop();
        Meteor.call('createTempUser', function(error, user) {
            Meteor.loginWithPassword(user.email, user.password);
        });
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