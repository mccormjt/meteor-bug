Time = new function() {
	var self = this;

	self.hoursToMiliseconds = function(hours) {
    	return hours * 60 * 60 * 1000;
    };

	self.isOlderThan = function(time, hoursOfAge) {
        var minAge = Date.now() - self.hoursToMiliseconds(olderThanHours);
        return time <= minAge;
    };
}