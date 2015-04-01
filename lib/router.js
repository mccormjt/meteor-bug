Router.configure({
    waitOn: lockSubscription
});

Router.onBeforeAction(checkLock, { except: [ 'lock' ] });

Router.route('/lock', { name: 'lock' });

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
    this.next();
}