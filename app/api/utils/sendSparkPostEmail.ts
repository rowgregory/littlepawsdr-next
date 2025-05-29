export async function sendSparkPostEmail(
  data: Record<string, any>, // ecard details like name, image, message, price, etc.
  apiKey?: string
) {
  const SPARKPOST_API_KEY = apiKey ?? process.env.SPARKPOST_API_KEY!;
  const url = "https://api.sparkpost.com/api/v1/transmissions";

  // Basic email template example using substitution data.
  // You can create a template in SparkPost dashboard and reference it here by template_id.
  // Or build the HTML here directly.
  const payload = {
    options: {
      sandbox: false, // true = test mode (won't send to actual recipients)
    },
    content: {
      from: {
        email: "no-reply@littlepawsdr.org",
        name: "Little Paws Dachshund Rescue",
      },
      reply_to: "lpdr@littlepawsdr.org",
      subject: `Your Ecard: ${data.ecardName}`,
      html: `
        <html>
          <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; padding: 20px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 30px; text-align: center; border-bottom: 1px solid #e0e0e0;">
                        <h1 style="color: #333333; margin: 0; font-size: 28px;">You've received an ecard!</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 30px; text-align: center;">
                        <p style="font-size: 18px; color: #555555; margin: 0 0 10px;">Hi <strong>{{RECIPIENT_NAME}}</strong>,</p>
                        <p style="font-size: 16px; color: #555555; margin: 0 0 20px;"><strong>{{SENDER_NAME}}</strong> sent you a message:</p>
                        <blockquote style="font-size: 16px; font-style: italic; color: #333333; margin: 0 0 20px;">"{{MESSAGE}}"</blockquote>
                        <img 
                          src="{{ECARD_IMAGE_URL}}" 
                          alt="Ecard Image" 
                          style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); margin-top: 20px;" />
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 30px; background-color: #f1f1f1; border-radius: 0 0 8px 8px; text-align: center; font-size: 14px; color: #999999;">
                        Little Paws Dachshund Rescue &copy; {{YEAR}}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
`,

      // alternatively, use 'template_id' if you created a SparkPost template
      // template_id: "your-template-id",
    },
    recipients: [
      {
        address: {
          email: data.recipientsEmail,
        },
        substitution_data: {
          RECIPIENT_NAME: data.recipientsFullName,
          SENDER_NAME: data.name,
          MESSAGE: data.message || "Enjoy your ecard!",
          ECARD_IMAGE_URL: data.ecardImage,
          YEAR: new Date().getFullYear(),
        },
      },
    ],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SPARKPOST_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`SparkPost API error: ${res.status} - ${errorText}`);
  }

  return await res.json();
}
