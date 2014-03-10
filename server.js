/**
 * The API server for 学霸帮帮忙
 * author: Ge Yang
 * @type {*|boolean}
 */

//require('nodetime').profile({
//    accountKey: 'cb0835da7eb6304c00877ca11569df1ef72ebb10',
//    appName: 'SpruceQuizJunior'
//});

var requirejs = require('requirejs');
var config = {
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
    //Add baseUrl when needed.
    //Normally passed in through environment.
    //baseUrl: "/home/ge/projects/SpruceQuizJunior/"
}

if (process.env.baseUrl) {
    config.baseUrl = process.env.baseUrl;
};
if (process.env.baseUrl == undefined) {
    config.baseUrl = __dirname + '/';
};

console.log('server base url is:' + config.baseUrl);
requirejs.config(config);

requirejs(['http', './server/app'], function (http, app) {
    http.createServer(app).listen(app.get('port'), function () {
        console.log("Express server listening on port " + app.get('port'));
        console.log('http://localhost:' + app.get('port'));
    });
});

