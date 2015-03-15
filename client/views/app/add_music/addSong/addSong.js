Template.addSong.helpers({
  inQueueClass: inQueueClass
});

function inQueueClass() {
    var guid = Songs.createSongGuid(this.songName, this.artistName);
    return isQueued(guid) ? 'in-queue' : ''
}

function isQueued(guid) {
    return !! Songs.findOne({ guid: guid, isQueued: true });
}