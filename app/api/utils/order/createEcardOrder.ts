import { createLog } from 'app/utils/logHelper'
import mongoose from 'mongoose'
import { sendSparkPostEmail } from '../sendSparkPostEmail'
import EcardOrder from 'models/ecardOrderModel'

interface EcardProps {
  productId?: string
  recipientsFullName: string
  recipientsEmail: string
  dateToSend: Date
  email: string
  message: string
  totalPrice: number
  subtotal?: number
  image: string
  isSent?: boolean
  quantity?: number
  isPhysicalProduct?: boolean
  productName?: string
  name?: string
  orderId?: string
  sendNow?: string
  status?: string
  user?: { id: string; email: string }
}

export async function createEcardOrder(ecards: EcardProps[], orderId: mongoose.Types.ObjectId, session: mongoose.ClientSession) {
  try {
    // Create all ecards, unwrap the array returned by create()
    const createdEcardOrders = await Promise.all(
      ecards.map(
        (ecard) =>
          EcardOrder.create(
            [
              {
                orderId,
                productId: ecard.productId,
                recipientsFullName: ecard.recipientsFullName,
                recipientsEmail: ecard.recipientsEmail,
                dateToSend: ecard.dateToSend,
                email: ecard.email,
                message: ecard.message,
                totalPrice: ecard.totalPrice,
                subtotal: ecard.subtotal,
                image: ecard.image,
                isSent: ecard.isSent ?? false,
                quantity: ecard.quantity ?? 1,
                isPhysicalProduct: ecard.isPhysicalProduct ?? false,
                productName: ecard.productName,
                name: ecard.name,
                sendNow: ecard.sendNow,
                status: ecard.status ?? 'Not sent'
              }
            ],
            session ? { session } : undefined
          ).then((results) => results[0]) // unwrap single created document from array
      )
    )

    // For each created ecard document, check sendNow and send email if needed
    await Promise.all(
      createdEcardOrders.map(async (createdEcard) => {
        if (createdEcard.sendNow === 'true') {
          await sendSparkPostEmail(createdEcard)
          console.log(`Sent ecard email to ${createdEcard.recipientsEmail}`)
        }
      })
    )

    return createdEcardOrders
  } catch (error: any) {
    const user = ecards.length > 0 && ecards[0].user ? { id: ecards[0].user.id, email: ecards[0].user.email } : undefined

    await createLog('error', 'Error creating ECard', {
      functionName: 'CREATE_ECARD_ORDER',
      name: error.name,
      message: error.message,
      url: undefined,
      method: undefined,
      timestamp: new Date().toISOString(),
      user
    })

    throw error
  }
}
