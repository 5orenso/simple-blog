'use strict';

const sendgridHelper = require('sendgrid').mail;
const sendgrid = require('sendgrid');

class Mail {
    constructor(config) {
        this.config = config;
        this.sendgrid = sendgrid(config.sendgrid.apiKey);
    }
    sendEmail($param, opt = {}) {
        return new Promise((resolve, reject) => {
            const fromEmail = new sendgridHelper.Email($param.from);
            const subject = $param.subject;
            const content = new sendgridHelper.Content('text/html', $param.body);

            let toEmails = [];
            if (typeof $param.to === 'object' && Array.isArray($param.to)) {
                toEmails = toEmails.concat($param.to);
            } else {
                toEmails.push($param.to);
            }
            const promises = [];
            for (let i = 0; i < toEmails.length; i += 1) {
                if (toEmails.hasOwnProperty(i)) {
                    const toEmail = new sendgridHelper.Email(toEmails[i]);
                    const mail = new sendgridHelper.Mail(fromEmail, subject, toEmail, content);
                    const sendgridRequest = this.sendgrid.emptyRequest({
                        method: 'POST',
                        path: '/v3/mail/send',
                        body: mail.toJSON(),
                    });
                    promises.push(this.sendgridSendEmail(sendgridRequest, opt));
                }
            }
            Promise.all(promises)
                .then((results) => {
                    resolve(results);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    sendgridSendEmail(sendgridRequest) {
        return new Promise((resolve, reject) => {
            this.sendgrid.API(sendgridRequest, ($error, $response) => {
                if ($error) {
                    return reject($error);
                }
                return resolve({
                    statusCode: $response.statusCode,
                    result: $response,
                });
            });
        });
    }
}

module.exports = Mail;
