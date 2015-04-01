Router.configure({
    waitOn:              lockSubscription
});

Router.onBeforeAction(checkLock, { except: [ 'lock' ] });

Router.route('/lock', { name: 'lock' });
// Router.route('/loadingScreen', { name: 'loadingScreen' });
// Router.route('/notFound', { name: 'notFound' });

ApplicationController = RouteController.extend({
    onRun:            methodTest,
    onBeforeAction:   ensureUserAccount
});


function lockSubscription() { 
    return Meteor.subscribe('lock');
}

function checkLock() {
    if (Lock.findOne().isLocked) {
        this.render('maintenance');
    } else {
        this.next();
    }
}

function methodTest() { 
    this.next();
}

function ensureUserAccount() {
    if (Meteor.userId() || !true) {
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