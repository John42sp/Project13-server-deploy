const path = require('path');
const nodemailer = require('nodemailer');
// import * as nodemailer from'nodemailer';

const hbs = require('nodemailer-express-handlebars');

const {host, port, user, pass } = require('../config/mail.js')

 const transport = nodemailer.createTransport({
    host,
    port,
    auth: {
      user,
      pass
    }
  });

  transport.use('compile', hbs({
      viewEngine: 'handlebars',
      viewPath: path.resolve('./src/resources/mail'),
      extName: '.html'
  }))

  export default transport;