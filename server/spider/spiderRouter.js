/**
 * Created by ge on 3/18/14.
 */
"use strict";
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['express', 'http', 'mongoose', 'passport', 'path', 'less-middleware'],
    function (express, http, mongoose, passport, path, lessMiddleware) {
        var config = {
            spiderServer : 'www.nantijiazi.com',
            spiderPort: 80,
            spiderUrls: ['/spider/questions/sdfasd',]
        };

        var agentString = 'Baiduspider|Googlebot|BingBot|Slurp!|MSNBot|YoudaoBot|JikeSpider|Sosospider|360Spider|Sogou web spider|Sogou inst spider';
        var uaRegEx = new RegExp(agentString);

        var botViewApp = function(req, res, next){
//            console.log('botView middleware is working');
//            console.log(req.headers["user-agent"]);
//            console.log('testing user agent')
//            console.log(uaRegEx.test(req.headers["user-agent"]));
            if (uaRegEx.test(req.headers["user-agent"]) || req.url==="/spider") {
//                res.send({
//                    spiderRouter: "this works!!"
//                });
                var query = 'http://127.0.0.1:8001/spider/questions/asdfas'
//                {
//                    host: config.spiderServer,
//                    port: config.spiderPort,
//                    path: config.spiderUrls[0]
//                };
                console.log(req.headers['user-agent'] + ' is intercepted by spiderRouter middleware');
                var data = ''
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
