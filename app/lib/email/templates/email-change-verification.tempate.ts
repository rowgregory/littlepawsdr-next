export const emailChangeVerificationTemplate = ({
  firstName,
  currentEmail,
  newEmail,
  verifyUrl
}: {
  firstName: string
  currentEmail: string
  newEmail: string
  verifyUrl: string
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your new email address</title>
</head>
<body style="margin: 0; padding: 0; background: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 540px; margin: 0 auto; padding: 56px 24px;">

    <div style="margin-bottom: 48px; display: flex; align-items: center; gap: 12px;">
      <div style="width: 24px; height: 1px; background: #0891b2;"></div>
      <p style="margin: 0; color: #0891b2; font-size: 10px; font-family: 'Courier New', monospace; letter-spacing: 0.2em; text-transform: uppercase;">
        Little Paws Dachshund Rescue
      </p>
    </div>

    <h1 style="margin: 0 0 12px 0; color: #09090b; font-size: 26px; font-weight: 900; line-height: 1.2;">
      Verify your new email, ${firstName}
    </h1>

    <p style="margin: 0 0 24px 0; color: #71717a; font-size: 15px; line-height: 1.7;">
      You requested to change your Little Paws email address. Click the button below to confirm this change.
    </p>

    <div style="margin-bottom: 36px; border: 1px solid #e4e4e7;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e4e4e7; color: #71717a; font-size: 13px;">
            Current email
          </td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e4e4e7; color: #71717a; font-size: 13px; text-align: right; font-family: 'Courier New', monospace; text-decoration: line-through;">
            ${currentEmail}
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; color: #71717a; font-size: 13px;">
            New email
          </td>
          <td style="padding: 12px 16px; color: #09090b; font-size: 13px; text-align: right; font-family: 'Courier New', monospace; font-weight: bold;">
            ${newEmail}
          </td>
        </tr>
      </table>
    </div>

    <a
      href="${verifyUrl}"
      style="display: inline-block; background: #0891b2; color: #ffffff; text-decoration: none; font-size: 11px; font-family: 'Courier New', monospace; letter-spacing: 0.2em; text-transform: uppercase; padding: 14px 28px; margin-bottom: 24px;"
    >
      Confirm email change
    </a>

    <p style="margin: 24px 0 0 0; color: #a1a1aa; font-size: 12px; line-height: 1.6;">
      This link expires in 24 hours. If you did not request this change, you can ignore this email — your current email address will remain unchanged.
    </p>

    <div style="margin-top: 40px; height: 1px; background: #e4e4e7;"></div>

    <div style="margin-top: 24px;">
      <p style="margin: 0; font-size: 11px; color: #a1a1aa;">
        <a href="https://www.littlepawsdr.org/privacy" style="color: #a1a1aa; text-decoration: none; margin-right: 16px;">Privacy Policy</a>
        <a href="https://www.littlepawsdr.org/terms" style="color: #a1a1aa; text-decoration: none;">Terms of Service</a>
      </p>
    </div>
  </div>
</body>
</html>
`
