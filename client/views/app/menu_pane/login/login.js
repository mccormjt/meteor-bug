Template.login.events({
    'click .fa-facebook-square': loginWithFacebook,
    'click .fa-twitter-square':  loginWithTwitter
});


function loginWithFacebook() {
    App.stopEnsuringUser();
    Meteor.loginWithFacebook({}, App.startEnsuringUser);
}

function loginWithTwitter() {
    App.stopEnsuringUser();
    Meteor.loginWithTwitter({}, App.startEnsuringUser);
}