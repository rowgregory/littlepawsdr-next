export function contactEmailTemplate({ name, email, subject, message }: { name: string; email: string; subject: string; message: string }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'SF Mono','SFMono-Regular',Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:24px;height:0.5px;background-color:#0891b2;vertical-align:middle;"></td>
                  <td style="padding-left:12px;">
                    <span style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#0891b2;">
                      Little Paws Dachshund Rescue
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#ffffff;border:1px solid #e4e4e7;">

              <!-- Subject -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:24px 28px;border-bottom:1px solid #e4e4e7;">
                    <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#71717a;">
                      New Contact Message
                    </p>
                    <h1 style="margin:0;font-size:20px;font-weight:900;color:#09090b;line-height:1.2;font-family:'SF Mono','SFMono-Regular',Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;">
                      ${subject}
                    </h1>
                  </td>
                </tr>

                <!-- Name -->
                <tr>
                  <td style="padding:20px 28px;border-bottom:1px solid #e4e4e7;background-color:#f4f4f5;">
                    <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#71717a;">Name</p>
                    <p style="margin:0;font-size:13px;color:#09090b;">${name}</p>
                  </td>
                </tr>

                <!-- Email -->
                <tr>
                  <td style="padding:20px 28px;border-bottom:1px solid #e4e4e7;">
                    <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#71717a;">Reply To</p>
                    <a href="mailto:${email}" style="margin:0;font-size:13px;color:#0891b2;text-decoration:none;">${email}</a>
                  </td>
                </tr>

                <!-- Message -->
                <tr>
                  <td style="padding:20px 28px;border-bottom:1px solid #e4e4e7;background-color:#f4f4f5;">
                    <p style="margin:0 0 8px 0;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#71717a;">Message</p>
                    <p style="margin:0;font-size:13px;color:#09090b;line-height:1.7;white-space:pre-wrap;">${message}</p>
                  </td>
                </tr>

                <!-- CTA -->
                <tr>
                  <td style="padding:24px 28px;">
                    
                    <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}"
                      style="display:inline-block;padding:12px 24px;background-color:#0891b2;color:#ffffff;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;font-family:'SF Mono','SFMono-Regular',Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;"
                    >
                      Reply to ${name}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;">
              <p style="margin:0;font-size:10px;letter-spacing:0.1em;color:#71717a;text-align:center;">
                Little Paws Dachshund Rescue &mdash; info@littlepawsdr.org
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
