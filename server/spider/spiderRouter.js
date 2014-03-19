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
            botServer : 'localhost:4800',
            botUrls : ['/searchEngine/questions',]
        };

        var agentString = 'Baiduspider|Googlebot|BingBot|Slurp!|MSNBot|YoudaoBot|JikeSpider|Sosospider|360Spider|Sogou web spider|Sogou inst spider';
        var uaRegEx = new RegExp(agentString);

        var botViewApp = function(req, res, next){
//            console.log('botView middleware is working');
            if (uaRegEx.test(req.useragent) || req.url==="/spider") {
                res.send({
                    spiderRounter: "this works!!"
                });
                console.log('botView middleware is routing');
//                http.get(
//                    config.botServer + '/' + config.botUrls[0],
//                    function(res) {
//                        res.send(res);
//                    },
//                    function(res, error) {
//                    }
//                );
            }
//            next();
        }
        return botViewApp;
    });
