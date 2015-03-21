var requestPermissions = { requestPermissions: ['email'] };

Template.login.events({
    'click .fa-facebook-square': loginWithFacebook,
    'click .fa-twitter-square':  loginWithTwitter
});


function loginWithFacebook() {
    loginWith(Meteor.loginWithFacebook);
}

function loginWithTwitter() {
    loginWith(Meteor.loginWithTwitter);
}

function loginWith(loginFn) {
    App.stopEnsuringUser();
    loginFn(requestPermissions, App.stopEnsuringUser);
}