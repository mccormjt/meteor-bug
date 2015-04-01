Router.route('/app/:cloudId', {
    name:             'app',
    controller:       'ApplicationController',
    waitOn:           getAppSubscriptions,
    data:             getCurrentCloud,
    onRerun:          upsertUserAndPrefsIntoCloud,
    onBeforeAction:   checkUserBanned
});


function getAppSubscriptions() {
    var cloudId = this.params.cloudId;
    return [ 
      Meteor.subscribe('songQueue',   cloudId),
      Meteor.subscribe('users',       cloudId),
      Meteor.subscribe('cloudUsers',  cloudId)
    ];
}

function getCurrentCloud() {
    return null;
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
    App.isBanned();
    this.next();
}