/**
 * Created by ge on 3/29/14.
 */
define(['../models/SchemaModels', 'nodemailer', './login'],
    function (SchemaModels, nodemailer, login) {
        if (typeof process.env.NJ_MAILER_PASSWORD != 'string') {
            console.log('NJ_MAILER_PASSWORD environmental variable not set. Need for nodemailer.');
            throw new Error("Cannot find variable NJ_MAILER_PASSWORD");
        }

        var login = {
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

        return login;
    }
);
