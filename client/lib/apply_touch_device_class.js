Meteor.startup(function() {
    $(document).ready(function() {
        var isTouchDevice = 'ontouchstart' in document;
        $('body').toggleClass('no-touch', !isTouchDevice);
    });
});