var backgroundModeInactivityCheck;

Meteor.startup(function setupBackgroundMode() {
    if (!Meteor.isCordova) return;
    Meteor.methods({
        disableInactiveCloudBackgroundMode: disableInactiveCloudBackgroundMode
    });
    document.addEventListener('deviceready', function() {
        Tracker.autorun(updateBackgroundModeState);
    });
});

function updateBackgroundModeState() {
    if (App.isOutput()) {
        cordova.plugins.backgroundMode.setDefaults({ text:'CrowdPlay Running'}); // Android customization
        cordova.plugins.backgroundMode.enable();
        backgroundModeInactivityCheck = setInterval(Util.wrapMeteorMethod('disableInactiveCloudBackgroundMode', 0.5), Time.hoursToMiliseconds(0.09));
    } else {
        clearInterval(backgroundModeInactivityCheck);
        cordova.plugins.backgroundMode.disable();
    }
}

function disableInactiveCloudBackgroundMode(maxHoursOfInactivity){
    var isCloudInactive = Time.isOlderThan(App.cloud().lastActiveAt, maxHoursOfInactivity);
    isCloudInactive && cordova.plugins.backgroundMode.disable();
}