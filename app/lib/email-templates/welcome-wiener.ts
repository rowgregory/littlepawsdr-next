export const welcomeWienerConfirmationTemplate = (donorName: string, amount: number, orderId: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome Wiener Sponsorship Confirmed - Little Paws Dachshund Rescue</title>
  <style>
    @media only screen and (max-width: 480px) {
      .main-heading { font-size: 22px !important; }
      .main-text    { font-size: 14px !important; }
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
      You're sponsoring a dachshund, ${donorName}!
    </h1>
 
    <!-- Body text -->
    <p class="main-text" style="margin: 0 0 36px 0; color: #71717a; font-size: 15px; line-height: 1.7;">
      Your Welcome Wiener sponsorship means one of our rescued dachshunds gets the care, love, and support they need while they wait for their forever home. Thank you from the bottom of our hearts.
    </p>
 
    <!-- Donation details -->
    <div style="margin-bottom: 36px;">
      <p style="margin: 0 0 12px 0; color: #71717a; font-size: 9px; font-family: 'Courier New', monospace; letter-spacing: 0.2em; text-transform: uppercase;">
        Sponsorship Details
      </p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #71717a; font-size: 14px;">Amount</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #09090b; font-size: 14px; text-align: right; font-family: 'Courier New', monospace; font-weight: 700;">$${(amount / 100).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #71717a; font-size: 14px;">Date</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #09090b; font-size: 14px; text-align: right;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; color: #71717a; font-size: 14px;">Confirmation ID</td>
          <td style="padding: 12px 0; color: #09090b; font-size: 12px; text-align: right; font-family: 'Courier New', monospace;">${orderId}</td>
        </tr>
      </table>
    </div>
 
    <!-- Impact block -->
    <div style="margin-bottom: 40px; padding: 16px; background: #f4f4f5; border: 1px solid #e4e4e7; border-left: 3px solid #0891b2;">
      <p style="margin: 0; color: #71717a; font-size: 13px; line-height: 1.7;">
        <strong style="color: #09090b;">Your impact</strong><br>
        Every dollar you give goes directly toward food, veterinary care, and enrichment for the dachshunds in our rescue program. You're making a real difference.
      </p>
    </div>
 
    <!-- Divider -->
    <div style="margin: 40px 0; height: 1px; background: #e4e4e7;"></div>
 
    <!-- Tax info -->
    <div style="margin-bottom: 40px;">
      <p style="margin: 0; color: #71717a; font-size: 13px; line-height: 1.7;">
        <strong style="color: #09090b;">Tax Information:</strong> Little Paws Dachshund Rescue is a 501(c)(3) nonprofit organization. Your donation is tax-deductible to the extent allowed by law.
      </p>
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
