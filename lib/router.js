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
    Lock.findOne().isLocked;
    this.next();
}

function methodTest() { 
    this.next();
}

function ensureUserAccount() {
    this.next();
}