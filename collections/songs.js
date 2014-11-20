Songs = new Meteor.Collection('songs');
if (Meteor.isServer) { 
  Songs._ensureIndex({ cloudId: 1, groovesharkSongId: 1 }, { unique: true });
  Songs._ensureIndex({ cloudId: 1 });
}

Meteor.methods({

  insertSong: function(songName, artistName, groovesharkSongId, cloudId) {
    checkCloudExists(cloudId);
    check(songName, String);
    check(artistName, String);
    check(groovesharkSongId, String);
    return Songs.insert({ songName: songName, artistName: artistName, 
                          groovesharkSongId: groovesharkSongId, cloudId: cloudId });
  },

  removeSong: function(songId) {
    check(songId, String);
    Songs.remove({ _id: songId })
  }
});


function checkCloudExists(id) {
  check(id, String);
  return !! Clouds.findOne(id);
}