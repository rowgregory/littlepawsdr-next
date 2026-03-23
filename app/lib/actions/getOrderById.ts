'use server'

import prisma from 'prisma/client'
import { createLog } from './createLog'

export const getOrderById = async (id: string) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
        status: true,
        totalAmount: true,
        feesCovered: true,
        coverFees: true,
        isRecurring: true,
        recurringFrequency: true,
        customerEmail: true,
        customerName: true,
        paidAt: true,
        createdAt: true,
        notes: true,
        isPhysical: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        state: true,
        zipPostalCode: true,
        items: {
          select: {
            id: true,
            itemName: true,
            itemImage: true,
            quantity: true,
            price: true,
            subtotal: true,
            totalPrice: true,
            isPhysical: true
          }
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    if (!order) return { success: false, data: null }

    return {
      success: true,
      data: {
        ...order,
        totalAmount: Number(order.totalAmount),
        feesCovered: Number(order.feesCovered),
        items: order.items.map((item) => ({
          ...item,
          price: Number(item.price),
          subtotal: item.subtotal ? Number(item.subtotal) : null,
          totalPrice: item.totalPrice ? Number(item.totalPrice) : null
        }))
      }
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch order', {
      id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, data: null }
  }
}
