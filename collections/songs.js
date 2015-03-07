Songs = new Meteor.Collection('songs');
if (Meteor.isServer) { 
    Songs._ensureIndex({ cloudId: 1, guid: 1 }, { unique: true });
    Songs._ensureIndex({ cloudId: 1 });
}

Meteor.methods({
    voteForCloudSong: voteForCloudSong,
    upsertUserSongVotesIntoCloud: upsertUserSongVotesIntoCloud,
    queueSong:   queueSong,
    unqueueSong: unqueueSong,
    skipNowPlayingSong: skipNowPlayingSong
});


Songs.createSongGuid = function(songName, artistName) {
    return (songName + '@' + artistName).replace(/[\. ,:-]+/g, '').toLowerCase();
}

Songs.voteCountFor = function(song) {
    var votes = _.values(song.userVotes);
    return _.reduce(votes, function(total, vote){ return total + vote }, 0);
};

Songs.comparator = function(s1, s2) {
    var voteCountS1 = Songs.voteCountFor(s1);
    var voteCountS2 = Songs.voteCountFor(s2);

    if (voteCountS1 != voteCountS2) {
        return voteCountS1 > voteCountS2 ? -1 : 1;
    } 
    else if (s1.priority != s2.priority) {
        return s1.priority > s2.priority ? 1 : -1;
    } 
    else if (s1.timeQueued != s2.timeQueued) {
        return s1.timeQueued > s2.timeQueued ? 1 : -1;
    } 
    else {
        return 0;
    }
};


function findOrCreateSong(songName, artistName, groovesharkSongId) {
    check(songName, String);
    check(artistName, String);
    check(groovesharkSongId, Match.OneOf(String, Number));

    var guid = Songs.createSongGuid(songName, artistName);
    var song = findCloudSong(guid);

    if (!song) {
        song = { guid: guid, songName: songName, artistName: artistName, isQueued: false, priority: 0,
                  timeQueued: null, groovesharkSongId: groovesharkSongId, cloudId: App.cloudId(), userVotes: {} };
        song._id = Songs.insert(song);
    }
    return song;
}


function skipNowPlayingSong() {
    var nowPlayingSongId = App.cloud().nowPlayingSongId;
    if (!nowPlayingSongId) return;
    unqueueSong(nowPlayingSongId);
    Clouds.update({ _id: App.cloudId() }, { $set: { nowPlayingSongId: '' } });
}


function setIsQueued(songId, isQueued, priority, addedByUserId) {
    check(songId, String);
    check(isQueued, Boolean);
    check(addedByUserId, String);
    var songParams = { isQueued: isQueued, addedByUserId: addedByUserId, priority: priority };
    isQueued && _.extend(songParams, { timeQueued: Date.now() });
    Songs.update({ _id: songId }, { $set: songParams });
    Meteor.call('updateCloudActiveness');
}


function queueSong(songName, artistName, groovesharkSongId, priority) {
    var song = findOrCreateSong(songName, artistName, groovesharkSongId);
    voteForCloudSong(song.guid, 1);
    Meteor.call('upsertUserSongVote', song, 1);
    Meteor.call('incNumSongsAddedForCloudUser');
    setIsQueued(song._id, true, priority, Meteor.userId());
}


function unqueueSong(songId) {
    var song = Songs.findOne(songId);
    CloudUsers.update({ userId: song.addedByUserId, cloudId: App.cloudId() }, { $inc: { voteScore: Songs.voteCountFor(song) } }) 
    setIsQueued(songId, false, 0, '');
}


function voteForCloudSong(guid, newVote) {
    check(guid, String);
    check(newVote, Match.OneOf(1, 0, -1));

    var userVote     = {},
        songQuery    = { cloudId: App.cloudId(), guid: guid };

    userVote['userVotes.' + Meteor.userId()] = newVote;
    Songs.update(songQuery, { $set: userVote });
}


function upsertUserSongVotesIntoCloud() {
    _.each(App.userSongVotes(), function(song) {
        var cloudSong = findOrCreateSong(song.songName, song.artistName, song.groovesharkSongId);
        voteForCloudSong(cloudSong.guid, song.vote);
    });
}


function findCloudSong(guid) {
    return Songs.findOne({ cloudId: App.cloudId(), guid: guid });
}