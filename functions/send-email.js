const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { to, subject, body } = payload;
  if (!to || !subject || !body) return { statusCode: 400, body: 'Missing to/subject/body' };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: `"CAKEIRIS" <${process.env.EMAIL_USER}>`,
      to: Array.isArray(to) ? to.join(',') : to,
      subject,
      text: body
    });
    return { statusCode: 200, body: JSON.stringify({ message: 'Email sent' }) };
  } catch (err) {
    console.error('sendMail error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to send email', details: err.message }) };
  }
};
