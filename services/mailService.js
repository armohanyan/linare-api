const { google } = require("googleapis");
const nodemailer = require("nodemailer");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

module.exports = class MailService {
  mailer = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        type: "OAuth2",
        user: process.env.ORGANIZATION_EMAIL,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: process.env.GOOGLE_ACCESS_TOKEN
    },
  });

  sendMail(email, url, subject, purpose) {
    const newUrl = `${process.env.SITE_URL}/${url}`;
    this.mailer
      .sendMail({
        from: `Linare <${process.env.ORGANIZATION_EMAIL}>`,
        to: email,
        subject: subject,
        html: `<a href="${newUrl}">${purpose}</a>`,
      })
      .then((sent) => {})
      .catch((err) => {
        throw err;
      });
  }

  customerSendMail(email, subject, purpose) {
    this.mailer
        .sendMail({
          from: email,
          to: `Linare <${process.env.ORGANIZATION_EMAIL}>`,
          subject: subject,
          html: `<div>${purpose}</div>`,
        })
        .then((sent) => {})
        .catch((err) => {
          throw err;
        });
  }

    userInviteSendMail(email, subject, purpose) {
        this.mailer
            .sendMail({
                from: `Linare <${process.env.ORGANIZATION_EMAIL}>`,
                to: email,
                subject: subject,
                html: `<div>${purpose}</div>`,
            })
            .then((sent) => {})
            .catch((err) => {
                throw err;
            });
    }
};
