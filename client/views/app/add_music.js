Template.addMusic.events({
  'click h4': toggleAddMusicPane
});


function toggleAddMusicPane(event, template) {
  $('.add-music').toggleClass('active');
}