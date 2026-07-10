import { Order, OrderItem, OrderType } from '@prisma/client'

type OrderWithItems = Order & { items: OrderItem[] }

// ─── Copy per order type ──────────────────────────────────────────────────────

const ORDER_COPY: Record<OrderType, { heading: string; body: string }> = {
  ONE_TIME_DONATION: {
    heading: 'Thank you for your donation!',
    body: 'Your one-time donation has been received. Every dollar goes directly toward the dogs in our care.'
  },
  RECURRING_DONATION: {
    heading: 'Your recurring gift is active!',
    body: "Your recurring donation has been set up successfully. Your ongoing support means the world to the dogs in our care — you'll be charged automatically until you choose to cancel."
  },
  ADOPTION_FEE: {
    heading: 'Your adoption fee is received!',
    body: "We've received your adoption fee payment. Our team will be in touch shortly with next steps."
  },
  PRODUCT: {
    heading: 'Your order is confirmed!',
    body: "Thank you for your purchase. You're helping support Little Paws with every order."
  },
  WELCOME_WIENER: {
    heading: "You're sponsoring a dachshund!",
    body: 'Thank you for your Welcome Wiener sponsorship. Your support makes a direct difference in the life of a dog in our care.'
  },
  AUCTION_PURCHASE: {
    heading: 'Your auction payment is confirmed!',
    body: 'Thank you for your purchase. Your payment has been received and your item will be on its way soon.'
  },
  MIXED: {
    heading: 'Your order is confirmed!',
    body: "Thank you for your purchase and support. You're helping make a difference for the dogs at Little Paws."
  },
  FEED_A_FOSTER: {
    heading: 'Thank you for feeding a foster!',
    body: "Your donation will go directly toward food for a dog currently in foster care. We can't do this without you."
  }
}

// ─── Subject lines ────────────────────────────────────────────────────────────

