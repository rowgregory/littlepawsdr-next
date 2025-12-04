import { sendSparkPostEmail } from '../sendSparkPostEmail'
import EcardOrder from 'models/ecardOrderModel'

export async function sendScheduledEcards() {
  const now = new Date()

  const startOfDay = new Date(now)
  startOfDay.setUTCHours(0, 0, 0, 0)

  const endOfDay = new Date(now)
  endOfDay.setUTCHours(23, 59, 59, 999)

  // Find all eCards scheduled to send today or earlier that have not been sent yet
  const ecardsToSend = await EcardOrder.find({
    dateToSend: { $lte: endOfDay },
    isSent: false
  })

  const results = []

  for (const ecard of ecardsToSend) {
    try {
      await sendSparkPostEmail(
        {
          recipientsEmail: ecard.recipientsEmail,
          recipientsFullName: ecard.recipientsFullName,
          name: ecard.name,
          message: ecard.message,
          subMessage: ecard.subMessage,
          recipientName: ecard.recipientName,
          theme: ecard.theme,
          background: ecard.background,
          textColor: ecard.textColor,
          fontSize: ecard.fontSize,
          font: ecard.font,
          icon: ecard.icon
        },
        process.env.SPARKPOST_API_KEY
      )

      ecard.isSent = true
      ecard.status = 'Sent'
      await ecard.save()

      results.push({ ecardId: ecard._id, status: 'sent' })
    } catch (error: any) {
      results.push({
        ecardId: ecard._id,
        status: 'error',
        error: error.message
      })
    }
  }

  return results
}
