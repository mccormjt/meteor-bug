Router.configure({
	layoutTemplate: 'layout'
});

Router.plugin('dataNotFound', { notFoundTemplate: 'notFound' });


Router.route('/', { name: 'home' });

Router.route('/app/:cloudId', {
    name: 'app',

    waitOn: function() {
        return [ 
          Meteor.subscribe('cloud', this.params.cloudId),
          Meteor.subscribe('songQueue', this.params.cloudId)
        ];
    },

    data: function() {
        return Clouds.findOne();
    }
});