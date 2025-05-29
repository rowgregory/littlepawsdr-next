import ProductOrder from 'models/productOrderModel'
import mongoose from 'mongoose'

async function createProductOrders(products: any[], orderId: mongoose.Types.ObjectId, session: mongoose.ClientSession) {
  const productOrders = await Promise.all(
    products.map(async (product) => {
      return await ProductOrder.create(
        {
          orderId,
          price: product.price,
          productId: product.productId,
          productImage: product.productImage,
          productName: product.productName,
          quantity: product.quantity,
          size: product.size,
          email: product.email,
          isPhysicalProduct: product.isPhysicalProduct ?? true,
          subtotal: product.subtotal,
          status: 'Pending Fulfillment'
        },
        { session }
      )
    })
  )

  return productOrders
}

export default createProductOrders
