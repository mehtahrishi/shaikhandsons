/**
 * Premium Email Templates for Shaikh & Sons
 * Consistent styling across all automated communications.
 */

export function buildEmailWrapper(content: string, title: string) {
  const currentYear = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Poppins', 'Helvetica Neue', Arial, sans-serif;color:#000000;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:48px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:560px;">

        <!-- Header -->
        <tr>
          <td style="padding:40px 40px;text-align:center;">
            <div style="font-size:24px;font-weight:900;letter-spacing:4px;text-transform:uppercase;color:#000;font-family:'Playfair Display', serif;white-space:nowrap;">
              SHAIKH <span style="color:#CE1212;">&amp;</span> SONS
            </div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px;text-align:center;">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:32px 40px;text-align:center;border-top:1px solid #f0f0f0;">
            <p style="color:#999;font-size:10px;margin:0;line-height:1.6;letter-spacing:1px;text-transform:uppercase;font-weight:700;">
              © ${currentYear} Shaikh and Sons Private Limited.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/**
 * OTP / Verification Code Template
 */
export function buildOtpEmailHtml(otp: string, purpose: 'Verification' | 'PasswordReset' = 'Verification'): string {
  const digits = otp.split('').map(
    (d) => `<span style="
      display:inline-block;
      width:44px;height:56px;
      line-height:56px;
      text-align:center;
      background:#f8f8f8;
      border:1px solid #CE1212;
      border-radius:4px;
      font-size:28px;
      font-weight:900;
      color:#000;
      margin:0 4px;
      font-family:'Courier New', Courier, monospace;
    ">${d}</span>`
  ).join('');

  const content = `
    <h2 style="color:#000;font-size:22px;font-weight:700;letter-spacing:1px;margin:0 0 12px;font-family:'Playfair Display', serif;">
      ${purpose === 'PasswordReset' ? 'Password Recovery' : 'Identity Verification'}
    </h2>
    <p style="color:#333;font-size:14px;line-height:1.6;margin:0 0 40px;font-weight:400;">
      ${purpose === 'PasswordReset' 
        ? 'A password reset has been requested. Use the code below to proceed.'
        : 'A code has been requested to login.'}
    </p>

    <!-- OTP Boxes -->
    <div style="margin:0 auto 40px;">
      ${digits}
    </div>

    <p style="color:#666;font-size:12px;line-height:1.8;margin:0;max-width:320px;margin-left:auto;margin-right:auto;">
      Code expires in 10 minutes. If you did not initiate this request, please ignore this email.
    </p>
  `;

  return buildEmailWrapper(content, `Shaikh & Sons — ${purpose === 'PasswordReset' ? 'Password Reset' : 'Verification'}`);
}

/**
 * Contact Form Submission Template (for Admin)
 */
export function buildContactEmailHtml(name: string, email: string, subject: string, message: string): string {
  const content = `
    <h2 style="color:#000;font-size:20px;font-weight:700;letter-spacing:1px;margin:0 0 24px;font-family:'Playfair Display', serif;text-transform:uppercase;">
      New Message Received
    </h2>
    
    <div style="background:#f8f8f8;padding:24px;border-radius:8px;margin-bottom:24px;text-align:left;border:1px solid #f0f0f0;">
      <p style="margin:0 0 16px;font-size:14px;color:#666;line-height:1.5;">
        <strong style="color:#000;text-transform:uppercase;font-size:11px;letter-spacing:1px;display:block;margin-bottom:4px;">Sender:</strong>
        <span style="color:#333;font-weight:600;">${name}</span> &lt;${email}&gt;
      </p>
      <p style="margin:0 0 16px;font-size:14px;color:#666;line-height:1.5;">
        <strong style="color:#000;text-transform:uppercase;font-size:11px;letter-spacing:1px;display:block;margin-bottom:4px;">Subject:</strong>
        <span style="color:#333;font-weight:600;">${subject}</span>
      </p>
      <p style="margin:0;font-size:14px;color:#666;line-height:1.6;">
        <strong style="color:#000;text-transform:uppercase;font-size:11px;letter-spacing:1px;display:block;margin-bottom:4px;">Message:</strong>
        <span style="color:#333;white-space:pre-wrap;">${message}</span>
      </p>
    </div>

    <p style="color:#999;font-size:12px;line-height:1.8;margin:0;">
      This is an automated notification from the Shaikh & Sons Inquiry System.
    </p>
  `;

  return buildEmailWrapper(content, 'Shaikh & Sons — New Contact Message');
}
