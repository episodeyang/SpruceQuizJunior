/**
 * @module MailerCtrl
 * @name mailer
 */
'use strict';
define(['underscore', 'module', 'nodemailer', 'email-templates', 'path', './logins', '../models/SchemaModels' ],
    function (_, module, nodemailer, emailTemplates, path, logins, SchemaModels) {

        var UserM = SchemaModels.User;
        var templatesDir = path.resolve(path.dirname(module.uri) + '/templates');
        var smtpTransport = nodemailer.createTransport('SMTP', logins);

        function Mailer () {
            var _this = this;
            this.callbacks = {}
            this.rendered = function (callback) {
                _this.callbacks.rendered = callback;
            };
            this.response = function (callback) {
                _this.callbacks.response = callback;
            };
            this.render = function (templateString, locals) {
                emailTemplates(
                    templatesDir,
                    function (err, template) {
                        if (err) {
                            console.log('email template compiler error');
                            console.log(err);
                        };
                        template(
                            templateString,
                            locals,
                            function (err, html, text) {
                                if (err) {
                                    console.log('email template error', err);
                                }
                                _this.callbacks.rendered(err, html, text);
                            });
                    }
                )
                return this;
            };
            this.send = function (email) {
                _this.callbacks.rendered = function (err, html, text) {
                    if (err) { console.log(this.err); }
                    email.html = html;
                    email.text = text;
                    smtpTransport.sendMail(email, function (error, response) {
                        if (error) { console.log(error); }
                        if (response.message && response.messageId) {
                            _this.callbacks.response(error, response);
                        }
                    });
                };
                return this;
            };
            return this;
        };

        var mailer = new Mailer()

        var mailer_extended_functions = {
            /**
             * @name register
             * @function
             * @param user
             * @param user.username
             * @param user.email
             * @param user.name
             * @returns email server response
             */
            register: function (recipient, locals, callback) {
                var email = {
                    from: logins.auth.user,
                    to: recipient,
                    subject: '欢迎来到难题夹子！',
                    generateTextFromHTML: true
                };

                if (locals.subnet) {
                    locals.subnet += '.';
                };

//                function setEmailSentFlag () {
//                    var query = {
//                        username: user.username
//                    };
//                    //TODO: set the flag in user entry
//                    console.log('set the "confirmation email sent" flag in database');
//                }
                mailer.render('emailConfirmation', locals).send(email).response(callback);
            },
            passwordReset: function (user, callback) {
                console.log(req.username + 'wants to reset password');
                var locals = {
                    name: user.name,
                    subnet: ''
                };
                var email = {
                    from: logins.auth.user,
                    to: user.email,
                    subject: '重置密码 - 难题夹子账户',
                    generateTextFromHTML: true
                };
                mailer.render('resetPassword', locals).send(email).response(callback);
            }
        };

        return _.extend(mailer, mailer_extended_functions);
    }
)
;

