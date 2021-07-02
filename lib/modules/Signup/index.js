const HTTPStatus = require('http-status');
const configMessage = require("./config");
const pwdGenerator = require("generate-password");
const bcryptHelper = require("../../helpers/bcrypt.helper");
const sendEmail = require("../../helpers/email.helper");
const emailTemplate = require('../../configs/email.config');
const { uuid } = require('uuidv4');
const insertHelper = require('../../queryHelper/insert.helper');

exports.create_user = async (req, res, next) => {
    const _id = uuid();

    const password = pwdGenerator.generate({
        length: 10,
        numbers: true,
    });

    const salt = await bcryptHelper.generateSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
    const enPassword = await bcryptHelper.hashPwd('Demo2020', salt);

    try {
        const added_on = new Date().toISOString().replace(/T/, " ").replace(/\..+/, '');
        const updated_on = new Date().toISOString().replace(/T/, " ").replace(/\..+/, '');

        const added_by = 'InstaEStore';
        const updated_by = 'InstaEStore';

        const query = {
            full_name: `${req.body.full_name}`,
            company_name: `${req.body.company_name}`,
            email: `${req.body.email}`,
            phone_number: `${req.body.phone_number}`,
            discovery_date: `${req.body.discovery_date}`,
            added_on: `${added_on}`,
            updated_on: `${updated_on}`,
            added_by: `${added_by}`,
            updated_by: `${updated_by}`,
            password: `${enPassword}`,
            id: `${_id}`,
            deleted: 0
        };

        const insert = await insertHelper(query, `userRegistration`);
        console.log(insert, '<<<<<<<<<insert');
        let messageBody = emailTemplate.system_emails;
        if (messageBody.indexOf('%email%') > -1) {
            messageBody = messageBody.replace(
                '%email%', req.body.email
            )
        }
        if (messageBody.indexOf('%password%') > -1) {
            messageBody = messageBody.replace(
                '%password%', password
            )
        }
        if (messageBody.indexOf('%full_name%') > -1) {
            messageBody = messageBody.replace(
                '%full_name%', req.body.full_name
            )
        }
        const mailOptions = {
            fromEmail: 'info@bitsbeat.com', // sender address
            toEmail: req.body.email, // list of receivers
            subject: `We Got Your Email`, // Subject line
            textMessage: messageBody, // plaintext body
            htmlTemplateMessage: messageBody,
            attachments: [],
        };
        // sendEmail.sendEmail(req, mailOptions, next)
        res.status(200).json({
            status: HTTPStatus.OK,
            message: configMessage.messageConfig.user.userCreateSuccess
        });


    } catch (err) {
        res.status(500).json({
            status: HTTPStatus.INTERNAL_SERVER_ERROR,
            err: err.toString(),
            message: "Bad Request"
        });
    }
}
