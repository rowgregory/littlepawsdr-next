import { OrderType } from '@prisma/client'
import { adoptionFeeConfirmationTemplate } from 'app/lib/email-templates/adoption-fee'
import { auctionConfirmationTemplate } from 'app/lib/email-templates/auction'
import { oneTimedonationConfirmationTemplate } from 'app/lib/email-templates/one-time-donation'
import { productConfirmationTemplate } from 'app/lib/email-templates/product'
import { recurringDonationConfirmationTemplate } from 'app/lib/email-templates/recurring-donation'
import { welcomeWienerConfirmationTemplate } from 'app/lib/email-templates/welcome-wiener'
import { resend } from 'app/lib/resend'

export default async function sendConfirmationEmail(order: any, orderType: OrderType, amount: number) {
  try {
    let emailHtml: string
    let subject: string

    if (orderType === 'ONE_TIME_DONATION') {
      emailHtml = oneTimedonationConfirmationTemplate(order.customerName, amount, order.id)
      subject = 'Thank You for Supporting Little Paws!'
    } else if (orderType === 'RECURRING_DONATION') {
      const frequency = order.recurringFrequency || 'monthly'
      emailHtml = recurringDonationConfirmationTemplate(order.customerName, amount, frequency, order.id)
      subject = `Your ${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Gift to Little Paws is Active`
    } else if (orderType === 'WELCOME_WIENER') {
      emailHtml = welcomeWienerConfirmationTemplate(order.customerName, amount, order.id)
      subject = `You're Sponsoring a Dachshund — Thank You!`
    } else if (orderType === 'PRODUCT' || orderType === 'MIXED') {
      emailHtml = productConfirmationTemplate(order.customerName, amount, order.id)
      subject = `Your Little Paws Order is Confirmed`
    } else if (orderType === 'AUCTION_PURCHASE') {
      emailHtml = auctionConfirmationTemplate(order.customerName, amount, order.id)
      subject = `Your Auction Payment is Confirmed — Thank You!`
    } else if (orderType === 'ADOPTION_FEE') {
      emailHtml = adoptionFeeConfirmationTemplate(order.customerName, amount, order.id)
      subject = `Your Adoption Fee Payment is Received`
    }

    await resend.emails.send({
      from: `Little Paws Dachshund Rescue <${process.env.RESEND_FROM_EMAIL}>`,
      to: order.customerEmail,
      subject,
      html: emailHtml
    })
  } catch (emailError) {
    console.error('Error sending confirmation email:', emailError)
  }
}
