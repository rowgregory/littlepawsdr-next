type Params = {
  name: string | null
  amount: number
  failureReason: string | null
  myPackUrl: string
}

export function paymentFailedTemplate({ name, amount, failureReason, myPackUrl }: Params): string {
  const greeting = name ? `Hi ${name.split(' ')[0]},` : 'Hi there,'
  const reason = failureReason ?? 'Your payment could not be processed.'

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Payment failed</title>
</head>
<body style="margin:0;padding:0;background:#f9f8f6;font-family:'Courier New',monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f8f6;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:24px;"><hr style="border:none;border-top:1px solid #c05a2f;margin:0;" /></td>
                  <td style="padding:0 10px;white-space:nowrap;">
                    <span style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#c05a2f;">
                      Little Paws
                    </span>
                  </td>
                  <td style="width:24px;"><hr style="border:none;border-top:1px solid #c05a2f;margin:0;" /></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border:1px solid #e5e2dc;position:relative;">
              <!-- Top accent -->
              <div style="height:2px;background:#c05a2f;width:100%;"></div>

              <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 32px 28px;">

                <!-- Alert icon + title -->
                <tr>
                  <td style="padding-bottom:20px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:40px;height:40px;border:1px solid rgba(239,68,68,0.3);background:rgba(239,68,68,0.05);text-align:center;vertical-align:middle;">
                          <span style="font-size:18px;line-height:1;">⚠</span>
                        </td>
                        <td style="padding-left:14px;">
                          <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#ef4444;">
                            Payment failed
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Greeting -->
                <tr>
                  <td style="padding-bottom:8px;">
                    <p style="margin:0;font-family:Georgia,serif;font-size:22px;font-weight:700;color:#1a1a18;line-height:1.2;">
                      ${greeting}
                    </p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding-bottom:20px;">
                    <p style="margin:0;font-family:'Courier New',monospace;font-size:12px;color:#666;line-height:1.7;">
                      We were unable to process your recurring donation of
                      <strong style="color:#1a1a18;">$${amount.toFixed(2)}</strong>
                      to Little Paws Dachshund Rescue.
                    </p>
                  </td>
                </tr>

                <!-- Reason box -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e2dc;background:#f9f8f6;">
                      <tr>
                        <td style="padding:12px 16px;">
                          <p style="margin:0 0 4px;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#999;">
                            Reason
                          </p>
                          <p style="margin:0;font-family:'Courier New',monospace;font-size:12px;color:#1a1a18;">
                            ${reason}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <p style="margin:0 0 14px;font-family:'Courier New',monospace;font-size:12px;color:#666;line-height:1.7;">
                      To keep your donation active, please update your payment method in My Pack.
                    </p>
                    <a href="${myPackUrl}"
                      style="display:inline-block;background:#c05a2f;color:#ffffff;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;padding:12px 24px;">
                      Update payment method
                    </a>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding-bottom:20px;">
                    <hr style="border:none;border-top:1px solid #e5e2dc;margin:0;" />
                  </td>
                </tr>

                <!-- Footer note -->
                <tr>
                  <td>
                    <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;color:#999;line-height:1.6;">
                      If you have questions, reply to this email or reach us at
                      <a href="mailto:info@littlepawsdr.org" style="color:#c05a2f;text-decoration:none;">
                        info@littlepawsdr.org
                      </a>.
                      Thank you for supporting the pups.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:20px;text-align:center;">
              <p style="margin:0;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#bbb;">
                Little Paws Dachshund Rescue · littlepawsdr.org
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
