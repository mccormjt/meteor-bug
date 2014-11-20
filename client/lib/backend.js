Backend = new function () {
    var self = this;

    self.getQueryResultsFromGrooveShark = function (query, callback) {
        var getUrl = '//grooveshark.cloudlist.fm/search?q=' + query;
        return $.getJSON(getUrl, callback);
    };

    self.getGrooveSharkStreamingUrl = function (songID, callback, failFn) {
        var getUrl = '//grooveshark.cloudlist.fm/stream/' + songID;
        return $.getJSON(getUrl, callback).fail(failFn);
    };

    self.getCurrentLocation = function() {
        return $.getJSON('http://ip-api.com/json/');
    }
};