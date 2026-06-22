export function buildVerificationEmail(params: {
  name: string;
  otp: string;
  confirmationLink: string;
  appUrl: string;
}): { subject: string; html: string } {
  const { name, otp, confirmationLink, appUrl } = params;

  const subject = 'Verify your RehearseAI account';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Logo / Brand -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#6366f1,#3b82f6);border-radius:16px;padding:14px;display:inline-block;">
                    <span style="font-size:28px;line-height:1;">🎙️</span>
                  </td>
                </tr>
              </table>
              <div style="margin-top:14px;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                Rehearse<span style="background:linear-gradient(90deg,#6366f1,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">AI</span>
              </div>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#1a1a1a;border:1px solid #2a2a2a;border-radius:20px;padding:40px 36px;">

              <!-- Greeting -->
              <p style="margin:0 0 8px;font-size:22px;font-weight:600;color:#ffffff;">Hi ${name} 👋</p>
              <p style="margin:0 0 28px;font-size:15px;color:#a1a1aa;line-height:1.6;">
                Thanks for signing up. Use the verification code below or click the button to confirm your email address and activate your account.
              </p>

              <!-- OTP Code -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center" style="background-color:#111111;border:1px solid #2a2a2a;border-radius:14px;padding:24px;">
                    <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:1.5px;">Verification Code</p>
                    <p style="margin:0;font-size:42px;font-weight:700;color:#ffffff;letter-spacing:10px;font-variant-numeric:tabular-nums;">${otp}</p>
                    <p style="margin:10px 0 0;font-size:12px;color:#52525b;">Expires in 1 hour</p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="border-top:1px solid #2a2a2a;font-size:0;line-height:0;">&nbsp;</td>
                  <td style="padding:0 16px;font-size:13px;color:#52525b;white-space:nowrap;">or verify via link</td>
                  <td style="border-top:1px solid #2a2a2a;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a href="${confirmationLink}"
                       style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#6366f1,#3b82f6);color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:12px;letter-spacing:0.2px;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Security note -->
              <p style="margin:0;font-size:13px;color:#52525b;line-height:1.6;text-align:center;">
                If you didn&apos;t create a RehearseAI account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#3f3f46;">
                &copy; ${new Date().getFullYear()} RehearseAI &mdash; <a href="${appUrl}" style="color:#6366f1;text-decoration:none;">${appUrl.replace(/^https?:\/\//, '')}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return { subject, html };
}
