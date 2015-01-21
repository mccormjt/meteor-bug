Template.layout.rendered = function() {
  $('head').prepend(generateViewPortTag(viewportSize()));
};

function viewportSize() {
  var width           = $(window).width(),
      viewportRatio   = 0.002,
      viewportScale   = width * viewportRatio,
      roundedScale    = Math.round(viewportScale * 100) / 100;
  return Math.min(roundedScale, 1);
}

function generateViewPortTag(viewportSize) {
  return '<meta name="viewport" content="user-scalable=no,'
          + 'initial-scale=' + viewportSize + ','
          + 'maximum-scale=' + viewportSize + ','
          + 'minimum-scale=' + viewportSize + ','
          + 'width=device-width, height=device-height, target-densitydpi=device-dpi"/>';
}