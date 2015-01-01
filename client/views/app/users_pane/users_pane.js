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
      karmaSortedContributors  = _.sortBy(contributors, (function(user) { return -user.karma })),
      fullySortedContributors  = sortOption && _.sortBy(karmaSortedContributors, function(user) { return !user[sortOption] });
  return fullySortedContributors || karmaSortedContributors;
}


function addKarmaToUser(cloudUser) {
  cloudUser['karma'] = calculateKarma(cloudUser);
  return cloudUser;
}


function calculateKarma(cloudUser) {
  var karma = cloudUser.voteScore;
  Songs.find({ isQueued: true, addedByUserId: cloudUser.userId }).forEach(function(song) {
    karma += song.voteCount;
  });
  return karma;
}


function changeSortOption(event) {
  var selectVal = $(event.target).val();
  Session.set(SORT_OPTION, selectVal);
}











