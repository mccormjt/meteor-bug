var backgroundModeInactivityCheckInterval,
    isBackgroundModeEnabled;

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
    var isEnabled           = cordova.plugins.backgroundMode.isEnabled();
    var hasNotChangedState  = isEnabled === isBackgroundModeEnabled;
    isBackgroundModeEnabled = isEnabled;

    if (hasNotChangedState) {
        return;
    }
    else if (App.isOutput()) {
        cordova.plugins.backgroundMode.setDefaults({ text:'CrowdPlay Running'}); // Android customization
        cordova.plugins.backgroundMode.enable();
        backgroundModeInactivityCheckInterval = setInterval(Util.wrapMeteorMethod('disableInactiveCloudBackgroundMode', 0.5), Time.hoursToMiliseconds(0.09));
    } else {
        clearInterval(backgroundModeInactivityCheckInterval);
        cordova.plugins.backgroundMode.disable();
    }
}

function disableInactiveCloudBackgroundMode(maxHoursOfInactivity){
    var isCloudInactive = Time.isOlderThan(App.cloud().lastActiveAt, maxHoursOfInactivity);
    isCloudInactive && cordova.plugins.backgroundMode.disable();
}