Template.songQueue.helpers({
  songQueue: App.songQueue
});

Template.songQueue.rendered = function() {
  var toggleAnimation = { height: 'toggle', opacity: 'toggle' };
  var hooks = {
    insertElement: function(node, next) {
      $(node).hide().insertBefore(next).animate(toggleAnimation, 300);
    },

    removeElement: function(node) {
      var $node = $(node);
      $node.animate(toggleAnimation, 300, function() {
        $node.remove();
      });
    }

  //   moveElement: function(node, next) {
  //     var $node         = $(node),
  //         nodeIndex     = $node.index(),
  //         nextNodeIndex = $(next).index(),
  //         hasChanged    = nodeIndex != (nextNodeIndex + 1);

  //         console.log('HERE', nodeIndex, nextNodeIndex, hasChanged);

  //     $node.animate(toggleAnimation, 300, function() {
  //       $node.detach();
  //       hooks.insertElement(node, next);
  //     });
  //   }
   };

  this.find('.song-queue-holder')._uihooks = hooks;
};
