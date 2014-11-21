var VIEWPORT = 'viewport';

Template.layout.helpers({
  viewport: function() { return Session.get(VIEWPORT) || 1 }
});

Template.layout.rendered = function() {  Session.set(VIEWPORT, viewportSize()) };

function viewportSize() {
  var width           = $(window).width(),
      viewportRatio   = 0.002,
      viewportScale   = width * viewportRatio,
      roundedScale    = Math.round(viewportScale * 100) / 100;
  return Math.min(roundedScale, 1);
}