import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Email configuration - using Gmail (you can replace with your email service)
// For Gmail, use an App Password if 2FA is enabled
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

// Generate a temporary password reset token
export const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send password reset email
export const sendPasswordResetEmail = async (email, token, teacherName = 'Teacher') => {
  try {
    // Create reset link (in production, this would be a frontend URL)
    const resetLink = `http://localhost:3000/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@schoolpayroll.com',
      to: email,
      subject: '🔐 Password Reset Request - Teacher Payroll System',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .button:hover { background: #764ba2; }
            .info { background: #e8f4f8; padding: 15px; border-left: 4px solid #0066cc; margin: 20px 0; border-radius: 4px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
            .code { background: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; text-align: center; font-size: 14px; word-break: break-all; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${teacherName}</strong>,</p>
              
              <p>We received a request to reset the password associated with this email address. If you did not make this request, you can ignore this email.</p>
              
              <div class="info">
                <strong>⏱️ This link expires in 1 hour</strong>
              </div>
              
              <p>To reset your password, click the button below:</p>
              
              <center>
                <a href="${resetLink}" class="button">Reset Password</a>
              </center>
              
              <p>Or copy and paste this link in your browser:</p>
              <div class="code">${resetLink}</div>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
              
              <h3>Reset Instructions:</h3>
              <ol>
                <li>Click the link above or visit the URL</li>
                <li>Enter your new password</li>
                <li>Confirm the new password</li>
                <li>Log in with your new password</li>
              </ol>
              
              <div class="info">
                <strong>💡 Tips:</strong>
                <ul>
                  <li>Use a strong password with uppercase, lowercase, numbers, and symbols</li>
                  <li>Don't share your password with anyone</li>
                  <li>Keep your password confidential</li>
                </ul>
              </div>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
              
              <p style="color: #666; font-size: 12px;">
                If you didn't request a password reset, please contact support immediately.<br>
                <strong>Do not reply to this email</strong> - it's an automated message.
              </p>
            </div>
            <div class="footer">
              <p>📚 Teacher Payroll System | © 2025 All Rights Reserved</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    return { success: true, message: 'Password reset email sent', messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send email', error: error.message };
  }
};

// Send welcome email when teacher is created
export const sendWelcomeEmail = async (email, teacherName, initialPassword) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@schoolpayroll.com',
      to: email,
      subject: '👋 Welcome to Teacher Payroll System',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .button:hover { background: #764ba2; }
            .credentials { background: #fff; padding: 15px; border: 2px solid #667eea; border-radius: 5px; margin: 20px 0; }
            .info { background: #e8f4f8; padding: 15px; border-left: 4px solid #0066cc; margin: 20px 0; border-radius: 4px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>👋 Welcome ${teacherName}!</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${teacherName}</strong>,</p>
              
              <p>Your account has been successfully created in the <strong>Teacher Payroll System</strong>. Below are your login credentials:</p>
              
              <div class="credentials">
                <p><strong>📧 Email:</strong> ${email}</p>
                <p><strong>🔑 Initial Password:</strong> ${initialPassword}</p>
              </div>
              
              <div class="info">
                <strong>⚠️ Important:</strong> We recommend changing your password immediately after first login.
              </div>
              
              <center>
                <a href="http://localhost:3000" class="button">Login to System</a>
              </center>
              
              <h3>What's Next?</h3>
              <ol>
                <li>Log in with your email and initial password</li>
                <li>Go to Settings → Profile to change your password</li>
                <li>Complete your profile with phone number and address</li>
                <li>Add a profile picture</li>
                <li>Start tracking your teaching hours!</li>
              </ol>
              
              <h3>Features Available:</h3>
              <ul>
                <li>📊 Track your teaching attendance and hours</li>
                <li>💰 View your salary computations</li>
                <li>📈 Check your teaching load</li>
                <li>💬 Communicate with administrators</li>
                <li>👤 Manage your profile and account</li>
              </ul>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
              
              <p style="color: #666; font-size: 12px;">
                If you have any questions or need assistance, please contact your administrator.<br>
                <strong>Do not reply to this email</strong> - it's an automated message.
              </p>
            </div>
            <div class="footer">
              <p>📚 Teacher Payroll System | © 2025 All Rights Reserved</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', info.response);
    return { success: true, message: 'Welcome email sent' };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, message: 'Failed to send welcome email' };
  }
};

// Verify transporter connection
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email service connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Email service connection failed:', error);
    return false;
  }
};

export default transporter;
