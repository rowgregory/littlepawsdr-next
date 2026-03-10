export const magicLinkTemplate = (url: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in to Education Comes First</title>
  <style>
    @media only screen and (max-width: 480px) {
      .header-title {
        font-size: 28px !important;
      }
      .main-text {
        font-size: 15px !important;
      }
      .button {
        padding: 14px 28px !important;
        font-size: 15px !important;
      }
      .link-text {
        font-size: 11px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background: #ffffff; font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 560px; margin: 0 auto; padding: 60px 20px;">
    
    <!-- Logo/Header -->
    <div style="margin-bottom: 56px;">
      <h1 class="header-title" style="margin: 0 0 4px 0; color: #000000; font-size: 32px; font-weight: 700; letter-spacing: -0.5px; font-family: 'Kanit', sans-serif;">
        Little Paws Dachshund Rescue
      </h1>
      <div style="width: 48px; height: 3px; background: #2bd4c0; border-radius: 2px;"></div>
    </div>

    <!-- Main Heading -->
    <h2 style="margin: 0 0 16px 0; color: #000000; font-size: 28px; font-weight: 700; font-family: 'Kanit', sans-serif; line-height: 1.3;">
      Your secure sign-in link
    </h2>

    <!-- Main Message -->
    <p class="main-text" style="margin: 0 0 40px 0; color: #666666; font-size: 17px; line-height: 1.6;">
      Click the button below to sign in to your account. This link expires in 15 minutes.
    </p>

    <!-- Sign In Button -->
    <div style="margin-bottom: 40px;">
      <a href="${url}" class="button" style="display: inline-block; background: #2bd4c0; color: #000000; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 16px; font-family: 'Lato', sans-serif; transition: transform 0.2s;">
        Sign in to your account
      </a>
    </div>

    <!-- Divider -->
    <div style="margin: 48px 0 32px 0;">
      <div style="height: 1px; background: #e5e5e5;"></div>
    </div>

    <!-- Copy Link Section -->
    <div style="margin-bottom: 48px;">
      <p style="margin: 0 0 12px 0; color: #999999; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
        Or copy this link
      </p>
      <p class="link-text" style="margin: 0; word-break: break-all; font-family: 'SF Mono', Monaco, 'Courier New', monospace; font-size: 12px; color: #2bd4c0; line-height: 1.8; padding: 12px 16px; background: #f8fafc; border-radius: 8px;">
        ${url}
      </p>
    </div>

    <!-- Security Notice -->
    <div style="margin-bottom: 56px; padding-left: 16px; border-left: 3px solid #2bd4c0;">
      <p style="margin: 0; color: #666666; font-size: 15px; line-height: 1.6;">
        <strong style="color: #000000;">Didn't request this?</strong><br>
        You can safely ignore this email. Your account is secure.
      </p>
    </div>

    <!-- Divider -->
    <div style="margin: 56px 0 32px 0;">
      <div style="height: 1px; background: #2bd4c0;"></div>
    </div>

    <!-- Footer -->
    <div style="margin-bottom: 24px;">
      <p style="margin: 0 0 12px 0; color: #999999; font-size: 14px; line-height: 1.6;">
        Questions? We're here to help.
      </p>
      <p style="margin: 0 0 8px 0;">
        <a href="mailto:info@littlepawsdr.org" style="color: #2bd4c0; text-decoration: none; font-size: 14px; font-weight: 500;">
          info@littlepawsdr.org
        </a>
      </p>
      <p style="margin: 0;">
        <a href="https://www.littlepawsdr.org" style="color: #2bd4c0; text-decoration: none; font-size: 14px; font-weight: 500;">
          www.littlepawsdr.org
        </a>
      </p>
    </div>

    <!-- Legal Links -->
    <div style="margin-top: 32px;">
      <p style="margin: 0; font-size: 12px; color: #bbbbbb; line-height: 1.5;">
        <a href="https://www.littlepawsdr.org/privacy" style="color: #bbbbbb; text-decoration: none; margin-right: 16px;">Privacy Policy</a>
        <a href="https://www.littlepawsdr.org/terms" style="color: #bbbbbb; text-decoration: none;">Terms of Service</a>
      </p>
    </div>

    <!-- Bottom Tagline -->
    <div style="margin-top: 48px;">
      <p style="margin: 0; color: #cccccc; font-size: 13px; line-height: 1.5;">
        Little Paws Dachshund Rescue
      </p>
    </div>
  </div>
</body>
</html>
`
