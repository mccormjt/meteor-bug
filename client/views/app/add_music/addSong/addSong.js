Template.addSong.helpers({
    inQueueClass: inQueueClass
});

Template.addSong.events({
    'click .queue-status:not(.in-queue .queue-status)': queueSong
});

function inQueueClass() {
    var guid = Songs.createSongGuid(this.songName, this.artistName);
    return Songs.isQueued(guid) ? 'in-queue' : '';
}

function queueSong(event) {
    var groovesharkSongId = this.songID || this.groovesharkSongId;
    Meteor.call('queueSong', this.songName, this.artistName, groovesharkSongId, App.getUserSongPriority());
}