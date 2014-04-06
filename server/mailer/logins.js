/**
 * Created by ge on 3/29/14.
 * @name logins
 * @memberOf Mailer
 * @param {string} NJ_MAILER_USER email address for mailer
 * @param {string} NJ_MAILER_PASSWORD for mailer
 * @return {object} logins for mailer
 */
define(['nodemailer'],
    function (nodemailer) {
        if (typeof process.env.NJ_MAILER_PASSWORD != 'string') {
            console.log('NJ_MAILER_PASSWORD environmental variable not set. Need for nodemailer.');
            throw new Error("Cannot find variable NJ_MAILER_PASSWORD");
        }
        if (typeof process.env.NJ_MAILER_USER != 'string') {
            console.log('NJ_MAILER_USER environmental variable not set. Need for nodemailer.');
            throw new Error("Cannot find variable NJ_MAILER_PASSWORD");
        }

        var logins = {
            host: "smtp-mail.outlook.com",
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587,
            auth: {
                user: process.env.NJ_MAILER_USER,
                pass: process.env.NJ_MAILER_PASSWORD
            },
            tls: {
                ciphers: 'SSLv3'
            }
        };

        return logins;
    }
);
