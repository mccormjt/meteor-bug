Router.configure({
	layoutTemplate: 'layout',
    waitOn: function() { return Meteor.subscribe('lock') }
});

Router.plugin('dataNotFound', { notFoundTemplate: 'notFound' });


Router.route('/', { name: 'home' });

Router.route('/app/:cloudId', {
    name: 'app',

    waitOn: function() {
        return [ 
          Meteor.subscribe('cloud', this.params.cloudId),
          Meteor.subscribe('songQueue', this.params.cloudId)
        ];
    },

    data: function() {
        return Clouds.findOne();
    }
});


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