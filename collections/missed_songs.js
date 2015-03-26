MissedSongs = new Meteor.Collection('missed_songs');

if (Meteor.isServer) {
    MissedSongs._ensureIndex({ groovesharkSongId: 1, count: 1 }, { unique: true });
    MissedSongs._ensureIndex({ groovesharkSongId: 1 }, { unique: true });

    Meteor.methods({
        reportMissedSong: reportMissedSong,
        filterOutMissedSongs: filterOutMissedSongs
    });
}

MissedSongs.filterOutMissedSongs = Util.wrapMeteorMethod("filterOutMissedSongs");
MissedSongs.reportMissedSong = Util.wrapMeteorMethod("reportMissedSong");

function reportMissedSong(groovesharkSongId) {
    check(groovesharkSongId, String);
    var query = { groovesharkSongId: groovesharkSongId };
    var modification = { $inc: { count: 1 } };
    var options = { upsert: true };

    MissedSongs.update(query, modification, options);
}

function filterOutMissedSongs(results) {
    var songs = _.filter(results, function (song) {
        var missedSong = MissedSongs.findOne({ groovesharkSongId: song.songID, count: { $gte: 2 } }, { });
        return !missedSong;
    });
    return songs;
}
