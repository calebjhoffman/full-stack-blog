import nodemailer from 'nodemailer';

export async function sendVerificationEmail({ toEmail, token }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationUrl = `${process.env.CLIENT_ORIGIN}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Mini Blog" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Verify your email address',
    html: `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 1 hour.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}
