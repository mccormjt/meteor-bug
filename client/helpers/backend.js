Backend = new function () {
    var self = this;
    var path = 'http://johnthomasmccormack.com/HOST/cloudlist/';
   // var path = '../php/';

    self.postUpdateNowPlayingStateInDatabase = function (state, cloudId) {
        var postUrl = path + 'updateNowPlayingState.php';
        return $.post(postUrl, {nowPlayingState: state, cloudId: cloudId});
    };

    self.postUpdateNowPlayingSongInDatabase = function (nowPlayingSongId, cloudId) {
        var postUrl = path + 'updateNowPlayingSong.php';
        return $.post(postUrl, {nowPlayingSongId: nowPlayingSongId, cloudId: cloudId});
    };

    self.postRequestDeleteSongFromDatabase = function (id, callback) {
        var postUrl = path + 'removeSong.php';
        return $.post(postUrl, {id: id, cloudId: window.app.cloudId}, callback);
    };

    self.postRequestAddSongToDatabase = function (id, title, url, callback) {
        var postUrl = path + 'addSong.php',
            song = SongQueue.createSongObject(id, title, url, window.app.userIp);
        song.cloudId = window.app.cloudId;
        return $.post(postUrl, song, callback);
    };

    self.pullUpdatedCloudData = function (callback) {
        var getUrl = path + 'getCloudData.php?cloudId=' + window.app.cloudId;
        return $.getJSON(getUrl, callback);
    };

    self.getCloud = function(cloudID) {
        var getUrl = path + 'getCloud.php?cloudId=' + cloudID;
        return $.getJSON(getUrl);
    }

    self.skipSong = function (nowPlayingSongId, removeSongId, callback) {
        var postUrl = path + 'skipSong.php';
        return $.post(postUrl, {nowPlayingSongId: nowPlayingSongId, removeSongId: removeSongId, cloudId: window.app.cloudId}, callback);
    };

    self.postCreateCloud = function (name, lat, long, accuracy, isPublic) {
        var postUrl = path + 'createCloud.php';
        return $.post(postUrl, {name: name, latitude: lat, longitude: long, accuracy: accuracy, isPublic: isPublic}, null, 'json');
    };

    self.getNearClouds = function (lat, long, accuracy) {
        var getUrl = path + 'getNearClouds.php?latitude='+ lat + '&longitude=' + long + '&accuracy=' + accuracy;
        return $.getJSON(getUrl);
    };

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