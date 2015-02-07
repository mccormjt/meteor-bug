document.addEventListener('deviceready', function () {
	Tracker.autorun ( function(comp) {
		if (!Meteor.isCordova) {
			return comp.stop();	
		} else if (App.isOutput()) {
      		// Android customization
      		cordova.plugins.backgroundMode.setDefaults({ text:'CrowdPlay Running'});
      		cordova.plugins.backgroundMode.enable();
    	} else {
    		cordova.plugins.backgroundMode.disable();
    	}
	});
}, false);

Meteor.methods({
    disableInactiveCloudBackgroundMode: disableInactiveCloudBackgroundMode
});

function disableInactiveCloudBackgroundMode(olderThanHours){
	if (Time.isCloudActive(olderThanHours)){
		cordova.plugins.backgroundMode.disable();
	}
}
