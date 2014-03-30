/**
 * @module MailerCtrl
 * @name mailer
 */
'use strict';
define(['nodemailer', 'email-templates', 'path', './login', '../models/SchemaModels' ],
    function (nodemailer, emailTemplates, path, login, SchemaModels ) {

        var UserM = SchemaModels.User;
        var smtpTransport = nodemailer.createTransport('SMTP', login);
        //var templatesDir   = path.resolve(__dirname, './templates')
        var templatesDir   = path.resolve('./templates')
        function sendMail (templateString, locals, email, callback) {

            emailTemplates(
                templatesDir,
                function(err, template) {
                    if (err) { return console.log(err) };
                    template(
                        templateString,
                        locals,
                        function (err, html, text) {
                            if (err) { return console.log(err); }
                            email.html = html;
                            email.text = text;
                            smtpTransport.sendMail(email, function (error, response) {
                                if (error) { return console.log(error); }
                                if (response.message && response.messageId) {
                                    if (typeof callback != "undefined" ) { callback(); }
                                }
                            })
                        }
                    );
                }
            );
        }

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
            register: function (user, callback) {
                var locals = {
                    name: user.name,
                    subnet: ''
                };
                var email = {
                    from: logins.auth.user,
                    to: user.email,
                    subject: '欢迎来到难题夹子！',
                    generateTextFromHTML: true
                };
                function setEmailSentFlag () {
                    var query = {
                        username: user.username
                    };
                    //TODO: set the flag in user entry
                    console.log('set the "confirmation email sent" flag in database');
                }
                sendMail('emailConfirmation', locals, email, callback)
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
                sendMail('resetPassword', locals, email, callback)
            }
        };
    }
);

