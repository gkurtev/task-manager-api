const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'gkurtev100@gmail.com',
    subject: 'Thanks for joining bro',
    text: `Wassup ${name}, welcome to miami`
  })

}

const sendCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'gkurtev100@gmail.com',
    subject: 'Why are you running ?',
    text: `Please stay ${name}, we have cookies ?`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail
}
