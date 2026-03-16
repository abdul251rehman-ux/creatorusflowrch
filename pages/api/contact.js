import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, email, phone, service, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"CREATORUSFLOW Contact" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: email,
    subject: `New Contact Form Submission — ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8faff; border-radius: 12px;">
        <h2 style="color: #0D1526; margin-bottom: 24px; border-bottom: 2px solid #7B93FF; padding-bottom: 12px;">
          New Message from CREATORUSFLOW Website
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #64748b; font-size: 13px; width: 120px;">FULL NAME</td>
            <td style="padding: 10px 0; color: #0D1526; font-weight: 600;">${name}</td>
          </tr>
          <tr style="background: #f0f4ff;">
            <td style="padding: 10px 8px; color: #64748b; font-size: 13px;">EMAIL</td>
            <td style="padding: 10px 8px; color: #0D1526;"><a href="mailto:${email}" style="color: #7B93FF;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #64748b; font-size: 13px;">PHONE</td>
            <td style="padding: 10px 0; color: #0D1526;">${phone || '—'}</td>
          </tr>
          <tr style="background: #f0f4ff;">
            <td style="padding: 10px 8px; color: #64748b; font-size: 13px;">SERVICE</td>
            <td style="padding: 10px 8px; color: #0D1526;">${service || '—'}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding: 16px; background: #ffffff; border-radius: 8px; border-left: 4px solid #7B93FF;">
          <p style="color: #64748b; font-size: 13px; margin: 0 0 8px;">MESSAGE</p>
          <p style="color: #0D1526; margin: 0; line-height: 1.6;">${message.replace(/\n/g, '<br/>')}</p>
        </div>
        <p style="margin-top: 20px; color: #94a3b8; font-size: 12px; text-align: center;">
          Sent via creatorusflow.com contact form
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send email' });
  }
}
