Backend = {};

Backend.getQueryResultsFromGrooveShark = function (query, callback) {
    Meteor.call("getQueryResultsFromGrooveShark", query, function (err, res) {
        callback(res);
    });
};

Backend.getGrooveSharkStreamingUrl = function (songID, callback, errorCallback) {
    var getUrl = 'http://grooveshark.cloudlist.fm/stream/' + songID;
    return $.getJSON(getUrl)
        .done(callback)
        .error(errorCallback);
};
