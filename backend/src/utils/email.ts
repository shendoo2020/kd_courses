import nodemailer from 'nodemailer';

export const sendTemporaryPasswordEmail = async (email: string, tempPassword: string): Promise<boolean> => {
  try {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || '"KLZ Academy Support" <support@klzacademy.com>';

    console.log(`\n======================================================`);
    console.log(`[PASSWORD RESET] Generated Temporary Password for: ${email}`);
    console.log(`[PASSWORD RESET] Temporary Password: ${tempPassword}`);
    console.log(`======================================================\n`);

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: smtpFrom,
        to: email,
        subject: 'Your Temporary Password for KLZ Academy',
        text: `Hello,\n\nYou requested a password reset for your KLZ Academy account.\n\nYour temporary password is:\n${tempPassword}\n\nPlease log in using this temporary password and immediately change your password in your Account Settings.\n\nBest regards,\nThe KLZ Academy Team`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #2563eb; margin: 0;">KLZ Academy</h2>
              <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Password Recovery</p>
            </div>
            <p style="color: #334155; font-size: 16px;">Hello,</p>
            <p style="color: #334155; font-size: 15px; line-height: 1.5;">
              You recently requested a password reset for your KLZ Academy account. We have generated a temporary password for you to access your account:
            </p>
            <div style="background-color: #f1f5f9; border-left: 4px solid #2563eb; padding: 16px; margin: 20px 0; border-radius: 6px;">
              <p style="font-size: 13px; color: #64748b; margin: 0 0 6px 0; text-transform: uppercase; font-weight: bold;">Temporary Password</p>
              <p style="font-size: 22px; font-weight: bold; letter-spacing: 2px; color: #1e293b; margin: 0; font-family: monospace;">${tempPassword}</p>
            </div>
            <p style="color: #475569; font-size: 14px; line-height: 1.5;">
              Please log in using this temporary password. For security reasons, you will be prompted to create a new permanent password.
            </p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
              If you did not request this password reset, please ignore this email or contact support.
            </p>
          </div>
        `,
      });
      console.log(`[PASSWORD RESET] Email successfully dispatched via SMTP to ${email}`);
    } else {
      console.log(`[PASSWORD RESET] Note: SMTP environment variables (SMTP_HOST, SMTP_USER, SMTP_PASS) not configured. Temporary password logged to console.`);
    }

    return true;
  } catch (error) {
    console.error('[PASSWORD RESET] Error in sendTemporaryPasswordEmail:', error);
    // Don't leak SMTP connection errors to client
    return false;
  }
};
