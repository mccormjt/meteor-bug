Time = new function() {
	var self = this;

	self.hoursToMiliseconds = function(hours) {
    	return hours * 60 * 60 * 1000;
    };

	function isCloudOlderThan(olderThanHours){
		var earliestTime  = Date.now() - self.hoursToMiliseconds(olderThanHours),
        lastActiveTime    = App.cloud().lastActiveAt;
        return lastActiveTime <= earliestTime;
	}

	self.isCloudActive = function(olderThanHours) {
        return isCloudOlderThan(olderThanHours);
    };
}