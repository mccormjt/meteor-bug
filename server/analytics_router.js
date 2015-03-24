// API must be configured and built after startup!
Meteor.startup(function () {

    // Global configuration
    Restivus.configure({
        useAuth: false,
        prettyJson: true
    });

    Restivus.addRoute('userstats', {
        get: function () {
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var startDate = this.queryParams.start;
            var endDate = this.queryParams.end

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

            var userData = [];
            var tempUserData = [];
            var loggedUserData = [];
            var accumUsersData = [];
            var labels = [];

            while (start < end) {

                var newEnd = new Date();
                newEnd.setDate(start.getDate() + 7);

                labels.push(start.getDate() + " " + monthNames[start.getMonth()] + " " + start.getFullYear());

                var users = Meteor.users.find({
                    'createdAt': {
                        $gte: new Date(start),
                        $lt: new Date(newEnd)
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

                userData.push(totalUsers);
                tempUserData.push(tempUsers);
                loggedUserData.push(loggedUsers);

                if (accumUsersData.length == 0) {
                    accumUsersData.push(totalUsers);
                } else {
                    var acc = accumUsersData[accumUsersData.length - 1];
                    acc = acc + totalUsers;
                    accumUsersData.push(acc);
                }

                start.setDate(start.getDate() + 7);
            }

            return {
                status: 'success',
                totalUsers: userData,
                tempUsers: tempUserData,
                loggedUsers: loggedUserData,
                accTotalUsers: accumUsersData,
                labels: labels
            };


        }
    });
});