export function getOrderEmailSubject(order: OrderWithItems): string {
  const freq = order.recurringFrequency === 'YEARLY' ? 'Annual' : 'Monthly'
  const subjects: Record<OrderType, string> = {
    ONE_TIME_DONATION: 'Thank You for Supporting Little Paws!',
    RECURRING_DONATION: `Your ${freq} Gift to Little Paws is Active`,
    ADOPTION_FEE: 'Your Adoption Fee Payment is Received',
    PRODUCT: 'Your Little Paws Order is Confirmed',
    WELCOME_WIENER: "You're Sponsoring a Dachshund — Thank You!",
    AUCTION_PURCHASE: 'Your Auction Payment is Confirmed — Thank You!',
    MIXED: 'Your Little Paws Order is Confirmed',
    FEED_A_FOSTER: 'Thank You for Feeding a Foster!'
  }
  return subjects[order.type]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (amount: number | string) => `$${Number(amount).toFixed(2)}`

const fmtDate = (date: Date | string) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

const row = (label: string, value: string) => `
  <tr>
    <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #71717a; font-size: 13px; width: 160px;">${label}</td>
    <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #09090b; font-size: 14px; font-weight: 700; text-align: right; font-family: 'Courier New', monospace;">${value}</td>
  </tr>`

const accentRow = (label: string, value: string) => `
  <tr>
    <td style="padding: 16px 0 0 0; color: #09090b; font-size: 14px; font-weight: 700;">${label}</td>
    <td style="padding: 16px 0 0 0; color: #0891b2; font-size: 16px; text-align: right; font-family: 'Courier New', monospace; font-weight: 900;">${value}</td>
  </tr>`

const noticeBlock = (heading: string, body: string) => `
  <div style="margin-bottom: 24px; padding: 16px; background: #f4f4f5; border: 1px solid #e4e4e7; border-left: 3px solid #0891b2;">
    <p style="margin: 0; color: #71717a; font-size: 13px; line-height: 1.7;">
      <strong style="color: #09090b;">${heading}</strong><br>${body}
    </p>
  </div>`

// ─── Template ─────────────────────────────────────────────────────────────────

export function orderConfirmationTemplate(order: OrderWithItems): string {
  const copy = ORDER_COPY[order.type]
  const hasItems = order.items.length > 0
  const firstName = order.customerName.split(' ')[0]

  // ── Details table rows ──────────────────────────────────
  const detailRows: string[] = []

  // Line items (cart-based orders)
  if (hasItems) {
    const itemRows = order.items
      .map((item) => row(item.itemName ?? 'Item', fmt(Number(item.price) * (item.quantity ?? 1))))
      .join('')

    detailRows.push(itemRows)
    detailRows.push(accentRow('Total', fmt(Number(order.totalAmount))))
  } else {
    detailRows.push(accentRow('Amount', fmt(Number(order.totalAmount))))
  }

  if (order.coverFees) {
    detailRows.push(row('Processing fee covered', fmt(Number(order.feesCovered))))
  }

  if (order.isRecurring && order.recurringFrequency) {
    const freq = order.recurringFrequency === 'YEARLY' ? 'Annual' : 'Monthly'
    detailRows.push(row('Frequency', freq))
    if (order.nextBillingDate) {
      detailRows.push(row('Next charge', fmtDate(order.nextBillingDate)))
    }
    if (order.recurringFrequency === 'YEARLY') {
      detailRows.push(row('Annual contribution', fmt(Number(order.totalAmount) * 12)))
    }
  }

  detailRows.push(row('Date', fmtDate(order.createdAt)))
  detailRows.push(row('Confirmation ID', order.id))

  // ── Shipping address ────────────────────────────────────
  const shippingBlock =
    order.isPhysical && order.addressLine1
      ? `
    <div style="margin-bottom: 36px;">
      <p style="margin: 0 0 12px 0; color: #71717a; font-size: 9px; font-family: 'Courier New', monospace; letter-spacing: 0.2em; text-transform: uppercase;">
        Ships to
      </p>
      <div style="padding: 16px; background: #f4f4f5; border: 1px solid #e4e4e7;">
        <p style="margin: 0; color: #09090b; font-size: 14px; line-height: 1.8;">
          ${order.addressLine1}${order.addressLine2 ? `, ${order.addressLine2}` : ''}<br>
          ${order.city}, ${order.state} ${order.zipPostalCode}
        </p>
      </div>
    </div>`
      : ''

  // ── Notice blocks ───────────────────────────────────────
  const notices: string[] = []

  if (order.isRecurring) {
    notices.push(
      noticeBlock(
        'Need to cancel?',
        'You can cancel your recurring donation at any time by contacting us at <a href="mailto:info@littlepawsdr.org" style="color: #0891b2; text-decoration: none; font-weight: 500;">info@littlepawsdr.org</a>'
      )
    )
  }

  if (
    order.type === 'ADOPTION_FEE' ||
    order.type === 'ONE_TIME_DONATION' ||
    order.type === 'RECURRING_DONATION' ||
    order.type === 'FEED_A_FOSTER'
  ) {
    notices.push(
      noticeBlock(
        'Tax information',
        'Little Paws Dachshund Rescue is a 501(c)(3) nonprofit organization. Your donation is tax-deductible to the extent allowed by law.'
      )
    )
  }

  // ── Full template ───────────────────────────────────────
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${getOrderEmailSubject(order)}</title>
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

    <!-- Heading -->
    <h1 class="main-heading" style="margin: 0 0 12px 0; color: #09090b; font-size: 26px; font-weight: 900; line-height: 1.2;">
      ${copy.heading.replace('!', `, ${firstName}!`)}
    </h1>

    <!-- Body -->
    <p class="main-text" style="margin: 0 0 36px 0; color: #71717a; font-size: 15px; line-height: 1.7;">
      ${copy.body}
    </p>

    <!-- Details table -->
    <div style="margin-bottom: 36px;">
      <p style="margin: 0 0 12px 0; color: #71717a; font-size: 9px; font-family: 'Courier New', monospace; letter-spacing: 0.2em; text-transform: uppercase;">
        Order details
      </p>
      <table style="width: 100%; border-collapse: collapse;">
        ${detailRows.join('')}
      </table>
    </div>

    ${shippingBlock}

    <!-- Divider -->
    <div style="margin: 40px 0; height: 1px; background: #e4e4e7;"></div>

    ${notices.join('')}

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
</html>`
}
