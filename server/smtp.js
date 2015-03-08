var siteEmailAddress = 'crowdplay.fm@gmail.com';

Meteor.startup(function () {
    smtp = {
        username: 'crowdplay.fm',
        password: 'mus!cJammer36$!',
        server:   'smtp.gmail.com',
        port: 465
    }

    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});


Meteor.methods({
    sendFeedbackEmail: sendFeedbackEmail
});


function sendFeedbackEmail(subject, message) {
    var isValidArgs = Match.test(subject, String) && Match.test(message, String);
    if (!isValidArgs) return;
    this.unblock();

    Email.send({
        from: siteEmailAddress,
        to: siteEmailAddress,
        subject: subject,
        text: message
    });
}