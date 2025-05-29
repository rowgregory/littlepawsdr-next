import DogBoostOrder from 'models/dogBoostOrderModel'

export async function getDogBoostData() {
  const result = await DogBoostOrder.aggregate([
    {
      $facet: {
        pipeline1: [
          {
            $group: {
              _id: '$productId',
              totalSales: { $sum: 1 },
              totalRevenue: { $sum: '$price' },
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
              price: '$details.price',
              productName: '$details.productName',
              dachshundName: '$details.dachshundName',
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
        pipeline3: [{ $count: 'totalDocuments' }],
        pipeline4: [
          { $sort: { createdAt: 1 } },
          {
            $group: {
              _id: null,
              firstOrderCreatedAt: { $first: '$createdAt' }
            }
          }
        ]
      }
    }
  ])

  const { pipeline1: orders, pipeline2: revenueArr, pipeline3: countArr, pipeline4: firstOrderArr } = result[0] ?? {}

  return {
    orders,
    revenue: revenueArr?.[0]?.totalRevenue ?? 0,
    totalOrders: countArr?.[0]?.totalDocuments ?? 0,
    firstOrderCreatedAt: firstOrderArr?.[0]?.firstOrderCreatedAt ?? null
  }
}
