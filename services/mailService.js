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
      user: "armen14.03.2003@gmail.com",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: '1//046OxI7JNCK4YCgYIARAAGAQSNwF-L9IrIXbTKGKGpWi07smoR7mu-j88t-KI1BXtTjW6HTCEry2F67zSD7giNEcfNVIvVGd7VEU',
      accessToken: 'ya29.a0AfB_byBcfrheqJ_Din2b_gLpXTHtZsDRp4Mp-o1FOo737FLE4rYG0o6DpZWC6CXRoEZJjm6w93md6u0R8vr4oR0ub1wqO3BmeDTdG_4vyqbLHFUXI0xVG7GiFLWJzKh0LhgH5Dy236800_9JGUQiKjmlB4dlvaiNjN1raCgYKAcoSARESFQHGX2MiMxEu_ufPL1-Ka6rmOAFaUA0171',
      // refreshToken: 'ya29.a0AfB_byCiZoLNcwao1C2_cxu-ftqpWHR_WmFjaltdHhyHabLzyjGJpyacRKGjOrxRproQmb5SPk2ad1C09ALMdkEt4Doab_nn-27gYshuEdCLADOBtREKk2Pko6Fs-XZBovxopNYYgPLDqtK3bwc3pyREc8iJAItE0buZaCgYKAVQSARESFQHGX2Mi2yk58ia81_61JY3pWtbFpQ0171',
      // redirectUrl: 'https://developers.google.com/oauthplayground',
      // accessToken: oauth2Client.getAccessToken()
    },
  });

  sendMail(email, url, subject, purpose) {
    const newUrl = `${process.env.SITE_URL}/${url}`;
    this.mailer
      .sendMail({
        from: '"Linare" <armen14.03.2003@gmail.com>',
        to: email,
        subject: subject,
        html: `<a href="${newUrl}">${purpose}</a>`,
      })
      .then((sent) => {})
      .catch((err) => {
        throw err;
      });
  }
};
