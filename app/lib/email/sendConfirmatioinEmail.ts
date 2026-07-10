import { Order, OrderItem } from '@prisma/client'
import { orderConfirmationTemplate, getOrderEmailSubject } from 'app/lib/email/templates/order-confirmation.template'
import { resend } from 'app/lib/email/resend'

type OrderWithItems = Order & { items: OrderItem[] }

export default async function sendConfirmationEmail(order: OrderWithItems) {
  try {
    await resend.emails.send({
      from: `Little Paws Dachshund Rescue <${process.env.RESEND_FROM_EMAIL}>`,
      to: order.customerEmail,
      subject: getOrderEmailSubject(order),
      html: orderConfirmationTemplate(order)
    })
  } catch (err) {
    console.error('Error sending confirmation email:', err)
  }
}
