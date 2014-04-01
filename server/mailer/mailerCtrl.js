/**
 * @module MailerCtrl
 * @name mailer
 */
'use strict';
define(['underscore', '../models/SchemaModels', './mailer', './logins' ],
    function (_, SchemaModels, mailer, logins) {

        var UserM = SchemaModels.User;

        var register = mailer.register;
        var passwordReset = mailer.passwordReset;

        return {
            /**
             * @name register
             * @function
             * @param user
             * @param user.username
             * @param user.email
             * @param user.name
             * @returns email server response
             */
            get: function (req, res, next) {
                if (req.params.templateString == undefined) {
                    console.log('no templateString in request')
                    return res.send(400);
                }
                var locals = {};
                var locals = {};
                _.extend(locals, req.query);
                if (locals.subnet ) {
                    locals.subnet += '.';
                }

                mailer
                    .render(req.params.templateString, locals)
                    .rendered(
                        function (err, html, text) {
                            if (err) {
                                if (err.code == 'ENOENT') {
                                    console.log(err);
                                    return res.send(404, 'templateNameNotFound');
                                } else if (err == 'templateName was not defined') {
                                    console.log(err);
                                    return res.send(400, 'templateNameUndefined');
                                } else {
                                    console.log(err);
                                    return res.send(500, err);
                                };
                            }
                            res.send(200, html);
                        });
            },

            send: function (req, res, next) {
                if (req.params.templateString == undefined) {
                    console.log('no templateString in request')
                    return res.send(400);
                }
                var locals = {};
                locals.name = req.query.name || '杨歌';
                locals.username = req.query.username || 'episodeyang';
                locals.subnet = req.query.subnet + '.' || 'www.';
                locals.code = req.query.code || 'someActivationCodeHere';
                locals.dateTime = new Date()

                var email = {
                    from: logins.auth.user,
                    to: req.query.email,
                    subject: '欢迎来到难题夹子！',
                    generateTextFromHTML: true
                };

                mailer
                    .render(req.params.templateString, locals)
                    .send(email)
                    .response(
                        function (error, response) {
                            console.log(error)
                            console.log(response)
                            if (response.name == "RecipientError") {
                                return res.send(400, 'RecipientError:' + response);
                            }
                            res.send(200, response);
                        });
            },
        };
    }
);

