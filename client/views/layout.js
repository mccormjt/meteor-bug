$('body').ready(setViewportMetaTag); 

function setViewportMetaTag() {
  var scale = viewportSize(),
      head  = $('head');
  $('<meta>', {
    name:         'viewport',
    content:      'user-scalable=no'
                  + ', initial-scale='  + scale
                  + ', maximum-scale='  + scale
                  + ', minimum-scale='  + scale
                  + ', width=device-width, height=device-height, target-densitydpi=device-dpi'
  }).appendTo(head);
}

function viewportSize() {
  var width           = $('body').width(),
      viewportRatio   = 0.002,
      viewportScale   = width * viewportRatio,
      roundedScale    = Math.round(viewportScale * 100) / 100;
      console.log('HERE', roundedScale);
  return Math.min(roundedScale, 1);
}