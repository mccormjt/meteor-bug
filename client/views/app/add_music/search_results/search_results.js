Template.searchResults.helpers({
    songResults:  getSearchResults,
    hasNoResults: hasNoResults
});

function getSearchResults() {
    return Session.get('songSearchResults');
}

function hasNoResults() {
    var results = getSearchResults();
    return results && results.length;
}