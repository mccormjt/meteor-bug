Template.layout.rendered = function() {
  $('meta[name="viewport"]').attr('content', generateViewPortContent(viewportSize()));
};

function viewportSize() {
  var width           = $(window).width(),
      viewportRatio   = 0.002,
      viewportScale   = width * viewportRatio,
      roundedScale    = Math.round(viewportScale * 100) / 100;
  return Math.min(roundedScale, 1);
}

function generateViewPortContent(viewportSize) {
  return    'initial-scale=' + viewportSize + ', '
          + 'maximum-scale=' + viewportSize + ', '
          + 'minimum-scale=' + viewportSize + ', '
          + 'width=device-width, height=device-height, target-densitydpi=device-dpi';
}

document.addEventListener('deviceready', function () {
     // Android customization
    cordova.plugins.backgroundMode.setDefaults({ text:'CrowdPlay Running'});
    // Enable background mode
    cordova.plugins.backgroundMode.enable();
}, false);