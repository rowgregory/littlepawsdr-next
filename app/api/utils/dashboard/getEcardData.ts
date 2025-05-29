import EcardOrder from 'models/ecardOrderModel'

export async function getECardData() {
  const result = await EcardOrder.aggregate([
    {
      $facet: {
        pipeline1: [
          {
            $group: {
              _id: '$productId',
              totalSales: { $sum: 1 },
              totalRevenue: { $sum: '$totalPrice' },
              details: { $first: '$$ROOT' }
            }
          },
          {
            $sort: {
              totalSales: -1,
              'details.createdAt': 1
            }
          },
          {
            $project: {
              productId: '$_id',
              totalSales: 1,
              totalRevenue: 1,
              productName: '$details.productName',
              name: '$details.name',
              createdAt: '$details.createdAt',
              updatedAt: '$details.updatedAt'
            }
          }
        ],
        pipeline2: [
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$totalPrice' }
            }
          }
        ],
        pipeline3: [{ $count: 'totalDocuments' }]
      }
    }
  ])

  const { pipeline1: orders, pipeline2: revenueArr, pipeline3: countArr } = result[0] ?? {}

  return {
    orders,
    revenue: revenueArr?.[0]?.totalRevenue ?? 0,
    totalOrders: countArr?.[0]?.totalDocuments ?? 0
  }
}
