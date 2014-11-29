var SORT_OPTION = 'sortOption';

Template.usersPane.created = function() {
  Session.set(SORT_OPTION, {});
};

Template.usersPane.helpers({
  contributors: getContributors
});

Template.usersPane.events({
  'change select': changeSortOption
});

function getContributors() {
  var sortOptions = { voteScore: -1 };
  sortOptions = _.extend(Session.get(SORT_OPTION), sortOptions); 
  return CloudUsers.find({}, { sort: sortOptions }).fetch();
}

function changeSortOption(event) {
  var newOption = {},
      selectVal = $(event.target).val();
  newOption[selectVal] = -1;
  Session.set(SORT_OPTION, newOption);
}