export function contactEmailTemplate({
  name,
  email,
  subject,
  message
}: {
  name: string
  email: string
  subject: string
  message: string
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    @media only screen and (max-width: 480px) {
      .main-heading { font-size: 22px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 540px; margin: 0 auto; padding: 56px 24px;">

    <!-- Header label -->
    <div style="margin-bottom: 48px; display: flex; align-items: center; gap: 12px;">
      <div style="width: 24px; height: 1px; background: #0891b2;"></div>
      <p style="margin: 0; color: #0891b2; font-size: 10px; font-family: 'Courier New', monospace; letter-spacing: 0.2em; text-transform: uppercase;">
        Little Paws Dachshund Rescue
      </p>
    </div>

    <!-- Main heading -->
    <h1 class="main-heading" style="margin: 0 0 12px 0; color: #09090b; font-size: 26px; font-weight: 900; line-height: 1.2;">
      New contact message
    </h1>

    <p style="margin: 0 0 36px 0; color: #71717a; font-size: 15px; line-height: 1.7;">
      ${name} sent a message through the Little Paws contact form.
    </p>

    <!-- Message details -->
    <div style="margin-bottom: 36px;">
      <p style="margin: 0 0 12px 0; color: #71717a; font-size: 9px; font-family: 'Courier New', monospace; letter-spacing: 0.2em; text-transform: uppercase;">
        Message details
      </p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #71717a; font-size: 13px; width: 100px;">Subject</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #09090b; font-size: 14px; font-weight: 700;">
            ${subject}
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #71717a; font-size: 13px;">Name</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #09090b; font-size: 14px;">
            ${name}
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; color: #71717a; font-size: 13px;">Reply to</td>
          <td style="padding: 12px 0; font-size: 14px;">
            <a href="mailto:${email}" style="color: #0891b2; text-decoration: none; font-weight: 700;">${email}</a>
          </td>
        </tr>
      </table>
    </div>

    <!-- Message body -->
    <div style="margin-bottom: 40px;">
      <p style="margin: 0 0 12px 0; color: #71717a; font-size: 9px; font-family: 'Courier New', monospace; letter-spacing: 0.2em; text-transform: uppercase;">
        Message
      </p>
      <div style="padding: 16px; background: #f4f4f5; border: 1px solid #e4e4e7; border-left: 3px solid #0891b2;">
        <p style="margin: 0; color: #09090b; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${message}</p>
      </div>
    </div>

    <!-- CTA -->
    <div style="margin-bottom: 40px;">
      
        href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}"
        style="display: inline-block; background: #0891b2; color: #ffffff; text-decoration: none; padding: 13px 32px; font-weight: 700; font-size: 11px; font-family: 'Courier New', monospace; letter-spacing: 0.2em; text-transform: uppercase;"
      >
        Reply to ${name}
      </a>
    </div>

    <!-- Divider -->
    <div style="margin: 40px 0; height: 1px; background: #e4e4e7;"></div>

    <!-- Footer -->
    <div style="margin-bottom: 24px;">
      <p style="margin: 0 0 10px 0; color: #71717a; font-size: 9px; font-family: 'Courier New', monospace; letter-spacing: 0.2em; text-transform: uppercase;">
        Questions? We&apos;re here to help.
      </p>
      <p style="margin: 0 0 6px 0;">
        <a href="mailto:info@littlepawsdr.org" style="color: #0891b2; text-decoration: none; font-size: 13px;">
          info@littlepawsdr.org
        </a>
      </p>
    </div>

    <!-- Legal -->
    <div style="margin-top: 24px;">
      <p style="margin: 0; font-size: 11px; color: #a1a1aa;">
        <a href="https://www.littlepawsdr.org/privacy" style="color: #a1a1aa; text-decoration: none; margin-right: 16px;">Privacy Policy</a>
        <a href="https://www.littlepawsdr.org/terms" style="color: #a1a1aa; text-decoration: none;">Terms of Service</a>
      </p>
    </div>

    <!-- Bottom label -->
    <div style="margin-top: 40px; display: flex; align-items: center; gap: 12px;">
      <div style="width: 24px; height: 1px; background: #e4e4e7;"></div>
      <p style="margin: 0; color: #a1a1aa; font-size: 9px; font-family: 'Courier New', monospace; letter-spacing: 0.2em; text-transform: uppercase;">
        Little Paws Dachshund Rescue
      </p>
    </div>

  </div>
</body>
</html>
  `
}
