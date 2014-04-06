/**
 * @module MailerCtrl
 * @name MailerCtrl
 */
'use strict';
define(['underscore', '../models/SchemaModels', './mailer', './logins', '../models/User' ],
    function (_, SchemaModels, mailer, logins, User) {

        return {
            /**
             * controller that renders the selected template
             * @name render
             * @function
             * @param req
             * @param req.query.templateString
             * @param res
             * @param {nextCallback} next
             * @returns {html} rendered html with inline css
             */
            render: function (req, res, next) {
                if (req.params.templateString === undefined) {
                    console.log('no templateString in request');
                    return res.send(400);
                }
                var locals = {};
                _.extend(locals, req.query);

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
                            }
                            ;
                        }
                        res.send(200, html);
                    });
            },

            /**
             * controller renders and sends email with the specified template
             * @name testSend
             * @function
             * @param req
             * @param req.query.templateString
             * @param res
             * @param {nextCallback} next
             * @returns {string} email server response
             */
            testSend: function (req, res, next) {
                if (req.params.templateString == undefined) {
                    console.log('no templateString in request')
                    return res.send(400);
                }
                var locals = {};
                _.extend(locals, req.query);

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

            activate: function (req, res, next) {
                var locals = {
                    domain: 'www.nantijiazi.com',
                    layout: 'templates/layout.jade',
                    title: '邮箱激活成功！',
                    message: '页面将会在2秒钟内跳转回到首页...'
                };

                function sendConfirmed(error, message) {
                    if (error == null) {
                        res.render('templates/activate.jade', locals);
                    }
                    if (error == "userDoesNotExist") {
                        locals.title = "用户不存在哦~";
                        res.render('templates/activate.jade', locals);
                    }
                    if (error == "emailAlreadyActivated") {
                        locals.title = "此邮箱已经激活过了";
                        res.render('templates/activate.jade', locals);
                    }
                    if (error == "invalidCode") {
                        locals.title = "激活码有错";
                        locals.message = "重新发送激活邮件请点这里：";
                        res.render('templates/activate.jade', locals);
                    }
                    if (error == "linkError") {
                        locals.title = "激活链接错误";
                        locals.message = "重新发送激活邮件请点这里：";
                        res.render('templates/activate.jade', locals);
                    }
                }

                if (req.query.username === undefined || req.query.email === undefined || req.query.code === undefined) {
                    //== "linkError") {
                    locals.title = "激活链接错误";
                    locals.message = "重新发送激活邮件请点这里：";
                    res.render('templates/activate.jade', locals);
                    return next('linkParameterError');
                }
                User.confirmEmail(req.query.username, req.query.code, req.query.email, sendConfirmed);
            }
        };
    }
);

