(mailHelper => {
    'use strict';

    const { uuid } = require('uuidv4');
    const Promise = require('bluebird');
    const nodemailer = Promise.promisifyAll(require('nodemailer'));
    const queryHelper = require('../queryHelper/insert.helper');

    const aws = require('aws-sdk');
    const status_message = 'Not requested to send email, Because Blocked by Admin';
    // configure AWS SDK
    aws.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
    });

    const ConfigureEmailServer = next => {
        try {
            // create Nodemailer SES transporter
            const transporter = nodemailer.createTransport({
                SES: new aws.SES({
                    apiVersion: '2010-12-01',
                }),
                sendingRate: 14, // max 14 messages/second
            });
            return transporter;
        } catch (err) {
            return next(err);
        }
    };

    const GetEmailServerConfigurations = async (req, mailData, attachment, next) => {
        try {
            const mailer = ConfigureEmailServer(next);
            // Push next messages to Nodemailer
            const resData = await mailer.on('idle', async () => {
                while (mailer.isIdle()) {
                    return mailer.sendMail(mailData);
                }
            });
            return resData;

        } catch (err) {
            console.log('err', err);
            return next(err);
        }
    };

    mailHelper.sendEmail = async (
        req,
        { fromEmail, toEmail, subject, textMessage, htmlTemplateMessage, attachments, cc },
        next,
    ) => {
        const mailOptions = {
            from: `"${process.env.EMAIL_TITLE}" <${fromEmail}>`, // sender address
            to: toEmail, // list of receivers
            subject: subject, // Subject line
            text: textMessage, // plaintext body
            html: htmlTemplateMessage, // html body
            attachments: attachments,
        };
        if (cc !== null && cc !== undefined) {
            mailOptions.cc = cc;
        }
        const emailRes = await GetEmailServerConfigurations(req, mailOptions, true, next);

        if (emailRes) {
            const emailResOptions = {};
            emailResOptions.mailOptions = mailOptions;
            emailResOptions.route = req.originalUrl;
            emailResOptions.id = uuid();
            emailResOptions.added_on = new Date();
            emailResOptions.success = true;
            const mailOption = mailOptions.to + mailOptions.subject;

            const insertErrData = {
                id: `${uuid()}`,
                mailOptions: `${mailOption}`,
                route: `${req.originalUrl}`,
                added_on: `${added_on}`,
                success: '0'
            }

            const insertData = {
                id: `${uuid()}`,
                mailOptions: `${mailOption}`,
                route: `${req.originalUrl}`,
                added_on: `${added_on}`,
                success: '1'
            }

            const added_on = new Date().toISOString().replace(/T/, " ").replace(/\..+/, '');
            if (emailRes.status && emailRes.status === status_message) {
                emailResOptions.success = false;
                const query = await queryHelper(insertErrData, 'emailErrorLog');
            }
            else {
                const [rows] = await queryHelper(insertData, 'emailLog');
                return rows
            }
        }
        return null;
    };
})(module.exports);
