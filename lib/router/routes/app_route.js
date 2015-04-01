Router.route('/app/:cloudId', {
    name:             'app',
    controller:       'ApplicationController',
    waitOn:           getAppSubscriptions,
    data:             getCurrentCloud,
    onRerun:          upsertUserAndPrefsIntoCloud,
    onBeforeAction:   checkUserBanned,
    onStop:           unsetUserCurrentCloud
});


function getAppSubscriptions() {
    var cloudId = this.params.cloudId;
    return [ 
      Meteor.subscribe('cloud',       cloudId),
      Meteor.subscribe('songQueue',   cloudId),
      Meteor.subscribe('users',       cloudId),
      Meteor.subscribe('cloudUsers',  cloudId)
    ];
}

function getCurrentCloud() {
    return Clouds.findOne();
}

function upsertUserAndPrefsIntoCloud() {
    if (Meteor.userId()) {
        Meteor.call('setUserCloud', this.params.cloudId, function() {
            Meteor.call('ensureCloudUser');
            Meteor.call('upsertUserSongVotesIntoCloud');
        });
    }
    this.next();
}

function checkUserBanned() {
    if (App.isBanned()) {
        Meteor.call('setUserCloud', '');
        this.render('kicked');
    } else {
        this.next();
    } 
}

function unsetUserCurrentCloud() {
    Meteor.call('setUserCloud', '');
}