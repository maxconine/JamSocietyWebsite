const functions = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });

// Use credentials from Firebase environment config
const gmailEmail = process.env.GMAIL_EMAIL || functions.config().gmail.email;
const gmailPassword = process.env.GMAIL_PASSWORD || functions.config().gmail.password;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

exports.sendVerificationCode = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).send('Missing email or code');
    }

    const mailOptions = {
      from: `Jam Society <${gmailEmail}>`,
      to: email,
      subject: 'Your Jam Society Verification Code',
      text: `Your verification code is: ${code}`,
      html: `<p>Your Jam Society verification code is:</p><h2>${code}</h2>`,
    };

    try {
      let info = await transporter.sendMail(mailOptions);
      logger.info('Email sent:', info);
      return res.status(200).send('Verification code sent');
    } catch (error) {
      logger.error('Error sending email:', error);
      return res.status(500).send('Failed to send email');
    }
  });
});