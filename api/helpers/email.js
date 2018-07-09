const config = require('../../config');

const nodemailer = require('nodemailer')
const mailgunTransport = require('nodemailer-mailgun-transport')

const auth = {
  auth: {
    api_key: config.mailgun.key,
    domain: config.mailgun.domain
  }
}

const mailgun = nodemailer.createTransport(mailgunTransport(auth))

/**
 * @description Email sender
 * @return token
 */
module.exports = (params) => {
  return new Promise((resolve, reject) => {
    mailgun.sendMail(params)
      .then(data => resolve(data))
      .catch(error => reject(error))
  });
}