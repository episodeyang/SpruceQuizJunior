/**
 * @module Mailer
 */
'use strict';
define(['underscore', 'module', 'nodemailer', 'email-templates', 'path', './logins' ],
    function (_, module, nodemailer, emailTemplates, path, logins) {

        var templatesDir
        var smtpTransport = nodemailer.createTransport('SMTP', logins);
//
//        console.log('template directory')
//        console.log(templatesDir)
//
//        console.log('module.filename')
//        console.log(module.filename)
//
//        console.log('path.dirname(module.filename)')
//        console.log(path.dirname(module.filename))
//
//        console.log('module.uri')
//        console.log(module.uri)

        // get the proper path name to the templates folder.
        if (module.uri !== undefined) {
            templatesDir = path.resolve(path.dirname(module.uri) + '/templates');
        } else {
            templatesDir = path.resolve(path.dirname(module.filename) + '/templates');
        }

        /**
         * This is the constructor for the Mailer object.
         * @constructor
         */
        function Mailer() {
            var _this = this;
            /**
             * the callback stack of Mailer
             * @type {object}
             */
            this.callbacks = {};
            /**
             * @callback renderCallback
             * @memberOf Mailer
             * @param {string} error the error message
             * @param {string} html the compiled email html with inline css
             * @param {string} text the compiled email text
             */

            /**
             * attaches the response callback to the callbacks stack
             * @function
             * @params {renderCallback}
             */
            this.rendered = function (callback) {
                _this.callbacks.rendered = callback;
            };
            /**
             * @callback responseCallback
             * @memberOf Mailer
             * @param {string} error
             * @param {string} response response message from the SMTP server
             */

            /**
             * attaches the response callback to the callbacks stack
             * @function
             * @params {responseCallback}
             */
            this.response = function (callback) {
                _this.callbacks.response = callback;
            };

            /**
             * renders the email from a template
             * @function
             * @params {string} templateString the title of the email template for rendering
             * @params {object} locals variables
             */
            this.render = function (templateString, locals) {
                emailTemplates(
                    templatesDir,
                    function (err, template) {
                        if (err) {
                            console.log('email template compiler error');
                            console.log(err);
                        }
                        template(
                            templateString,
                            locals,
                            function (err, html, text) {
                                if (err) {
                                    console.log('email template error', err);
                                }
                                _this.callbacks.rendered(err, html, text);
                            }
                        );
                    }
                );
                return this;
            };

            /**
             * sends the rendered email
             * @function
             * @params {object} email object containing the recipient address, subject etc.
             */
            this.send = function (email) {
                _this.callbacks.rendered = function (err, html, text) {
                    if (err) {
                        console.log(this.err);
                    }
                    email.html = html;
                    email.text = text;
                    smtpTransport.sendMail(email, function (error, response) {
                        if (error) {
                            console.log(error);
                        }
                        _this.callbacks.response(error, response);
                    });
                };
                return this;
            };
            return this;
        }

        var mailer = new Mailer();

        /**
         * extended functions for the mailer object
         */
        var mailer_extended_functions = {
            /**
             * sending out emails after registration, containing email activation links.
             * @name register
             * @memberOf Mailer
             * @function
             * @param {string} recipient the email of the recipient
             * @param {obj} locals all the parameters passed into the template rendering engine
             * @param {renderCallback} callback the callback function executed once the work is finished.
             */
            register: function (recipient, locals, callback) {
                var email = {
                    from: logins.auth.user,
                    to: recipient,
                    subject: '欢迎来到难题夹子！',
                    generateTextFromHTML: true
                };

                if (locals.domain === undefined) {
                    console.log('mailer.register local parameter does not have domain name.')
                    locals.domain = 'nantijiazi.com';
                }

                mailer.render('emailConfirmation', locals).send(email).response(callback);
            },
            /**
             * sending out emails after for password reset, containing the link.
             * @name passwordReset
             * @memberOf Mailer
             * @function
             * @param {string} recipient the email of the recipient
             * @param {object} locals all the parameters passed into the template rendering engine
             * @param {renderCallback} callback the callback function executed once the work is finished.
             */
            passwordReset: function (recipient, locals, callback) {
                console.log(recipient + ' wants to reset password');

                if (locals.domain === undefined) {
                    console.log('mailer.passwordReset local parameter does not have domain name.')
                    locals.domain = 'nantijiazi.com';
                }

                var email = {
                    from: logins.auth.user,
                    to: recipient,
                    subject: '重置密码 - 难题夹子账户',
                    generateTextFromHTML: true
                };
                mailer.render('resetPassword', locals).send(email).response(callback);
            }
        };

        return _.extend(mailer, mailer_extended_functions);
    });


