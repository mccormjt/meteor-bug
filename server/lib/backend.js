Backend = new function () {};

var self = Backend;

Meteor.methods({
    // initializeClient: initializeClient,
    getQueryResultsFromGrooveShark: getQueryResultsFromGrooveShark
});


function getQueryResultsFromGrooveShark(query) {
    var getUrl = 'http://grooveshark.cloudlist.fm/search';
    var res = HTTP.get(getUrl, {
        params: { q: query }
    });
    return MissedSongs.filterOutMissedSongs(res.data);

    // // Prototype of the Grooveshark V2 Client
    // var method = "getResultsFromSearch";
    // Util.log(self.client);

    // function createToken(method) {
    //     var rnd = Math.floor((1 + Math.random()) * 0x100000).toString(16);
    //     var salt = "gooeyFlubber";
    //     var plain = [method, self.client.communicationToken, salt, rnd].join(':');
    //     var hash = CryptoJS.SHA1(plain).toString();
    //     var token = "".concat(rnd, hash);
    //     Util.log("TOKEN: ", token);
    //     return token;
    // }

    // var token = createToken(method);
    // var header = {
    //     client: 'mobileshark',
    //     clientRevision: '20120803',
    //     country: self.client.country,
    //     privacy: 0,
    //     session: self.client.session,
    //     uuid: self.client.uuid
    // }

    // if (self.client.communicationToken) {
    //     header["token"] = token;
    // }

    // HTTP.get('http://grooveshark.com/more.php?getResultsFromSearch', {
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     data: {
    //         header: header,
    //         method: method,
    //         parameters: { type: "Songs", query: query }
    //     }
    // }, function (error, response) {
    //     if (error) {
    //         Util.log("Error searching songs:", error);
    //     } else {
    //         Util.log(response);
    //     }
    // });
};

// Client initializiation Grooveshark V2 API
// function initializeClient() {
//     if (self.client) {
//         return;
//     } else {
//         self.client = self.client || {};
//         HTTP.get("http://grooveshark.com/preload.php?getCommunicationToken=1&hash=%2f", {
//         }, function (error, response) {
//             if (error) {
//                 Util.log("Error reaching grooveshark:", error);
//             } else {
//                 var tokenDataString = response.content.match(/window.tokenData = (.*);/)[1];
//                 var tokenData = JSON.parse(tokenDataString);
//                 self.client.communicationToken = tokenData.getCommunicationToken;
//                 self.client.communicationTokenTTL = (new Date()).getTime();
//                 self.client.country = tokenData.getGSConfig.country;
//                 self.client.session = tokenData.getGSConfig.sessionID;
//                 self.client.uuid = Meteor.uuid();
//             }
//         });
//     }
// };
