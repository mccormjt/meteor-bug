var self;

Template.currentPlaylist.created = function() {
    self = this;
};

Template.currentPlaylist.helpers({
    cloud: App.cloud,
    contributorCount: contributorCount,
    songsQueuedCount: songsQueuedCount
});

Template.currentPlaylist.events({
    'click .invite-url > div': selectUrl
});


function contributorCount() {
    return CloudUsers.find().count();
}

function songsQueuedCount() {
    return Songs.find({ isQueued: true }).count();
}

function selectUrl(e) {
    Util.selectText(self.$('.invite-url span')[0]);
}