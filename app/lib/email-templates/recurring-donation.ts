export const recurringDonationConfirmationTemplate = (
  donorName: string,
  amount: number,
  orderId: string,
  frequency: 'monthly' | 'annual'
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recurring Donation Confirmation - Education Comes First</title>
</head>
<body style="margin: 0; padding: 40px 20px; background-color: #fcf7f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 500px; margin: 0 auto;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 48px;">
      <h1 style="margin: 0 0 8px 0; color: #000000; font-size: 32px; font-weight: 700; letter-spacing: -0.02em;">Education Comes First</h1>
      <p style="margin: 0; color: #00a2d1; font-size: 15px; font-weight: 500;">Empowering the next generation</p>
    </div>

    <!-- Main Message -->
    <div style="margin-bottom: 40px;">
      <p style="margin: 0 0 24px 0; color: #1a1a1a; font-size: 16px; line-height: 1.6; font-weight: 500;">
        Thank you, ${donorName}! Your ${frequency === 'monthly' ? 'monthly' : 'annual'} recurring donation has been set up successfully.
      </p>
      <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
        Your generosity will make a lasting impact. You'll be charged ${frequency === 'monthly' ? 'every month' : 'once a year'} until you choose to cancel.
      </p>
    </div>

    <!-- Donation Details -->
    <div style="margin-bottom: 48px; padding: 24px; background-color: #ffffff; border: 1px solid #f0e6db; border-radius: 6px;">
      <div style="margin-bottom: 16px;">
        <p style="margin: 0 0 8px 0; color: #00a2d1; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Donation Amount</p>
        <p style="margin: 0; color: #000000; font-size: 24px; font-weight: 700;">$${(amount / 100).toFixed(2)} <span style="font-size: 14px; color: #666666; font-weight: 400;">/ ${frequency === 'monthly' ? 'month' : 'year'}</span></p>
      </div>
      <div style="margin-bottom: 16px; padding-top: 16px; border-top: 1px solid #f0e6db;">
        <p style="margin: 0 0 8px 0; color: #00a2d1; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Frequency</p>
        <p style="margin: 0; color: #000000; font-size: 14px; font-weight: 600;">${frequency === 'monthly' ? 'Monthly' : 'Annual'}</p>
      </div>
      <div style="margin-bottom: 16px; padding-top: 16px; border-top: 1px solid #f0e6db;">
        <p style="margin: 0 0 8px 0; color: #00a2d1; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Confirmation ID</p>
        <p style="margin: 0; color: #000000; font-size: 14px; font-family: 'SF Mono', Monaco, monospace;">${orderId}</p>
      </div>
      <div style="margin-bottom: 16px; padding-top: 16px; border-top: 1px solid #f0e6db;">
        <p style="margin: 0 0 8px 0; color: #00a2d1; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Start Date</p>
        <p style="margin: 0; color: #000000; font-size: 14px;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      <div style="margin-bottom: 0; padding-top: 16px; border-top: 1px solid #f0e6db;">
        <p style="margin: 0 0 8px 0; color: #00a2d1; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Next Charge</p>
        <p style="margin: 0; color: #000000; font-size: 14px;">${new Date(new Date().setMonth(new Date().getMonth() + (frequency === 'monthly' ? 1 : 12))).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
    </div>

    <!-- Annual Total (monthly only) -->
    ${
      frequency === 'monthly'
        ? `
    <div style="margin-bottom: 48px; padding: 16px 24px; background-color: #ffffff; border: 1px solid #f0e6db; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
      <p style="margin: 0; color: #666666; font-size: 13px;">Annual contribution</p>
      <p style="margin: 0; color: #000000; font-size: 16px; font-weight: 700;">$${((amount / 100) * 12).toFixed(2)}</p>
    </div>
    `
        : ''
    }

    <!-- Impact Message -->
    <div style="margin-bottom: 48px; padding: 24px; background-color: #fddd58; border-radius: 6px;">
      <p style="margin: 0; color: #000000; font-size: 14px; line-height: 1.8; font-weight: 500;">
        Your recurring support means students can count on consistent resources, mentorship, and programs throughout the year. Thank you for your ongoing commitment to education!
      </p>
    </div>

    <!-- Cancel Info -->
    <div style="margin-bottom: 48px; padding: 16px 24px; background-color: #ffffff; border: 1px solid #f0e6db; border-radius: 6px;">
      <p style="margin: 0; color: #666666; font-size: 13px; line-height: 1.6;">
        <strong style="color: #1a1a1a;">Need to cancel?</strong> You can cancel your recurring donation at any time by contacting us at <a href="mailto:info@educationcomesfirst.org" style="color: #00a2d1; text-decoration: none; font-weight: 500;">info@educationcomesfirst.org</a>
      </p>
    </div>

    <!-- Tax Info -->
    <div style="margin-bottom: 48px;">
      <p style="margin: 0; color: #666666; font-size: 13px; line-height: 1.6;">
        <strong style="color: #1a1a1a;">Tax Information:</strong> Education Comes First is a 501(c)(3) nonprofit organization. Your donation is tax-deductible to the extent allowed by law. You will receive a receipt for each charge.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding-top: 24px; border-top: 1px solid #f0e6db; text-align: center;">
      <p style="margin: 0 0 12px 0; color: #666666; font-size: 13px; line-height: 1.6;">
        Questions about your donation?<br>
        <a href="mailto:info@educationcomesfirst.org" style="color: #00a2d1; text-decoration: none; font-weight: 500;">info@educationcomesfirst.org</a>
      </p>
      <p style="margin: 12px 0 0 0; color: #999999; font-size: 12px; line-height: 1.5;">
        Education Comes First<br>
        © ${new Date().getFullYear()} Education Comes First. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`
