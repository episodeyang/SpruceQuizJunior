/**
 * @module MailerCtrl
 * @name mailer
 */
'use strict';
define(['../models/SchemaModels', 'nodemailer', './login'],
    function (SchemaModels, nodemailer, login) {

        var UserM = SchemaModels.User;

        var smtpTransport = nodemailer.createTransport('SMTP', login);

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
            register: function (user) {
                var query = {
                    username: user.username
                }
                var email = {
                    from: logins.auth.user,
                    to: user.email,
                    subject: '欢迎来到难题夹子！',
                    text: "亲爱的" + user.name + "，欢迎来到难题夹子！",
                    html: "<h3> 欢迎来到难题夹子！</h3><div>请点击<button>这里</button>激活你的账号！</div>"
                };
                console.log('email content');
                console.log(email);
                smtpTransport.sendMail(email, function (error, response) {
                    if (error) {
                        console.log(error);
                    } else {
//                        console.log('response from email server')
                        console.log(response)
//                        console.log('emailed ' + query.username + " " + email.to)
                    }
                })
            },
            passwordReset: function (req, res, next) {
                console.log(req.username + 'wants to reset password')
            }
        };
    }
);

