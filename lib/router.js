Router.configure({
	layoutTemplate: 'layout'
});

Router.plugin('dataNotFound', { notFoundTemplate: 'notFound' });


Router.route('/', { name: 'home' });

Router.route('/app/:cloudId', {
    name: 'app',

    waitOn: function() {
        return Meteor.subscribe('cloud', this.params.cloudId);
    },

    data: function() {
        return Clouds.find({ _id: this.params.cloudId }).fetch()[0];
    }
});