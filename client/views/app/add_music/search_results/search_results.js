var ACTIVE_CLASS = 'active';

Template.searchResults.helpers({
    isActiveClass:  isActiveClass,
    songResults:    getSearchResults,
    hasNoResults:   hasNoResults
});

function isActiveClass() {
    return $('.search-songs-mode').hasClass(ACTIVE_CLASS) && ACTIVE_CLASS;
}

function getSearchResults() {
    return Session.get('songSearchResults');
}

function hasNoResults() {
    var results = getSearchResults();
    return results && results.length;
}