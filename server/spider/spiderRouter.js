/**
 * Created by ge on 3/18/14.
 */
"use strict";
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['express', 'http', 'mongoose', 'passport', 'path', 'less-middleware', 'underscore'],
    function (express, http, mongoose, passport, path, lessMiddleware, _) {
        var allowedUrls = [
                '^/questions/?$',
                '^/questions/\\w+$'];
        var config = {
            hostname : '127.0.0.1',
            port : 80,
            urlRegExp: new RegExp(allowedUrls.join('|'))
        };

        var agentString = 'Baiduspider|Googlebot|BingBot|Slurp!|MSNBot|YoudaoBot|JikeSpider|Sosospider|360Spider|Sogou web spider|Sogou inst spider';
        var uaRegEx = new RegExp(agentString);

        var botViewApp = function(req, res, next){

//            console.log('botView middleware is working');
//            console.log(req.headers["user-agent"]);
//            console.log('testing user agent')
//            console.log(uaRegEx.test(req.headers["user-agent"]));
            if (uaRegEx.test(req.headers["user-agent"]) || req.url==="/spider") {
                console.log('request being rerouted as search engine spider')
//                res.send({
//                    spiderRouter: "this works!!"
//                });
                var query = {
                    hostname: "127.0.0.1",
                    port: parseInt(process.env.PORT),
                    agent: false
                };
                if (config.urlRegExp.test(req.url)) {
                    console.log('request path is allowed for spider')
                    query.path = "/spider" + req.url;
                } else {
                    return res.send(404);
                }
                console.log('query')
                console.log(query)
                console.log(req.headers['user-agent'] + ' is intercepted by spiderRouter middleware');
                var data = '';
                http.get(
                    query,
                    function(response) {
                        response.on('data', function(chunk){
                            data += chunk;
//                            console.log(chunk);
                        });
                        response.on('end', function() {
                            console.log(data);
                            res.send(data);
                        });
                    },
                    function(res, error) {
                    }
                );
            } else {
                next();
            }
        }
        return botViewApp;
    });
