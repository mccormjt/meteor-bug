console.log('Here');
//if (Meteor.isServer) {



// API must be configured and built after startup!
Meteor.startup(function () {

    // Global configuration
    Restivus.configure({
        useAuth: false,
        prettyJson: true
    });

    Restivus.addRoute('userstats', {
        get: function () {
            var startDate = this.queryParams.start;
            var endDate = this.queryParams.end;

            var startDateSplit = startDate.split("-");
            var endDateSplit = endDate.split("-");

            var start = new Date();
            start.setFullYear(startDateSplit[2].trim(), startDateSplit[0].trim(), startDateSplit[1].trim());

            var end = new Date();
            end.setFullYear(endDateSplit[2].trim(), endDateSplit[0].trim(), endDateSplit[1].trim());

            var users = Meteor.users.find({
                'createdAt': {
                    $gte: start,
                    $lte: end
                }
            });

            var totalUsers = 0;
            var tempUsers = 0;
            var loggedUsers = 0;

            for (var i = 0; i < users.length; i++) {
                var user = users[i];

                totalUsers++;
                if (user.profile.isTempUser) {
                    tempUsers++;
                } else {
                    loggedUsers++;
                }
            }


            if (totalUsers) {
                return {
                    status: 'success',
                    totalUsers: totalUsers,
                    tempUsers: tempUsers,
                    loggedUsers: loggedUsers
                };
            }
            return {
                status: 'failure'
            };
        }
    });
});
//}