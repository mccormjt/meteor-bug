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

            var userName = this.queryParams.user;
            var password = this.queryParams.password;


            var startDateSplit = startDate.split("-");
            var endDateSplit = endDate.split("-");

            var start = new Date();
            var startYear = startDateSplit[2].trim();
            var startMonth = startDateSplit[0].trim() - 1;
            var startDay = startDateSplit[1].trim();
            start.setFullYear(startYear, startMonth, startDay);

            var end = new Date();
            var endYear = endDateSplit[2].trim();
            var endMonth = endDateSplit[0].trim() - 1;
            var endDay = endDateSplit[1].trim();
            end.setFullYear(endYear, endMonth, endDay);
            var users = Meteor.users.find({
                'createdAt': {
                    $gte: new Date(start),
                    $lt: new Date(end)
                }
            }).fetch();

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


            if (totalUsers > 0) {
                return {
                    status: 'success',
                    totalUsers: totalUsers,
                    tempUsers: tempUsers,
                    loggedUsers: loggedUsers
                };
            }
            return {
                status: 'failure',
                message: 'no users found'
            };

        }
    });
});