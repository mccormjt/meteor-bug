var SORT_OPTION = 'sortOption';

Template.usersPane.created = function() {
    Session.set(SORT_OPTION, '');
};

Template.usersPane.helpers({
    contributors: getSortedContributors
});

Template.usersPane.events({
    'change select': changeSortOption
});


function getSortedContributors() {
    var sortOption               = Session.get(SORT_OPTION),
        contributors             = CloudUsers.find().map(addKarmaToUser),
        karmaSortedContributors  = _.sortBy(contributors, sortOptionExtractor('karma')),
        fullySortedContributors  = sortOption && _.sortBy(karmaSortedContributors, sortOptionExtractor(sortOption));
    return fullySortedContributors || karmaSortedContributors;
}


function addKarmaToUser(cloudUser) {
    cloudUser['karma'] = calculateKarma(cloudUser);
    return cloudUser;
}


function calculateKarma(cloudUser) {
    var karma = cloudUser.voteScore;
    Songs.find({ isQueued: true, addedByUserId: cloudUser.userId }).forEach(function(song) {
        karma += Songs.voteCountFor(song);
    });
    return karma;
}


function changeSortOption(event) {
    var selectVal = $(event.target).val();
    Session.set(SORT_OPTION, selectVal);
}


function sortOptionExtractor(option) {
    return function(cloudUser) {
        var val = cloudUser[option];
        if (Match.test(val, Number )) return -val;
        if (Match.test(val, Boolean)) return !val;
        return val;
    }
}