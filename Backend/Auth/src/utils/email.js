import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // Check this value
    pass: process.env.EMAIL_PASS, // Check this value
  }
});

export const sendVerificationEmail = async (email, code) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Email Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Verify Your Email</h1>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="font-size: 16px;">Your verification code is:</p>
            <h2 style="color: #007bff; text-align: center; font-size: 32px; letter-spacing: 5px;">${code}</h2>
          </div>
          <p style="color: #666;">This code will expire in 10 minutes.</p>
          <p style="color: #666;">If you didn't request this code, please ignore this email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, code) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Password Reset Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Reset Your Password</h1>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="font-size: 16px;">Your password reset code is:</p>
            <h2 style="color: #007bff; text-align: center; font-size: 32px; letter-spacing: 5px;">${code}</h2>
          </div>
          <p style="color: #666;">This code will expire in 10 minutes.</p>
          <p style="color: #666;">If you didn't request this code, please ignore this email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};